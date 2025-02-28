"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAccessTokenFromLS } from "src/lib/auth";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu",
    public: true,
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    public: true,
  },
  {
    title: "Đăng nhập",
    href: "/login",
    guestOnly: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true, // Khi chưa đăng nhập thì sẽ không hiển thị
  },
];

export default function NavItems({ className }: { className?: string }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    setIsAuthenticated(Boolean(getAccessTokenFromLS()));
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
