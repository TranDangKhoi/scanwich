import { redirect } from "next/navigation";
import parsedEnvData from "src/config";
import { HTTP_STATUS_CODE } from "src/constants/httpStatusCode.constants";

// Vì chúng ta cần gọi API từ cả phía Next.js Server và một Server khác,
// nên chúng ta cần sử dụng `RequestInit` kèm thêm `baseUrl`.
// Nếu `baseUrl` là "" thì sử dụng baseUrl của client (localhost:3000),
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
  constructor({ status, payload }: { status: number; payload: any }) {
    super("HttpError");
    this.status = status;
    this.payload = payload;
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
  status: 422;
  payload: UnprocessableEntityErrorPayload;
  constructor({ status, payload }: { status: 422; payload: UnprocessableEntityErrorPayload }) {
    super({ status, payload });
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
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

// Lớp `SessionToken` quản lý token phiên đăng nhập của người dùng.
// Token này được lưu trữ trong một biến private và có thể truy cập thông qua getter/setter.
class SessionToken {
  private token = "";
  get value() {
    return this.token;
  }
  set value(token: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this.token = token;
  }
}

// Tạo một instance của `SessionToken` để sử dụng trong ứng dụng.
export const clientSessionToken = new SessionToken();

// Hàm `request` là hàm chính để thực hiện các yêu cầu HTTP.
// Nó hỗ trợ các phương thức GET, POST, PUT, DELETE và xử lý các lỗi HTTP.
const request = async <TResponse, TBody = unknown>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions<TBody>,
) => {
  // Chuyển đổi body thành chuỗi JSON nếu có.
  const body = options?.body instanceof FormData ? options?.body : JSON.stringify(options?.body);

  // Các header mặc định cho mọi yêu cầu.
  const baseHeaders = {
    ...(!(options?.body instanceof FormData) && { "Content-Type": "application/json" }),
    Authorization: clientSessionToken.value ? `Bearer ${clientSessionToken.value}` : "",
  };

  // Xác định baseUrl dựa trên giá trị truyền vào hoặc lấy từ cấu hình môi trường.
  // Nếu `baseUrl` là "" thì sử dụng baseUrl của client (như hiện tại thì đang là localhost:3000),
  // ngược lại thì sử dụng baseUrl của server (ví dụ: localhost:4000).
  const baseUrl = options?.baseUrl ?? parsedEnvData.NEXT_PUBLIC_API_ENDPOINT;
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
  };

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
      if (typeof window !== "undefined") {
        await fetch("/api/auth/logout", {
          method: "POST",
          body: JSON.stringify({ forcedToLogout: true }),
          headers: {
            ...baseHeaders,
          },
        }).then((res) => {
          if (res.ok) {
            clientSessionToken.value = "";
            window.location.href = "/login";
          }
        });
      } else {
        const sessionToken = (options?.headers as any).Authorization.split(" ")[1];
        redirect(`/logout?sessionToken=${sessionToken}`);
      }
    } else {
      // Nếu là lỗi khác, ném ra `HttpError`.
      throw new HttpError(data);
    }
  }

  // Cập nhật token phiên đăng nhập nếu yêu cầu liên quan đến đăng nhập/đăng ký.
  // Đảm bảo logic ở trong `if` chỉ chạy ở phía browser (client)
  if (typeof window !== "undefined") {
    if (["/auth/login", "/auth/register"].some((path) => path === url)) {
      // TODO: Update from any to types
      clientSessionToken.value = (payload as any).data.token;
    } else if ("/auth/logout".includes(url)) {
      // Xóa token nếu yêu cầu là đăng xuất.
      clientSessionToken.value = "";
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
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response, TBody>(url: string, body: any, options?: Omit<CustomOptions<TBody>, "body"> | undefined) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(url: string, body: any, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
