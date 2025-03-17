import parsedEnvData from "src/config";
import { EVENTS } from "src/constants/events.constants";
import { HTTP_STATUS_CODE } from "src/constants/httpStatusCode.constants";
import { eventEmitter } from "src/lib/event-emitter";
import { TLoginRes } from "src/validations/auth.validations";

const isClient = typeof window !== "undefined";

function isAuthResponse(payload: unknown): payload is TLoginRes {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as any).data === "object" &&
    "accessToken" in (payload as any).data &&
    "refreshToken" in (payload as any).data
  );
}

// Vì chúng ta cần gọi API từ cả phía Next.js Server và một Server khác,
// nên chúng ta cần sử dụng `RequestInit` kèm thêm `baseUrl`.
// Nếu `baseUrl` là "" thì sử dụng baseUrl của client (localhost:3002),
// ngược lại thì sử dụng baseUrl của server (ví dụ: localhost:4000).
type CustomOptions<TBody = unknown> = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
  body?: TBody;
};

// Lớp `HttpError` kế thừa từ `Error` để tạo ra các lỗi HTTP tùy chỉnh.
// Lớp này bao gồm mã trạng thái HTTP (`status`) và dữ liệu bổ sung (`payload`).
export class HttpError extends Error {
  status: number;
  payload: any;
  message: string;
  constructor({ status, payload, message }: { status: number; payload: any; message: string }) {
    super("HttpError");
    this.status = status;
    this.payload = payload;
    this.message = message;
  }
}

// Định nghĩa kiểu dữ liệu cho payload của lỗi 422 (Unprocessable Entity).
type UnprocessableEntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

// Lớp `UnprocessableEntityError` kế thừa từ `HttpError` để đại diện cho lỗi 422 (Unprocessable Entity).
// Lỗi này thường liên quan tới forms và xảy ra khi dữ liệu gửi lên server không hợp lệ.
export class UnprocessableEntityError extends HttpError {
  status: typeof HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY;
  payload: UnprocessableEntityErrorPayload;
  constructor({ status, payload }: { status: 422; payload: UnprocessableEntityErrorPayload }) {
    super({ status, payload, message: payload.message || "Lỗi UnprocessableEntityError" });
    this.status = status;
    this.payload = payload;
  }
}

export type UnauthorizedErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class UnauthorizedError extends HttpError {
  status: 401;
  payload: UnauthorizedErrorPayload;
  constructor({ status, payload }: { status: 401; payload: UnauthorizedErrorPayload }) {
    super({ status, payload, message: payload.message || "Lỗi UnauthorizedError" });
    this.status = status;
    this.payload = payload;
  }
}

export class InternalServerError extends HttpError {
  status: 500;
  payload: any;
  constructor({ status, payload }: { status: 500; payload: any }) {
    super({ status, payload, message: payload.message || "Lỗi InternalServerError" });
    this.status = status;
    this.payload = payload;
  }
}

class AccessToken {
  private accessToken = "";
  get value() {
    return this.accessToken;
  }
  set value(accessToken: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === "undefined") {
      throw new Error("Cannot set accessToken on server side");
    }
    this.accessToken = accessToken;
  }
}

export const clientAccessToken = new AccessToken();

