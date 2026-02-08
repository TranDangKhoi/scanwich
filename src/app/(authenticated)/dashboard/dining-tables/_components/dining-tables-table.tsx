"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Button } from "src/components/ui/button";
// import EditEmployee from "src/app/manage/tables/edit-employee";
import { useQuery } from "@tanstack/react-query";
import { diningTableApi } from "src/api-requests/dining-table.apis";
import AddTableDialog from "src/app/(authenticated)/dashboard/dining-tables/_components/add-table-dialog";
import EditTableDialog from "src/app/(authenticated)/dashboard/dining-tables/_components/edit-table-dialog";
import RemoveTableAlert from "src/app/(authenticated)/dashboard/dining-tables/_components/remove-table-alert";
import AutoPagination from "src/components/manual/auto-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { Input } from "src/components/ui/input";
import { Table, TableHead, TableHeader, TableRow } from "src/components/ui/table";
import { getVietnameseTableStatus } from "src/lib/dashboard-utils";
import { TTable } from "src/validations/table.validations";

const DiningTableContext = createContext<{
  setTableIdEdit: React.Dispatch<React.SetStateAction<number | undefined>>;
  tableIdEdit: number | undefined;
  tableToBeDeleted: TTable | null;
  setTableToBeDeleted: React.Dispatch<React.SetStateAction<TTable | null>>;
}>({
  setTableIdEdit: (value: React.SetStateAction<number | undefined>) => {},
  tableIdEdit: undefined,
  tableToBeDeleted: null,
  setTableToBeDeleted: (value: React.SetStateAction<TTable | null>) => {},
});

export const columns: ColumnDef<TTable>[] = [
  {
    accessorKey: "number",
    header: "Số bàn",
    cell: ({ row }) => <div className="capitalize">{row.getValue("number")}</div>,
  },
  {
    accessorKey: "capacity",
    header: "Sức chứa",
    cell: ({ row }) => <div className="capitalize">{row.getValue("capacity")}</div>,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <div>{getVietnameseTableStatus(row.getValue("status"))}</div>,
  },
  {
    accessorKey: "token",
    header: "QR Code",
    cell: ({ row }) => <div>{row.getValue("number")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setTableIdEdit, setTableToBeDeleted } = useContext(DiningTableContext);
      const openEditTable = () => {
        setTableIdEdit(row.original.number);
      };

      const openDeleteTable = () => {
        setTableToBeDeleted(row.original);
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditTable}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteTable}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const PAGE_SIZE = 10;
export default function DiningTablesTable() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageIndex = page - 1;
  // const params = Object.fromEntries(searchParam.entries())
  const [tableIdEdit, setTableIdEdit] = useState<number | undefined>();
  const [tableToBeDeleted, setTableToBeDeleted] = useState<TTable | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE, //default page size
  });

  const { data: tableListData } = useQuery({
    queryKey: ["tables"],
    queryFn: () => diningTableApi.getAllTables(),
  });
  const tableList = tableListData?.payload.data ?? [];

  const table = useReactTable({
    data: tableList,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [table, pageIndex]);

  return (
    <DiningTableContext.Provider value={{ tableIdEdit, setTableIdEdit, tableToBeDeleted, setTableToBeDeleted }}>
      <div className="w-full">
        <EditTableDialog
          id={tableIdEdit}
          setId={setTableIdEdit}
          onSubmitSuccess={() => {}}
        />
        <RemoveTableAlert
          tableToBeDeleted={tableToBeDeleted}
          setTableToBeDeleted={setTableToBeDeleted}
        />
        <div className="flex items-center py-4">
          <Input
            placeholder="Tìm kiếm theo e-mail"
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddTableDialog />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 py-4 text-xs text-muted-foreground">
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{" "}
            <strong>{tableList?.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              currentPage={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname="/manage/tables"
            />
          </div>
        </div>
      </div>
    </DiningTableContext.Provider>
  );
}
