"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { accountApi } from "src/api-requests/accounts.apis";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { changePasswordBodySchema, TChangePasswordBody } from "src/validations/account.validations";

export default function ChangePasswordForm() {
  const changePasswordForm = useForm<TChangePasswordBody>({
    resolver: zodResolver(changePasswordBodySchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationKey: ["change-password"],
    mutationFn: (body: TChangePasswordBody) => accountApi.changeMyPassword(body),
  });

  const handleChangePassword = changePasswordForm.handleSubmit((data) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Đổi mật khẩu thành công!");
      },
      onError: (err) => {
        toast.error(err.message ?? "Đổi mật khẩu không thành công!");
      },
    });
  });

  return (
    <Form {...changePasswordForm}>
      <form
        onSubmit={handleChangePassword}
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        noValidate
      >
        <Card
          className="overflow-hidden"
          x-chunk="dashboard-07-chunk-4"
        >
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
            <CardDescription>
              Đổi mật khẩu để an toàn hơn nè! (＾▽＾)／, nhưng hãy cẩn thận bị nhìn lén (•﹏•;)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={changePasswordForm.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                      <Input
                        id="oldPassword"
                        type="password"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={changePasswordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="password">Mật khẩu mới</Label>
                      <Input
                        id="password"
                        type="password"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={changePasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="confirmPassword">Nhập lại mật khẩu mới</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className=" items-center gap-2 md:ml-auto flex">
                <Button
                  variant="outline"
                  size="sm"
                >
                  Hủy
                </Button>
                <Button size="sm">Lưu thông tin</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
