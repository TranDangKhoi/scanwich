import http from "src/lib/http";
import { TUploadImageRes } from "src/validations/media.validations";

export const mediaApi = {
  uploadImage: (body: FormData) => http.post<TUploadImageRes, FormData>("/media/upload", body),
};
