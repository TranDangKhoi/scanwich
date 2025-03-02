import http from "src/lib/http";
import { TLogoutBody, TRefreshTokenBody } from "src/validations/auth.validations";
import { TGuestLoginBody } from "src/validations/guest.validations";

export const guestApi = {
  login: (body: TGuestLoginBody) => http.post("/guest/auth/login", body),
  loginServerSide: (body: TGuestLoginBody) => http.post("/api/guest/auth/login", body),
  logout: (body: TLogoutBody) => http.post("/guest/auth/logout", body),
  logoutServerSide: (body: TLogoutBody) => http.post("/api/guest/auth/logout", body),
  refreshToken: (body: TRefreshTokenBody) => http.post("/guest/auth/refresh-token", body),
};
