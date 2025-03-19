"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authApi } from "src/api-requests/auth.apis";
import GoogleIcon from "src/components/icons/google-icon";
import { MagicCard } from "src/components/magicui/magic-card";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { PATH } from "src/constants/path.constants";
import { handleErrorApi } from "src/lib/utils";
import { loginBodySchema, TLoginBody } from "src/validations/auth.validations";

export default function LoginForm() {
  const { theme } = useTheme();
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
        router.push(PATH.DASHBOARD_MANAGE);
        router.refresh();
      },
      onError(error) {
        handleErrorApi({ error, setError: loginForm.setError });
      },
    });
  });

  return (
    <Card className="mx-auto max-w-sm">
      <MagicCard
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        gradientFrom="#ffffff95"
        gradientTo="#ffffff70"
      >
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>Nhập địa chỉ e-mail và mật khẩu của bạn để đăng nhập vào hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form
              className="w-full max-w-[600px] flex-shrink-0 space-y-2"
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
      </MagicCard>
    </Card>
  );
}
