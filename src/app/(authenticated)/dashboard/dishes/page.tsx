import { Metadata } from "next";
import React from "react";
import DishTable from "src/app/(authenticated)/dashboard/dishes/_components/dish-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";

export const metadata: Metadata = {
  title: "Quản lý món ăn",
};

const DishesPage = () => {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Món ăn</CardTitle>
            <CardDescription>Quản lý món ăn</CardDescription>
          </CardHeader>
          <CardContent>
            <DishTable />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default DishesPage;
