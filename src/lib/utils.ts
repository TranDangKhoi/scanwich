import { clsx, type ClassValue } from "clsx";
import { UseFormSetError, UseFormStateProps } from "react-hook-form";
import { toast } from "sonner";
import { UnprocessableEntityError } from "src/lib/http";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateExpiresIn(tokenExpires: number) {
  return new Date(tokenExpires * 1000);
}

export function handleErrorApi({
  error,
  setError,
  defaultMessage = "Đã có lỗi xảy ra, vui lòng thử lại sau",
  toastDuration = 3000,
}: {
  error: unknown;
  setError?: UseFormSetError<any>;
  defaultMessage?: string;
  toastDuration?: number;
}) {
  if (error instanceof UnprocessableEntityError && setError) {
    const errors = error.payload.errors;
    errors.forEach((error) => {
      setError(error.field, {
        type: "server",
        message: error.message,
      });
    });
  } else {
    toast.error(defaultMessage, {
      description: "Nếu lỗi vẫn xảy ra sau một khoảng thời gian dài, xin vui lòng liên hệ với admin",
      duration: toastDuration,
    });
  }
}
