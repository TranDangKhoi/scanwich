import http from "src/lib/http";
import { TTableListRes } from "src/validations/table.validations";

export const diningTableApi = {
  getAllTables: () => http.get<TTableListRes>("/tables"),
};
