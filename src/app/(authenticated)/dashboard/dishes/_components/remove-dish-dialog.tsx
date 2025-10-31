import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { dishApi } from "src/api-requests/dish.apis";
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
import { TDish } from "src/validations/dish.validations";

export default function RemoveDishDialog({
  dishDelete,
  setDishDelete,
}: {
  dishDelete: TDish | null;
  setDishDelete: React.Dispatch<React.SetStateAction<TDish | null>>;
}) {
  const queryClient = useQueryClient();
  const deleteDishMutation = useMutation({
    mutationFn: (id: number) => dishApi.deleteDish(id),
    onSuccess: () => {
      setDishDelete(null);
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      toast.success(
        <p>
          Món ăn <span className="font-bold">{dishDelete?.name}</span> đã được xóa thành công
        </p>,
      );
    },
  });

  const handleDeleteDish = () => {
    try {
      if (dishDelete) {
        deleteDishMutation.mutate(dishDelete.id);
      }
    } catch (error) {
      handleErrorApi({
        error,
        defaultMessage: "Xóa món ăn không thành công, vui lòng thử lại sau",
      });
    }
  };
  return (
    <AlertDialog
      open={Boolean(dishDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setDishDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa món ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Món <span className="rounded bg-foreground px-1 text-primary-foreground">{dishDelete?.name}</span> sẽ bị xóa
            vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteDish}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
