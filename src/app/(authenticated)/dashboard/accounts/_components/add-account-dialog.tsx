"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
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
  DialogTrigger,
} from "src/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { handleErrorApi } from "src/lib/utils";
import { TCreateEmployeeAccountBody, createEmployeeAccountBodySchema } from "src/validations/account.validations";

export default function AddAccountDialog() {
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const addAccountForm = useForm<TCreateEmployeeAccountBody>({
    resolver: zodResolver(createEmployeeAccountBodySchema),
    defaultValues: {
      name: "",
      email: "",
      avatar: null,
      password: "",
      confirmPassword: "",
    },
  });

  const defaultAvatar = addAccountForm.watch("avatar");
  const name = addAccountForm.watch("name");
  const previewAvatar = useMemo(() => {
    if (previewImageFile) {
      return URL.createObjectURL(previewImageFile);
    }
    return defaultAvatar;
  }, [previewImageFile, defaultAvatar]);

  const handleReset = () => {
    addAccountForm.reset({
      avatar: defaultAvatar,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setPreviewImageFile(null);
  };

  const addAccountMutation = useMutation({
    mutationFn: (body: TCreateEmployeeAccountBody) => accountApi.addAccount(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success(
        <p>
          Tài khoản <span className="font-bold">{data.payload.data.name}</span> đã được thêm thành công
        </p>,
      );
      setOpen(false);
      handleReset();
    },
  });

  const uploadImageMutation = useMutation({
    mutationKey: ["upload-image"],
    mutationFn: (body: FormData) => mediaApi.uploadImage(body),
  });

  const handleAddAccount = addAccountForm.handleSubmit(async (data) => {
    let newAvatarUrl = null;
    try {
      if (previewImageFile) {
        const formData = new FormData();
        formData.append("file", previewImageFile);
        const result = await uploadImageMutation.mutateAsync(formData);
        newAvatarUrl = result.payload.data;
      }
      addAccountMutation.mutate({
        ...data,
        avatar: previewImageFile ? newAvatarUrl : defaultAvatar,
      });
    } catch (error) {
      handleErrorApi({
        error,
        defaultMessage: "Có lỗi xảy ra khi thêm tài khoản",
      });
    }
  });

  return (
    <Dialog
      onOpenChange={setOpen}
      open={open}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-7 gap-1"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Tạo tài khoản</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo tài khoản</DialogTitle>
          <DialogDescription>Các trường tên, email, mật khẩu là bắt buộc</DialogDescription>
        </DialogHeader>
        <Form {...addAccountForm}>
          <form
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            onSubmit={handleAddAccount}
            onReset={handleReset}
            id="add-employee-form"
            autoComplete="off"
            noValidate
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={addAccountForm.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start justify-start gap-2">
                      <Avatar className="aspect-square h-[100px] w-[100px] rounded-md object-cover">
                        <AvatarImage src={(previewAvatar as string) ?? undefined} />
                        <AvatarFallback className="rounded-none">{name.slice(0, 2) || "Avatar"}</AvatarFallback>
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
                control={addAccountForm.control}
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
                control={addAccountForm.control}
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
                control={addAccountForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="password"
                          className="w-full"
                          type="password"
                          autoComplete="new-password"
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={addAccountForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
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
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="reset"
            variant="outline"
            form="add-employee-form"
          >
            Nhập lại
          </Button>
          <Button
            type="submit"
            form="add-employee-form"
          >
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
