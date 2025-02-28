"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PATH } from "src/constants/path.constants";
import { clientAccessToken } from "src/lib/http";

const menuItems = [
  {
    title: "Món ăn",
    href: PATH.MENU,
    public: true,
  },
  {
    title: "Đơn hàng",
    href: PATH.ORDERS,
    public: true,
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = clientAccessToken.value;
    setIsAuthenticated(!!accessToken);
  }, []);

  return menuItems
    .filter((item) => {
      if (item.public) return true;
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
