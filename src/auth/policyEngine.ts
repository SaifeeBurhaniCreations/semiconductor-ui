import { Capability } from "../access/capabilities";

export type Role =
  | "ADMIN"
  | "ENGINEER"
  | "OPERATOR"
  | "DATA_SCIENTIST";

const rolePolicies: Record<Role, Capability[]> = {
  ADMIN: [
    "VIEW_DASHBOARD",
    "VIEW_MANUFACTURING",
    "VIEW_VISION",
    "VIEW_LOGIC",
    "VIEW_INFRA",
    "VIEW_ANALYTICS",
    "VIEW_SIMULATION",
    "VIEW_GOVERNANCE",
    "VIEW_ADMIN",
    "VIEW_REGISTRY",
    "VIEW_INTEGRATIONS",
    "VIEW_SETTINGS",
  ],

  ENGINEER: [
    "VIEW_DASHBOARD",
    "VIEW_MANUFACTURING",
    "VIEW_VISION",
    "VIEW_LOGIC",
    "VIEW_INFRA",
    "VIEW_SIMULATION",
    "VIEW_ANALYTICS",
    "VIEW_REGISTRY",
  ],

  OPERATOR: [
    "VIEW_DASHBOARD",
    "VIEW_MANUFACTURING",
    "VIEW_VISION",
  ],

  DATA_SCIENTIST: [
    "VIEW_DASHBOARD",
    "VIEW_ANALYTICS",
    "VIEW_SIMULATION",
  ],
};

export function buildCapabilities(role: Role) {
  const caps = new Set(rolePolicies[role] ?? []);

  return {
    can: (cap: Capability) => caps.has(cap),
    all: caps,
  };
}
