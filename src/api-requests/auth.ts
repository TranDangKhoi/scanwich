import http from "src/lib/http";
import { TLoginBody, TLoginRes } from "src/validations/auth.validations";

export const authApi = {
  login: (body: TLoginBody) => http.post<TLoginRes, TLoginBody>("/auth/login", body),
  loginServerSide: (body: TLoginBody) =>
    http.post<TLoginRes, TLoginBody>("api/auth/login", body, {
      baseUrl: "",
    }),
};
