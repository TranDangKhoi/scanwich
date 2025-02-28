const isClient = typeof window !== "undefined";

export function getAccessTokenFromLS() {
  return isClient ? localStorage.getItem("accessToken") : null;
}

export function getRefreshTokenFromLS() {
  return isClient ? localStorage.getItem("refreshToken") : null;
}

export function setAccessTokenToLS(accessToken: string) {
  if (isClient) {
    localStorage.setItem("accessToken", accessToken);
  }
}

export function setRefreshTokenToLS(refreshToken: string) {
  if (isClient) {
    localStorage.setItem("refreshToken", refreshToken);
  }
}

export function setBothTokenToLS({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
  if (isClient) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
}

export function clearLS() {
  if (isClient) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}
