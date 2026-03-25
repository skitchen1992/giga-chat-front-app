import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { Button } from "@/components/ui/button";
import { bootstrapAuth } from "../model/bootstrapAuthThunk";
import { authBootstrapReset } from "@/features/auth/model/slice";
import {
  selectAuthBootstrapError,
  selectAuthBootstrapStatus,
} from "@/features/auth/model/selectors";

let authBootstrapPromise: Promise<void> | null = null;

interface AuthInitProps {
  children: React.ReactNode;
}

export function AuthInit(props: AuthInitProps) {
  const { children } = props;

  const dispatch = useAppDispatch();

  const status = useAppSelector(selectAuthBootstrapStatus);
  const errorMessage = useAppSelector(selectAuthBootstrapError);
  const [retryKey, setRetryKey] = useState(0);

  const runBootstrap = useCallback(async () => {
    if (!authBootstrapPromise) {
      authBootstrapPromise = (async () => {
        try {
          await dispatch(bootstrapAuth());
        } catch {
          authBootstrapPromise = null;
        }
      })();
    }
    await authBootstrapPromise;
  }, [dispatch]);

  useEffect(() => {
    void runBootstrap();
  }, [retryKey, runBootstrap]);

  const handleRetry = () => {
    authBootstrapPromise = null;
    dispatch(authBootstrapReset());
    setRetryKey((k) => k + 1);
  };

  if (status === "ready") {
    return <>{children}</>;
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="max-w-md text-center text-sm text-destructive">
          {errorMessage ?? "Ошибка при старте приложения"}
        </p>
        <Button type="button" variant="outline" onClick={handleRetry}>
          Повторить
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div
        className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary"
        aria-label="Загрузка"
      />
    </div>
  );
}
