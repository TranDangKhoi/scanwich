import http from "src/lib/http";
import { TCreateTableBody, TTableListRes, TTableRes, TUpdateTableBody } from "src/validations/table.validations";

export const diningTableApi = {
  getAllTables: () => http.get<TTableListRes>("/tables"),
  getTableDetail: (tableNumber: number) => http.get<TTableRes>(`/tables/${tableNumber}`),
  addTable: (body: TCreateTableBody) => http.post<TTableRes, TCreateTableBody>("/tables", body),
  updateTable: (tableNumber: number, body: TUpdateTableBody) =>
    http.put<TTableRes, TUpdateTableBody>(`/tables/${tableNumber}`, body),
  deleteTable: (tableNumber: number) => http.delete<TTableRes>(`/tables/${tableNumber}`),
};
