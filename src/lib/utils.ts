import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { UnauthorizedError, UnprocessableEntityError } from "src/lib/http";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateCookieExpires(cookieExpireTimestamp: number) {
  return new Date(cookieExpireTimestamp * 1000);
}

export function handleErrorApi({
  error,
  setError,
  defaultMessage = "Đã có lỗi xảy ra, vui lòng thử lại sau",
  toastDuration = 3000,
  forcedToLogout = false,
}: {
  error: unknown;
  setError?: UseFormSetError<any>;
  defaultMessage?: string;
  toastDuration?: number;
  forcedToLogout?: boolean;
}) {
  if (error instanceof UnprocessableEntityError && setError) {
    const errors = error.payload.errors;
    errors.forEach((error) => {
      setError(error.field, {
        type: "server",
        message: error.message,
      });
    });
  } else if (error instanceof UnauthorizedError && forcedToLogout) {
    toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại", {
      duration: toastDuration,
    });
  } else {
    toast.error(defaultMessage, {
      description: "Nếu lỗi vẫn xảy ra sau một khoảng thời gian dài, xin vui lòng liên hệ với admin",
      duration: toastDuration,
    });
  }
}
