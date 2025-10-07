"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { accountApi } from "src/api-requests/accounts.apis";
import { mediaApi } from "src/api-requests/media.apis";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Button } from "src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Switch } from "src/components/ui/switch";
import { handleErrorApi } from "src/lib/utils";
import { TUpdateEmployeeAccountBody, updateEmployeeAccountBodySchema } from "src/validations/account.validations";

// TO DO: Investigate why the role is updated to EMPLOYEE after editting accounts

export default function EditAccountDialog({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: React.Dispatch<React.SetStateAction<number | undefined>>;
  onSubmitSuccess?: () => void;
}) {
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const editAccountForm = useForm<TUpdateEmployeeAccountBody>({
    resolver: zodResolver(updateEmployeeAccountBodySchema),
    defaultValues: {
      name: "",
      email: "",
      avatar: undefined,
      password: undefined,
      confirmPassword: undefined,
      changePassword: false,
    },
  });

  const defaultAvatar = editAccountForm.watch("avatar");
  const name = editAccountForm.watch("name");
  const changePassword = editAccountForm.watch("changePassword");
  const previewAvatarFromFile = useMemo(() => {
    if (previewImageFile) {
      return URL.createObjectURL(previewImageFile);
    }
    return defaultAvatar;
  }, [previewImageFile, defaultAvatar]);

  const { data: accountDetail } = useQuery({
    queryKey: ["account", id],
    queryFn: () => accountApi.getAccountDetail(id!),
    enabled: Boolean(id),
  });
  const account = accountDetail?.payload.data;

  const uploadImageMutation = useMutation({
    mutationKey: ["upload-image"],
    mutationFn: (body: FormData) => mediaApi.uploadImage(body),
  });

  const editAccountMutation = useMutation({
    mutationFn: (body: TUpdateEmployeeAccountBody) => accountApi.editAccount(id!, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
      setId(undefined);
      toast.success(
        <p>
          Tài khoản <span className="font-bold">{data.payload.data.name}</span> đã được cập nhật thành công
        </p>,
      );
      onSubmitSuccess?.();
    },
  });

  const handleEditAccount = editAccountForm.handleSubmit(async (data) => {
    let newAvatarUrl = null;
    try {
      if (previewImageFile) {
        const formData = new FormData();
        formData.append("file", previewImageFile);
        const result = await uploadImageMutation.mutateAsync(formData);
        newAvatarUrl = result.payload.data;
      }
      editAccountMutation.mutate({
        ...data,
        avatar: previewImageFile ? newAvatarUrl : defaultAvatar,
      });
    } catch (error) {
      console.log(error);
      handleErrorApi({
        error,
        setError: editAccountForm.setError,
        defaultMessage: "Đã có lỗi xảy ra khi cập nhật thông tin người dùng",
      });
    }
  });

  const handleReset = () => {
    editAccountForm.reset({
      avatar: account?.avatar as string,
      name: account?.name,
      email: account?.email,
      changePassword: false,
    });
    // Clear preview image
    setPreviewImageFile(null);
  };

  useEffect(() => {
    if (account) {
      editAccountForm.reset({
        avatar: account.avatar as string,
        name: account.name,
        email: account.email,
        changePassword: false,
        password: undefined,
        confirmPassword: undefined,
      });

      // Clear preview image
      setPreviewImageFile(null);
    }
  }, [account, editAccountForm]);

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
          handleReset();
        }
      }}
    >
      <DialogContent className="max-h-screen overflow-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cập nhật tài khoản</DialogTitle>
          <DialogDescription>Các trường tên, email, mật khẩu là bắt buộc</DialogDescription>
        </DialogHeader>
        <Form {...editAccountForm}>
          <form
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-employee-form"
            onSubmit={handleEditAccount}
            onReset={handleReset}
            noValidate
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={editAccountForm.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start justify-start gap-2">
                      <Avatar className="aspect-square h-[100px] w-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatarFromFile as string} />
                        <AvatarFallback className="rounded-none">{name || "Avatar"}</AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPreviewImageFile(file);
                            field.onChange("http://localhost:3000/" + file.name);
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={editAccountForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Tên</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="name"
                          className="w-full"
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={editAccountForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="email">Email</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="email"
                          className="w-full"
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={editAccountForm.control}
                name="changePassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="email">Đổi mật khẩu</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              {changePassword && (
                <FormField
                  control={editAccountForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="password">Mật khẩu mới</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input
                            id="password"
                            className="w-full"
                            type="password"
                            {...field}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}
              {changePassword && (
                <FormField
                  control={editAccountForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input
                            id="confirmPassword"
                            className="w-full"
                            type="password"
                            {...field}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="reset"
            variant="outline"
            form="edit-employee-form"
          >
            Đặt lại
          </Button>
          <Button
            type="submit"
            form="edit-employee-form"
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
