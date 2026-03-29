"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { diningTableApi } from "src/api-requests/dining-table.apis";
import { Button } from "src/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "src/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Switch } from "src/components/ui/switch";
import { TABLE_STATUS, TABLE_STATUS_VALUES } from "src/constants/types.constants";
import { getTableLink, getVietnameseTableStatus } from "src/lib/dashboard-utils";
import { handleErrorApi, isNumericValue } from "src/lib/utils";
import { TUpdateTableBody, updateTableBodySchema } from "src/validations/table.validations";

export default function EditTable({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const editTableForm = useForm<TUpdateTableBody>({
    resolver: zodResolver(updateTableBodySchema),
    defaultValues: {
      capacity: 2,
      status: TABLE_STATUS.Hidden,
      changeToken: false,
    },
  });

  const { data: tableDetail } = useQuery({
    queryKey: ["table", id],
    queryFn: () => diningTableApi.getTableDetail(id!),
    enabled: Boolean(id),
  });
  const table = tableDetail?.payload.data;

  const updateTableMutation = useMutation({
    mutationFn: (body: TUpdateTableBody) => diningTableApi.updateTable(id!, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
      setId(undefined);
      toast.success(
        <p>
          Bàn số <span className="font-bold">{data.payload.data.number}</span> đã được cập nhật thành công
        </p>,
      );
      onSubmitSuccess?.();
    },
  });

  const handleEditTable = editTableForm.handleSubmit(async (data) => {
    if (updateTableMutation.isPending) return;
    try {
      await updateTableMutation.mutateAsync(data);
    } catch (error) {
      handleErrorApi({
        error,
        setError: editTableForm.setError,
      });
    }
  });

  const handleReset = () => {
    if (table) {
      editTableForm.reset({
        capacity: table.capacity,
        status: table.status,
        changeToken: false,
      });
    }
  };

  useEffect(() => {
    if (table) {
      editTableForm.reset({
        capacity: table.capacity,
        status: table.status,
        changeToken: false,
      });
    }
  }, [table, editTableForm]);

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
        }
      }}
    >
      <DialogContent
        className="max-h-screen overflow-auto sm:max-w-[600px]"
        onCloseAutoFocus={() => {
          handleReset();
          setId(undefined);
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật bàn ăn</DialogTitle>
        </DialogHeader>
        <Form {...editTableForm}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-table-form"
            onSubmit={handleEditTable}
          >
            <div className="grid gap-4 py-4">
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label htmlFor="number">Số hiệu bàn</Label>
                  <div className="col-span-3 w-full space-y-2">
                    <Input
                      id="number"
                      type="number"
                      className="w-full"
                      value={table?.number ?? 0}
                      readOnly
                    />
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
              <FormField
                control={editTableForm.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="capacity">Sức chứa (người)</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="capacity"
                          className="w-full"
                          {...field}
                          type="text"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (isNumericValue(value)) {
                              field.onChange(value);
                            }
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={editTableForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="status">Trạng thái</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TABLE_STATUS_VALUES.map((status) => (
                              <SelectItem
                                key={status}
                                value={status}
                              >
                                {getVietnameseTableStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={editTableForm.control}
                name="changeToken"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="changeToken">Đổi QR Code</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="changeToken"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label>QR Code</Label>
                  <div className="col-span-3 w-full space-y-2"></div>
                </div>
              </FormItem>
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label>URL gọi món</Label>
                  <div className="col-span-3 w-full space-y-2">
                    {table && (
                      <Link
                        href={getTableLink({
                          token: table.token,
                          tableNumber: table.number,
                        })}
                        target="_blank"
                        className="break-all"
                      >
                        {getTableLink({
                          token: table.token,
                          tableNumber: table.number,
                        })}
                      </Link>
                    )}
                  </div>
                </div>
              </FormItem>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="edit-table-form"
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
