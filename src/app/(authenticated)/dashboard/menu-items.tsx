import { Home, LineChart, Salad, ShoppingCart, Table, Users2 } from "lucide-react";
import { PATH } from "src/constants/path.constants";

const menuItems = [
  {
    title: "Dashboard",
    Icon: Home,
    href: PATH.DASHBOARD_MANAGE,
  },
  {
    title: "Đơn hàng",
    Icon: ShoppingCart,
    href: "/manage/orders",
  },
  {
    title: "Bàn ăn",
    Icon: Table,
    href: "/manage/tables",
  },
  {
    title: "Món ăn",
    Icon: Salad,
    href: "/manage/dishes",
  },

  {
    title: "Phân tích",
    Icon: LineChart,
    href: "/manage/analytics",
  },
  {
    title: "Nhân viên",
    Icon: Users2,
    href: "/manage/accounts",
  },
];

export default menuItems;
