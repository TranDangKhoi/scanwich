"use client";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { authApi } from "src/api-requests/auth.apis";
import { clientAccessToken } from "src/lib/http";

// Pages where we don't need to keep refreshing tokens (guest pages / landing page).
const NO_TOKEN_REFRESH_PATHS = ["/login", "/refresh-token", "/"];

export default function TokenRefreshProvider() {
  const pathname = usePathname();
  const router = useRouter();
  const refreshCheckIntervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRefreshInFlightRef = useRef(false);
  const lastRefreshAttemptMsRef = useRef(0);
  useEffect(() => {
    const stopRefreshCheckInterval = () => {
      if (refreshCheckIntervalIdRef.current) {
        clearInterval(refreshCheckIntervalIdRef.current);
        refreshCheckIntervalIdRef.current = null;
      }
    };

    stopRefreshCheckInterval();

    if (NO_TOKEN_REFRESH_PATHS.includes(pathname)) return;

    const refreshIfNeeded = async () => {
      const accessToken = clientAccessToken.value;
      if (!accessToken) return;

      let decodedAccessToken: { exp: number; iat: number };
      try {
        decodedAccessToken = jwtDecode<{ exp: number; iat: number }>(accessToken);
      } catch {
        // If the token is malformed, treat as logged-out.
        clientAccessToken.value = "";
        router.push("/login");
        return;
      }

      const now = Date.now() / 1000;

      const accessTokenExpiresAtSeconds = decodedAccessToken.exp;
      const accessTokenIssuedAtSeconds = decodedAccessToken.iat;

      const secondsLeft = accessTokenExpiresAtSeconds - now;
      const totalLifetimeSeconds = accessTokenExpiresAtSeconds - accessTokenIssuedAtSeconds;

      // Refresh when the token is close to expiring.
      // - The "1/3 lifetime" heuristic adapts to different token TTLs.
      // - The 60s minimum avoids refreshing too frequently for short TTLs.
      const shouldRefresh = secondsLeft <= Math.max(60, totalLifetimeSeconds / 3);
      if (shouldRefresh) {
        const nowMs = Date.now();
        if (nowMs - lastRefreshAttemptMsRef.current < 5000) return;

        // Prevent concurrent refresh requests (can happen with focus/visibility events).
        if (isRefreshInFlightRef.current) return;
        isRefreshInFlightRef.current = true;
        lastRefreshAttemptMsRef.current = nowMs;

        try {
          // Calls Next.js route:
          // - refreshes via backend using the refreshToken cookie
          // - updates httpOnly cookies
          const result = await authApi.refreshTokenServerSide();
          const { accessToken: newAccessToken } = result.payload.data;
          clientAccessToken.value = newAccessToken;
        } catch (error) {
          stopRefreshCheckInterval();
          router.push("/login");
          return error;
        } finally {
          isRefreshInFlightRef.current = false;
        }
      }
    };

    const runRefreshCheck = () => {
      void refreshIfNeeded();
    };

    const startRefreshCheckInterval = () => {
      stopRefreshCheckInterval();
      // Keep a low-frequency check while the tab is visible.
      // Background tabs can throttle timers heavily, so we also refresh on "resume" events.
      refreshCheckIntervalIdRef.current = setInterval(runRefreshCheck, 30000);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        runRefreshCheck();
        startRefreshCheckInterval();
      } else {
        stopRefreshCheckInterval();
      }
    };

    const onFocus = () => {
      runRefreshCheck();
    };

    const onOnline = () => {
      runRefreshCheck();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", onFocus);
    window.addEventListener("online", onOnline);

    runRefreshCheck();
    if (document.visibilityState === "visible") {
      startRefreshCheckInterval();
    }

    return () => {
      stopRefreshCheckInterval();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onOnline);
      isRefreshInFlightRef.current = false;
    };
  }, [pathname, router]);
  return null;
}
