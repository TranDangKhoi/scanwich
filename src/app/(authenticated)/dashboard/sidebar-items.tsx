import { Home, LineChart, Salad, ShoppingCart, Table, Users2 } from "lucide-react";
import { PATH } from "src/constants/path.constants";

const sidebarItems = [
  {
    title: "Dashboard",
    Icon: Home,
    href: PATH.DASHBOARD_MANAGE,
  },
  {
    title: "Đơn hàng",
    Icon: ShoppingCart,
    href: PATH.DASHBOARD_ORDERS,
  },
  {
    title: "Bàn ăn",
    Icon: Table,
    href: PATH.DASHBOARD_TABLES,
  },
  {
    title: "Món ăn",
    Icon: Salad,
    href: PATH.DASHBOARD_DISHES,
  },

  {
    title: "Phân tích",
    Icon: LineChart,
    href: PATH.DASHBOARD_ANALYTICS,
  },
  {
    title: "Nhân viên",
    Icon: Users2,
    href: PATH.DASHBOARD_ACCOUNTS,
  },
];

export default sidebarItems;
