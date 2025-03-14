import { useEffect, useState } from "react";
import { clientAccessToken } from "src/lib/http";

export function useAuth() {
  // Initialize with server-side value if available
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!clientAccessToken.value);
    setIsLoading(false);
  }, []);

  return { isAuthenticated, isLoading };
}
