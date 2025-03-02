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
  logoutServerSide: (body: TLogoutBody) =>
    http.post<any, TLogoutBody>("/api/auth/logout", body, {
      baseUrl: "",
    }),
  refreshToken: (body: TRefreshTokenBody) =>
    http.post<TRefreshTokenRes, TRefreshTokenBody>("/auth/refresh-token", body),
  refreshTokenServerSide: (body: TRefreshTokenBody) =>
    http.post<TRefreshTokenRes, TRefreshTokenBody>("/api/auth/refresh-token", body, {
      baseUrl: "",
    }),
};
