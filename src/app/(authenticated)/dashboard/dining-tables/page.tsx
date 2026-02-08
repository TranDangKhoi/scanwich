import { Metadata } from "next";
import DiningTablesTable from "src/app/(authenticated)/dashboard/dining-tables/_components/dining-tables-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";

export const metadata: Metadata = {
  title: "Quản lý bàn ăn",
};

export default function DashboardTablesPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Tài khoản</CardTitle>
            <CardDescription>Quản lý tài khoản nhân viên</CardDescription>
          </CardHeader>
          <CardContent>
            <DiningTablesTable />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
