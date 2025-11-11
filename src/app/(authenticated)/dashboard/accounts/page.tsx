import { Metadata } from "next";
import AccountTable from "src/app/(authenticated)/dashboard/accounts/_components/account-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";

export const metadata: Metadata = {
  title: "Quản lý tài khoản",
  description: "The best dining solution in the world!",
};

export default function Dashboard() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Tài khoản</CardTitle>
            <CardDescription>Quản lý tài khoản nhân viên</CardDescription>
          </CardHeader>
          <CardContent>
            <AccountTable />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
