import http from "src/lib/http";
import { TAccountRes, TChangePasswordBody, TUpdateMeBody } from "src/validations/account.validations";

export const accountApi = {
  getMyProfile: () => http.get<TAccountRes>("/accounts/me"),
  updateMyProfile: (body: TUpdateMeBody) => http.put<TAccountRes, TUpdateMeBody>("/accounts/me", body),
  changeMyPassword: (body: TChangePasswordBody) =>
    http.put<TAccountRes, TChangePasswordBody>("/accounts/change-password", body),
};
