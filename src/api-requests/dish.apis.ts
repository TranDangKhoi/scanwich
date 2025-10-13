import http from "src/lib/http";
import { TCreateDishBody, TDishListRes, TDishRes } from "src/validations/dish.validations";

export const dishApi = {
  getDishList: () => http.get<TDishListRes>("/dishes"),
  getDishDetail: (dishId: number) => http.get<TDishRes>(`/dishes/${dishId}`),
  addDish: (body: TCreateDishBody) => http.post<TDishRes, TCreateDishBody>("/dishes", body),
  updateDish: (dishId: number, body: TCreateDishBody) =>
    http.put<TDishRes, TCreateDishBody>(`/dishes/${dishId}`, body),
  deleteDish: (dishId: number) => http.delete<TDishRes>(`/dishes/${dishId}`),
}