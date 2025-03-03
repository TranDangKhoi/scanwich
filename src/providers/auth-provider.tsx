"use client";

import { createContext, ReactNode } from "react";
import { clientAccessToken, clientRefreshToken } from "src/lib/http";
import { TAccount } from "src/validations/account.validations";

type TAuthContext = {
  userProfile: TAccount | null;
  setUserProfile: (userProfile: TAccount) => void;
};

export const AuthContext = createContext<TAuthContext>({
  userProfile: null,
  setUserProfile: () => {},
});

const AuthProvider = ({
  children,
  initialAccessToken = "",
  initialRefreshToken = "",
}: {
  children: ReactNode;
  initialAccessToken: string;
  initialRefreshToken: string;
}) => {
  if (typeof window !== "undefined") {
    clientRefreshToken.value = initialRefreshToken;
    clientAccessToken.value = initialAccessToken;
  }

  return (
    <AuthContext.Provider
      value={{
        userProfile: null,
        setUserProfile: () => {}, // Always null, only declared because prop "value" needs to have something passed in
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
