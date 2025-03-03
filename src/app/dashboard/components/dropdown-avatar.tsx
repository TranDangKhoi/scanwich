"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { accountApi } from "src/api-requests/accounts.apis";
import { authApi } from "src/api-requests/auth.apis.";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
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
import { TLogoutBody } from "src/validations/auth.validations";

export default function DropdownAvatar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: myProfileData } = useQuery({
    queryKey: ["get-profile"],
    queryFn: () => accountApi.getMyProfile(),
    staleTime: Infinity, // Keep the data fresh forever
  });

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: (body: TLogoutBody) => authApi.logoutServerSide(body),
  });

  const handleLogout = () => {
    logoutMutation.mutate(
      {
        refreshToken: clientRefreshToken.value,
      },
      {
        onSuccess: () => {
          queryClient.removeQueries({ queryKey: ["get-profile"] });
          toast.success("Đăng xuất thành công");
          router.push(PATH.LOGIN);
        },
      },
    );
  };

  useEffect(() => {
    if (myProfileData) {
      console.log("Fetched successfully");
    }
  }, [myProfileData]);

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
        <DropdownMenuLabel>{myProfileData?.payload.data.name}</DropdownMenuLabel>
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
