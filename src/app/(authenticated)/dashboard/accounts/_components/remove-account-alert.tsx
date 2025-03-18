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
import { TAccount } from "src/validations/account.validations";

export default function RemoveAccountAlert({
  employeeDelete,
  setEmployeeDelete,
}: {
  employeeDelete: TAccount | null;
  setEmployeeDelete: (value: TAccount | null) => void;
}) {
  return (
    <AlertDialog
      open={Boolean(employeeDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setEmployeeDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản{" "}
            <span className="font-semibold text-primary rounded-md">{employeeDelete?.name || "Unknown account"}</span>{" "}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Không xóa nữa</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-primary hover:bg-destructive-hover hover:text-primary">
            Xóa vĩnh viễn
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
