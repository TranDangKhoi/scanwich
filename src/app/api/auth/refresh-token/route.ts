import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { authApi } from "src/api-requests/auth.apis";
import { MESSAGES } from "src/constants/messages.constants";
import { HttpError } from "src/lib/http";
import { calculateCookieExpires } from "src/lib/utils";

export async function POST() {
  const cookieStore = cookies();
  const refreshTokenInCookies = cookieStore.get("refreshToken")?.value as string;
  if (!refreshTokenInCookies) {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return Response.json(
      {
        message: "Không tìm thấy refresh token",
      },
      {
        status: 401,
      },
    );
  }
  try {
    const { payload } = await authApi.refreshToken({ refreshToken: refreshTokenInCookies });
    const { accessToken, refreshToken } = payload.data;
    const { exp: accessTokenExpires } = jwtDecode(accessToken);
    const { exp: refreshTokenExpires } = jwtDecode(refreshToken);

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: calculateCookieExpires(accessTokenExpires as number),
      path: "/",
    });
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: calculateCookieExpires(refreshTokenExpires as number),
      path: "/",
    });
    return Response.json(payload, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    // Clear cookies on refresh token failure
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: MESSAGES.DEFAULT_SOMETHING_WENT_WRONG,
        },
        {
          status: 500,
        },
      );
    }
  }
}
