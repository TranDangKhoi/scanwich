import DOMPurify from "dompurify";
import parsedEnvData from "src/config";
import { DISH_STATUS, TABLE_STATUS } from "src/constants/types.constants";
export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export const getVietnameseDishStatus = (status?: (typeof DISH_STATUS)[keyof typeof DISH_STATUS]) => {
  switch (status) {
    case DISH_STATUS.Available:
      return "Có sẵn";
    case DISH_STATUS.Unavailable:
      return "Không có sẵn";
    default:
      return "Ẩn";
  }
};

export const getVietnameseTableStatus = (status: (typeof TABLE_STATUS)[keyof typeof TABLE_STATUS]) => {
  switch (status) {
    case TABLE_STATUS.Available:
      return "Có sẵn";
    case TABLE_STATUS.Reserved:
      return "Đã đặt";
    default:
      return "Ẩn";
  }
};

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return parsedEnvData.NEXT_PUBLIC_URL + "/tables/" + tableNumber + "?token=" + token;
};

export const sanitizeText = (text: string) => {
  if (!text) return "";

  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};
