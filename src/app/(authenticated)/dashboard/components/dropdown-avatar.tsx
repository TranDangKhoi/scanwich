"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { accountApi } from "src/api-requests/accounts.apis";
import { authApi } from "src/api-requests/auth.apis.";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { PATH } from "src/constants/path.constants";
import { clientRefreshToken } from "src/lib/http";
import { handleErrorApi } from "src/lib/utils";
import { TLogoutBody } from "src/validations/auth.validations";

export default function DropdownAvatar() {
  const router = useRouter();
  const { data: myProfileData } = useQuery({
    queryKey: ["get-profile"],
    queryFn: accountApi.getMyProfile,
    refetchOnMount: true,
  });

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: (body: TLogoutBody) => authApi.logoutServerSide(body),
  });

  const handleLogout = () => {
    try {
      logoutMutation.mutate(
        {
          refreshToken: clientRefreshToken.value,
        },
        {
          onSuccess: () => {
            toast.success("Đăng xuất thành công");
            router.push(PATH.LOGIN);
          },
        },
      );
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage
              src={myProfileData?.payload.data.avatar ?? undefined}
              alt={myProfileData?.payload.data.name}
            />
            <AvatarFallback>{myProfileData?.payload.data.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex items-center gap-2">
          <span>{myProfileData?.payload.data.name}</span>
          <Badge className="rounded-full">{myProfileData?.payload.data.role}</Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={PATH.DASHBOARD_SETTINGS}
            className="cursor-pointer"
          >
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