// Hàm `request` là hàm chính để thực hiện các yêu cầu HTTP.
// Nó hỗ trợ các phương thức GET, POST, PUT, DELETE và xử lý các lỗi HTTP.
const request = async <TResponse, TBody = unknown>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  options?: CustomOptions<TBody>,
) => {
  // Chuyển đổi body thành chuỗi JSON nếu có.
  const body = options?.body instanceof FormData ? options?.body : JSON.stringify(options?.body);

  // Các header mặc định cho mọi yêu cầu.
  let baseHeaders = {
    ...(!(options?.body instanceof FormData) && { "Content-Type": "application/json" }),
  };

  // Nếu có token trong localStorage, thêm vào header Authorization.
  if (isClient) {
    // const accessToken = localStorage.getItem("accessToken");
    const accessToken = clientAccessToken.value;
    baseHeaders = {
      ...baseHeaders,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };
  }

  // Xác định baseUrl dựa trên giá trị truyền vào hoặc lấy từ cấu hình môi trường.
  // Nếu `baseUrl` là "" thì sử dụng baseUrl của client (như hiện tại thì đang là localhost:3002),
  // ngược lại thì sử dụng baseUrl của server (ví dụ: localhost:4000).
  const baseUrl = options?.baseUrl ?? parsedEnvData.NEXT_PUBLIC_API_URL;

  // Tạo URL đầy đủ bằng cách kết hợp baseUrl và đường dẫn tương đối.
  const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

  // Thực hiện yêu cầu HTTP bằng `fetch`.
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });

  // Phân tích phản hồi JSON từ server.
  const payload: TResponse = await res.json();
  const data = {
    status: res.status,
    payload,
    message: (payload as any).message || "",
  };

  let stillHavingToken = false;
  if (isClient) {
    // stillHavingToken = !!localStorage.getItem("accessToken");
    stillHavingToken = !!clientAccessToken.value;
  }

  // Xử lý lỗi nếu yêu cầu không thành công.
  if (!res.ok) {
    if (res.status === HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY) {
      // Nếu lỗi là 422 (Unprocessable Entity), ném ra `EntityError`.
      throw new UnprocessableEntityError(
        data as {
          status: 422;
          payload: UnprocessableEntityErrorPayload;
        },
      );
    } else if (res.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
      if (isClient && stillHavingToken) {
        await fetch("/api/auth/logout", {
          method: "POST",
          body: JSON.stringify({}), // Logout sẽ luôn luôn thành công cả kể accessToken có hết hạn đi chăng nữa
          headers: {
            ...baseHeaders,
          },
        }).finally(() => {
          // Đăng xuất thành công thì xóa token trong localStorage và chuyển hướng người dùng đến trang đăng nhập.
          // localStorage.removeItem("accessToken");
          // localStorage.removeItem("refreshToken");
          clientAccessToken.value = "";
          eventEmitter.emit(EVENTS.UNAUTHORIZED_EVENT);
        });
        throw new UnauthorizedError(data as { status: 401; payload: UnauthorizedErrorPayload });
      } else {
        throw new UnauthorizedError(data as { status: 401; payload: UnauthorizedErrorPayload });
      }
    } else if (res.url.includes("/api/auth/refresh-token") && res.status === HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR) {
      await fetch("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({}), // Logout sẽ luôn luôn thành công cả kể accessToken có hết hạn đi chăng nữa
        headers: {
          ...baseHeaders,
        },
      }).finally(() => {
        // Đăng xuất thành công thì xóa token trong localStorage và chuyển hướng người dùng đến trang đăng nhập.
        // localStorage.removeItem("accessToken");
        // localStorage.removeItem("refreshToken");
        clientAccessToken.value = "";
        eventEmitter.emit(EVENTS.UNAUTHORIZED_EVENT);
      });
      throw new InternalServerError(data as { status: 500; payload: any });
    } else {
      // Nếu là lỗi khác, ném ra `HttpError`.
      throw new HttpError(data);
    }
  }

  // Cập nhật token phiên đăng nhập nếu yêu cầu liên quan đến đăng nhập/đăng ký.
  // Đảm bảo logic ở trong `if` chỉ chạy ở phía browser (client)
  if (isClient) {
    if (["/api/auth/login", "/api/auth/register"].some((path) => path === url) && isAuthResponse(payload)) {
      const { accessToken } = payload.data;
      // localStorage.setItem("accessToken", accessToken);
      // localStorage.setItem("refreshToken", refreshToken);
      clientAccessToken.value = accessToken;
    } else if ("/auth/logout".includes(url)) {
      // Xóa token nếu yêu cầu là đăng xuất.
      // localStorage.removeItem("accessToken");
      // localStorage.removeItem("refreshToken");
      clientAccessToken.value = "";
    }
  }

  // Trả về dữ liệu phản hồi.
  return data;
};

// Đối tượng `http` cung cấp các phương thức tiện ích để thực hiện yêu cầu HTTP.
const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<Response>("GET", url, options);
  },
  post<Response, TBody>(url: string, body: any, options?: Omit<CustomOptions<TBody>, "body"> | undefined) {
    return request<Response, TBody>("POST", url, { ...options, body });
  },
  patch<Response, TBody>(url: string, body: any, options?: Omit<CustomOptions<TBody>, "body"> | undefined) {
    return request<Response, TBody>("PATCH", url, { ...options, body });
  },
  put<Response, TBody>(url: string, body: any, options?: Omit<CustomOptions<TBody>, "body"> | undefined) {
    return request<Response, TBody>("PUT", url, { ...options, body });
  },
  delete<Response>(url: string, body: any, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
