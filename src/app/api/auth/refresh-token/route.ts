import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { authApi } from "src/api-requests/auth.apis.";
import { MESSAGES } from "src/constants/messages.constants";
import { HttpError } from "src/lib/http";
import { calculateCookieExpires } from "src/lib/utils";
import { TRefreshTokenBody } from "src/validations/auth.validations";

export async function POST(req: Request) {
  const body: TRefreshTokenBody = await req.json();
  const cookieStore = cookies();
  if (!body.refreshToken) {
    return Response.json(
      {
        message: "Refresh token không tồn tại",
      },
      {
        status: 401,
      },
    );
  }
  try {
    const { payload } = await authApi.refreshToken(body);
    const { accessToken, refreshToken } = payload.data;
    const { exp: accessTokenExpires } = jwtDecode(accessToken);
    const { exp: refreshTokenExpires } = jwtDecode(refreshToken);
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      expires: calculateCookieExpires(accessTokenExpires as number),
    });
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      expires: calculateCookieExpires(refreshTokenExpires as number),
    });
    return Response.json(payload.data, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError) {
      return new Response(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(MESSAGES.DEFAULT_SOMETHING_WENT_WRONG, {
        status: 500,
      });
    }
  }
}
