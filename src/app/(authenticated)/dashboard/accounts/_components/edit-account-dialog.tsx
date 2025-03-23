"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
import { TUpdateEmployeeAccountBody, updateEmployeeAccountBodySchema } from "src/validations/account.validations";

export default function EditAccountDialog({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
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
  const defaultAvatarValues = editAccountForm.watch("avatar");
  const name = editAccountForm.watch("name");
  const changePassword = editAccountForm.watch("changePassword");
  const previewAvatarFromFile = useMemo(() => {
    if (previewImageFile) {
      return URL.createObjectURL(previewImageFile);
    }
    return defaultAvatarValues;
  }, [previewImageFile, defaultAvatarValues]);

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
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
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-employee-form"
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={editAccountForm.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-start justify-start gap-2">
                      <Avatar className="aspect-square h-[100px] w-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatarFromFile} />
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
