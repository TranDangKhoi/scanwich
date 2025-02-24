// Chúng ta có thể sử dụng zod để validate các giá trị trong file env
import { envSchema } from "src/validations/env.validations";

const parsedEnvConfig = envSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_COOKIE_MODE: process.env.NEXT_PUBLIC_COOKIE_MODE,
});

if (!parsedEnvConfig.success) {
  console.error(parsedEnvConfig.error.issues);
  throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
}

const parsedEnvData = parsedEnvConfig.data;
export default parsedEnvData;
