import { cookies } from "next/headers";
import { authApi } from "src/api-requests/auth.apis";

export async function POST() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  // Delete cookies either way
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: "Tôi cảnh cáo bạn nhé, tôi thấy bạn đang không có token đâu, nhưng tôi vẫn đăng xuất cho bạn đấy",
      },
      {
        status: 200,
      },
    );
  }
  try {
    const { message } = await authApi.logout({ refreshToken }, accessToken);
    return Response.json(
      {
        message,
      },
      {
        status: 200,
      },
    );
  } catch {
    // Remove both access token and refresh token from cookies
    return Response.json(
      {
        message: "Đăng xuất xảy ra với cảnh báo",
        description: "Nếu bạn còn gặp lại cảnh báo này một lần nữa, xin vui lòng liên hệ với admin",
      },
      {
        status: 200,
      },
    );
  }
}
