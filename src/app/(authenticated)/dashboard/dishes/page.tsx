import React from "react";
import DishTable from "src/app/(authenticated)/dashboard/dishes/_components/dish-table";

const DishesPage = () => {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <DishTable />
      </div>
    </main>
  );
};

export default DishesPage;
