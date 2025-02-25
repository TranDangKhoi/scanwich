import http from "src/lib/http";
import { TLoginBody, TLoginRes, TLogoutBody, TRefreshTokenBody } from "src/validations/auth.validations";

export const authApi = {
  login: (body: TLoginBody) => http.post<TLoginRes, TLoginBody>("/auth/login", body),
  loginServerSide: (body: TLoginBody) =>
    http.post<TLoginRes, TLoginBody>("api/auth/login", body, {
      baseUrl: "",
    }),
  logout: (body: TLogoutBody) => http.post<any, TLogoutBody>("/auth/logout", body),
  logoutServerSide: (body: TLogoutBody) =>
    http.post<any, TLogoutBody>("api/auth/logout", body, {
      baseUrl: "",
    }),
  refreshToken: (body: TRefreshTokenBody) => http.post<any, TRefreshTokenBody>("/auth/refresh-token", body),
  refreshTokenServerSide: (body: TRefreshTokenBody) =>
    http.post<any, TRefreshTokenBody>("api/auth/refresh-token", body, {
      baseUrl: "",
    }),
};
