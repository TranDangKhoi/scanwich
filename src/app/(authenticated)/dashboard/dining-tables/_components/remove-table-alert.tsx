import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { TTable } from "src/validations/table.validations";

export default function RemoveTableAlert({
  tableToBeDeleted,
  setTableToBeDeleted,
}: {
  tableToBeDeleted: TTable | null;
  setTableToBeDeleted: React.Dispatch<React.SetStateAction<TTable | null>>;
}) {
  const queryClient = useQueryClient();

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
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>Bàn</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {}}
            className="bg-destructive text-primary hover:bg-destructive-hover hover:text-primary"
          >
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
