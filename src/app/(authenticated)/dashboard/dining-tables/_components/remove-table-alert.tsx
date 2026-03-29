import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { diningTableApi } from "src/api-requests/dining-table.apis";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "src/components/ui/alert-dialog";
import { handleErrorApi } from "src/lib/utils";
import { TTable } from "src/validations/table.validations";

export default function RemoveTableAlert({
  tableToBeDeleted,
  setTableToBeDeleted,
}: {
  tableToBeDeleted: TTable | null;
  setTableToBeDeleted: React.Dispatch<React.SetStateAction<TTable | null>>;
}) {
  const queryClient = useQueryClient();

  const deleteTableMutation = useMutation({
    mutationFn: (number: number) => diningTableApi.deleteTable(number),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast.success(
        <p>
          Bàn số <span className="font-bold">{tableToBeDeleted?.number}</span> đã được xóa thành công
        </p>,
      );
      setTableToBeDeleted(null);
    },
    onError: (error) => {
      handleErrorApi({
        error,
      });
    },
  });

  return (
    <AlertDialog
      open={Boolean(tableToBeDeleted)}
      onOpenChange={(value) => {
        if (!value) {
          setTableToBeDeleted(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bàn?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa bàn số <span className="font-bold">{tableToBeDeleted?.number}</span> không? Hành
            động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (tableToBeDeleted) {
                deleteTableMutation.mutate(tableToBeDeleted.number);
              }
            }}
            className="bg-destructive text-primary hover:bg-destructive-hover hover:text-primary"
          >
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
