import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { accountApi } from "src/api-requests/account.apis";
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
import { TAccount } from "src/validations/account.validations";

export default function RemoveAccountAlert({
  accountToBeDeleted,
  setAccountToBeDeleted,
}: {
  accountToBeDeleted: TAccount | null;
  setAccountToBeDeleted: React.Dispatch<React.SetStateAction<TAccount | null>>;
}) {
  const queryClient = useQueryClient();
  const accountDeleteMutation = useMutation({
    mutationFn: (id: number) => accountApi.removeAccount(id),
    onSuccess: (data) => {
      setAccountToBeDeleted(null);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success(
        <p>
          Tài khoản <span className="font-bold">{data.payload.data.name}</span> đã được xóa thành công
        </p>,
      );
    },
  });

  const handleDeleteAccount = () => {
    try {
      if (accountToBeDeleted) {
        accountDeleteMutation.mutate(accountToBeDeleted.id);
      }
    } catch (error) {
      handleErrorApi({
        error,
        defaultMessage: "Xóa tài khoản không thành công, vui lòng thử lại sau",
      });
    }
  };

  return (
    <AlertDialog
      open={Boolean(accountToBeDeleted)}
      onOpenChange={(value) => {
        if (!value) {
          setAccountToBeDeleted(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản{" "}
            <span className="rounded-md font-semibold text-primary">
              {accountToBeDeleted?.name || "Unknown account"}
            </span>{" "}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            className="bg-destructive text-primary hover:bg-destructive-hover hover:text-primary"
          >
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
