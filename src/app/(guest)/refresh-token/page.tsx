"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { authApi } from "src/api-requests/auth.apis.";
import { clientAccessToken } from "src/lib/http";
import { handleErrorApi } from "src/lib/utils";

export default function RefreshTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPathname = searchParams.get("redirect");
  const mountedRef = useRef(false);
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const validateAndRefreshToken = async () => {
      try {
        const result = await authApi.refreshTokenServerSide();
        const { accessToken: newAccessToken } = result.payload.data;
        clientAccessToken.value = newAccessToken;
        if (redirectPathname) {
          router.push(redirectPathname);
        } else {
          router.push("/");
        }
      } catch (error) {
        handleErrorApi({ error });
        // Redirect to login on refresh failure
        router.push("/login");
      }
    };

    validateAndRefreshToken();
  }, [redirectPathname, router]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    </div>
  );
}
