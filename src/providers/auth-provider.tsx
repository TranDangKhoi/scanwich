"use client";

import { createContext, ReactNode, useState } from "react";
import { clientAccessToken, clientRefreshToken } from "src/lib/http";
import { TAccount } from "src/validations/account.validations";

type TAuthContext = {
  userProfile: TAccount | null;
  setUserProfile: (userProfile: TAccount) => void;
};

export const AuthContext = createContext<TAuthContext>({
  userProfile: {
    avatar: "",
    email: "",
    id: 0,
    name: "",
    role: "Employee",
  },
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
  const [userProfile, setUserProfile] = useState<TAccount | null>(null);
  return (
    <AuthContext.Provider
      value={{
        userProfile,
        setUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
