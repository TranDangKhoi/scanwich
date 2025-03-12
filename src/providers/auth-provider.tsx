"use client";

import { useRouter } from "next/navigation";
import { createContext, ReactNode, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { EVENTS } from "src/constants/events.constants";
import { eventEmitter } from "src/lib/event-emitter";
import { clientAccessToken } from "src/lib/http";
import { TAccount } from "src/validations/account.validations";

type TAuthContext = {
  userProfile: TAccount | null;
  setUserProfile: (userProfile: TAccount) => void;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<TAuthContext>({
  userProfile: null,
  setUserProfile: () => {},
  logout: async () => {},
});

const AuthProvider = ({
  children,
  initialAccessToken = "",
}: {
  children: ReactNode;
  initialAccessToken: string;
  initialRefreshToken: string;
}) => {
  const router = useRouter();

  const logout = useCallback(async () => {
    clientAccessToken.value = "";
    router.push("/login");
    setTimeout(() => {
      toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
    }, 100);
  }, [router]);

  useEffect(() => {
    const unsubscribe = eventEmitter.on(EVENTS.UNAUTHORIZED_EVENT, logout);
    return () => unsubscribe();
  }, [logout]);

  if (typeof window !== "undefined") {
    clientAccessToken.value = initialAccessToken;
  }

  return (
    <AuthContext.Provider
      value={{
        userProfile: null,
        setUserProfile: () => {}, // Always null, only declared because prop "value" needs to have something passed in
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
