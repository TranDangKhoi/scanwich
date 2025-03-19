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
import { handleErrorApi } from "src/lib/utils";
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

  const handleChangePassword = changePasswordForm.handleSubmit(async (data) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      toast.success("Đổi mật khẩu thành công!");
    } catch (error) {
      handleErrorApi({
        error,
        setError: changePasswordForm.setError,
        defaultMessage: "Đổi mật khẩu thất bại thảm hại!",
      });
    }
  });

  const handleReset = () => {
    changePasswordForm.reset();
  };

  return (
    <Form {...changePasswordForm}>
      <form
        onSubmit={handleChangePassword}
        onReset={handleReset}
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        noValidate
      >
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
            <CardDescription>
              Đổi mật khẩu để an toàn hơn nè! (＾▽＾)／, nhưng hãy cẩn thận bị nhìn lén (•﹏•;)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Don't know why but this input is to remove Chrome's warning message */}
            {/* https://stackoverflow.com/questions/48525114/chrome-warning-dom-password-forms-should-have-optionally-hidden-username-fi */}
            <Input
              id="username"
              name="username"
              autoComplete="username"
              value=""
              className="hidden"
              readOnly
              hidden
            />
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
                        autoComplete="current-password"
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
                        autoComplete="new-password"
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
                        autoComplete="confirm-new-password"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2 md:ml-auto">
                <Button
                  variant="outline"
                  type="reset"
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
