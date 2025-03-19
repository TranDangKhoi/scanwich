import http from "src/lib/http";
import {
  TAccountListRes,
  TAccountRes,
  TChangePasswordBody,
  TCreateEmployeeAccountBody,
  TUpdateEmployeeAccountBody,
  TUpdateMeBody,
} from "src/validations/account.validations";

export const accountApi = {
  getMyProfile: () => http.get<TAccountRes>("/accounts/me"),
  getMyProfileServerComponent: (accessToken: string) =>
    http.get<TAccountRes>("api/accounts/me", {
      baseUrl: "",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  updateMyProfile: (body: TUpdateMeBody) => http.put<TAccountRes, TUpdateMeBody>("/accounts/me", body),
  changeMyPassword: (body: TChangePasswordBody) =>
    http.put<TAccountRes, TChangePasswordBody>("/accounts/change-password", body),

  // Owner APIs
  getAllAccounts: () => http.get<TAccountListRes>("/accounts"),
  getAccountDetail: (id: string) => http.get<TAccountRes>(`/accounts/detail/${id}`),
  addAccount: (body: TCreateEmployeeAccountBody) =>
    http.post<TAccountRes, TCreateEmployeeAccountBody>("/accounts", body),
  editAccount: (id: string, body: TUpdateEmployeeAccountBody) =>
    http.post<TAccountRes, TUpdateEmployeeAccountBody>(`/accounts/detail/${id}`, body),
};
