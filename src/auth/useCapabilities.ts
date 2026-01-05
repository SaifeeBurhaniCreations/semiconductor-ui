import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { buildCapabilities } from "./policyEngine";

export function useCapabilities() {
  const { user } = useAuth(); // user.role exists

  return useMemo(
    () => buildCapabilities(user.role),
    [user.role]
  );
}
