import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { authApi } from "src/api-requests/auth.apis";
import { MESSAGES } from "src/constants/messages.constants";
import { HttpError } from "src/lib/http";
import { calculateCookieExpires } from "src/lib/utils";
import { TLoginBody } from "src/validations/auth.validations";

export async function POST(request: Request) {
  const body: TLoginBody = await request.json();
  const cookieStore = cookies();
  try {
    const { payload } = await authApi.login(body);
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
      status: 201,
    });
  } catch (error) {
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
