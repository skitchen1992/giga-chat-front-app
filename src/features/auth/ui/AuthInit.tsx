import { useEffect } from "react";
import { useGetAuthTokenMutation } from "@/app/services/api";

export function AuthInit() {
  const [getAuthToken] = useGetAuthTokenMutation();

  useEffect(() => {
    void getAuthToken();
  }, [getAuthToken]);

  return null;
}
