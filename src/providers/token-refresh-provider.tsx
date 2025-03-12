"use client";
import { jwtDecode } from "jwt-decode";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { authApi } from "src/api-requests/auth.apis.";
import { clientAccessToken } from "src/lib/http";
import { handleErrorApi } from "src/lib/utils";
const NON_REFRESH_TOKEN_ROUTES = ["/login", "/refresh-token", "/"];

export default function TokenRefreshProvider() {
  const pathname = usePathname();
  const refreshTokenIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const refreshingTokenRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (NON_REFRESH_TOKEN_ROUTES.includes(pathname)) return;
    // let interval: NodeJS.Timeout | null = null;

    const validateAndRefreshToken = async () => {
      const accessToken = clientAccessToken.value;
      if (!accessToken) return;

      const decodedAccessToken = jwtDecode<{ exp: number; iat: number }>(accessToken);
      const now = new Date().getTime() / 1000;

      const accessTokenExpireDate = decodedAccessToken.exp;

      const accessTokenIssuedAt = decodedAccessToken.iat;

      // Nếu access token của chúng ta có thời gian hết hạn là 10s
      // thì mình sẽ kiểm tra xem nếu còn 1/3 thời gian (3.333s) thì mình sẽ cho refresh token lại

      // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
      const secondsLeftBeforeAccessTokenExpire = accessTokenExpireDate - now;

      // Thời gian hết hạn (giây) sẽ tính dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat
      const totalAccessTokenLifetime = accessTokenExpireDate - accessTokenIssuedAt;

      const isAccessTokenAlmostExpired = secondsLeftBeforeAccessTokenExpire <= totalAccessTokenLifetime / 3;
      if (isAccessTokenAlmostExpired) {
        if (refreshingTokenRef.current) return;
        refreshingTokenRef.current = true;

        try {
          const result = await authApi.refreshTokenServerSide();
          const { accessToken: newAccessToken } = result.payload.data;
          clientAccessToken.value = newAccessToken;
        } catch (error) {
          handleErrorApi({ error });
          clearInterval(refreshTokenIntervalRef.current!);
        } finally {
          refreshingTokenRef.current = false;
        }
      }
    };
    validateAndRefreshToken();
    refreshTokenIntervalRef.current = setInterval(validateAndRefreshToken, 3000);
    return () => {
      if (refreshTokenIntervalRef.current) {
        clearInterval(refreshTokenIntervalRef.current);
        refreshTokenIntervalRef.current = null;
      }
    };
  }, [pathname]);
  return <div></div>;
}
