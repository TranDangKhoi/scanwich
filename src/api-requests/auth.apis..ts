import http from "src/lib/http";
import {
  TLoginBody,
  TLoginRes,
  TLogoutBody,
  TRefreshTokenBody,
  TRefreshTokenRes,
} from "src/validations/auth.validations";

export const authApi = {
  login: (body: TLoginBody) => http.post<TLoginRes, TLoginBody>("/auth/login", body),
  loginServerSide: (body: TLoginBody) =>
    http.post<TLoginRes, TLoginBody>("/api/auth/login", body, {
      baseUrl: "",
    }),
  logout: (body: TLogoutBody, accessToken: string) =>
    http.post<any, TLogoutBody>("/auth/logout", body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  logoutServerSide: () =>
    http.post<any, any>("/api/auth/logout", JSON.stringify({}), {
      baseUrl: "",
    }),
  refreshToken: (body: TRefreshTokenBody) =>
    http.post<TRefreshTokenRes, TRefreshTokenBody>("/auth/refresh-token", body),
  refreshTokenServerSide: () =>
    http.post<TRefreshTokenRes, any>("/api/auth/refresh-token", JSON.stringify({}), {
      baseUrl: "",
    }),
};
