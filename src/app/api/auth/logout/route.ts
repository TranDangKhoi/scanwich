import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authApi } from "src/api-requests/auth.apis.";
import { TLogoutBody } from "src/validations/auth.validations";

export async function POST(request: Request) {
  const body: TLogoutBody = await request.json();
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Delete cookies either way
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      {
        message: "Tôi cảnh cáo bạn nhé, tôi thấy bạn đang không có token đâu, nhưng tôi vẫn đăng xuất cho bạn đấy",
      },
      {
        status: 200,
      },
    );
  }
  try {
    const { message } = await authApi.logout(body, accessToken);
    return NextResponse.json(
      {
        message,
      },
      {
        status: 200,
      },
    );
  } catch {
    return NextResponse.json(
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
