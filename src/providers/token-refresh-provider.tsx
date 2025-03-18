"use client";
import { jwtDecode } from "jwt-decode";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { authApi } from "src/api-requests/auth.apis";
import { clientAccessToken } from "src/lib/http";

// Routes that don't require /refresh-token API
const NON_REFRESH_TOKEN_ROUTES = ["/login", "/refresh-token", "/"];

export default function TokenRefreshProvider() {
  const pathname = usePathname();
  const refreshTokenIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const refreshingTokenRef = useRef<boolean | null>(null);
  useEffect(() => {
    // If the current path is in the non-refresh-token routes list, stop further execution
    if (NON_REFRESH_TOKEN_ROUTES.includes(pathname)) return;

    const validateAndRefreshToken = async () => {
      const accessToken = clientAccessToken.value;
      if (!accessToken) return;

      const decodedAccessToken = jwtDecode<{ exp: number; iat: number }>(accessToken);
      const now = new Date().getTime() / 1000 - 1;

      const accessTokenExpireDate = decodedAccessToken.exp;

      const accessTokenIssuedAt = decodedAccessToken.iat;

      // For instance, if our access token expires after 10 secs
      // we will check if one-third of the time (3.333s) remains, and if so, we will refresh the token.

      // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
      const secondsLeftBeforeAccessTokenExpire = accessTokenExpireDate - now;

      // Thời gian hết hạn (giây) sẽ tính dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat
      const totalAccessTokenLifetime = accessTokenExpireDate - accessTokenIssuedAt;

      const isAccessTokenAlmostExpired = secondsLeftBeforeAccessTokenExpire <= totalAccessTokenLifetime / 3;
      if (isAccessTokenAlmostExpired) {
        // These 2 lines are to prevent multiple refresh token requests
        // If the refresh token request is already in progress, we will return immediately
        if (refreshingTokenRef.current) return;
        refreshingTokenRef.current = true;

        try {
          const result = await authApi.refreshTokenServerSide();
          const { accessToken: newAccessToken } = result.payload.data;
          clientAccessToken.value = newAccessToken;
        } catch (error) {
          clearInterval(refreshTokenIntervalRef.current!);
          return error;
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
