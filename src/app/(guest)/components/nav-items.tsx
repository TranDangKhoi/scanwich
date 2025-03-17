import { cookies } from "next/headers";
import Link from "next/link";
import { PATH } from "src/constants/path.constants";

const menuItems = [
  {
    title: "Món ăn",
    href: PATH.MENU,
    authRequired: true, // Khi chưa đăng nhập thì sẽ không hiển thị
  },
  {
    title: "Đơn hàng",
    href: PATH.DASHBOARD_ORDERS,
    authRequired: true, // Khi chưa đăng nhập thì sẽ không hiển thị
  },
  {
    title: "Đăng nhập",
    href: PATH.LOGIN,
    guestOnly: true,
  },
  {
    title: "Quản lý",
    href: PATH.DASHBOARD_MANAGE,
    authRequired: true, // Khi chưa đăng nhập thì sẽ không hiển thị
  },
];

export default function NavItems({ className }: { className?: string }) {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get("accessToken")?.value;
  return menuItems
    .filter((item) => {
      if (item.guestOnly) return !isAuthenticated;
      if (item.authRequired) return isAuthenticated;
      return false;
    })
    .map((item) => (
      <Link
        href={item.href}
        key={item.href}
        className={className}
      >
        {item.title}
      </Link>
    ));
}
