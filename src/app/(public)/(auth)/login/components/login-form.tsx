"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authApi } from "src/api-requests/auth";
import GoogleIcon from "src/components/icons/google-icon";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { handleErrorApi } from "src/lib/utils";
import { loginBodySchema, TLoginBody } from "src/validations/auth.validations";

export default function LoginForm() {
  const router = useRouter();
  const loginForm = useForm<TLoginBody>({
    resolver: zodResolver(loginBodySchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (body: TLoginBody) => authApi.loginServerSide(body),
  });

  const handleLogin = loginForm.handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Đăng nhập thành công");
        router.push("/");
      },
      onError(error) {
        handleErrorApi({ error, setError: loginForm.setError });
      },
    });
  });

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>Nhập địa chỉ e-mail và mật khẩu của bạn để đăng nhập vào hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...loginForm}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            onSubmit={handleLogin}
            noValidate
          >
            <div className="grid gap-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Địa chỉ e-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="johndoe@example.com"
                        required
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
              >
                Đăng nhập
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
              >
                <span>Đăng nhập bằng Google</span>
                <GoogleIcon></GoogleIcon>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
