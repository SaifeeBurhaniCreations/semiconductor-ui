import { Capability } from "./capabilities";

export const sidebarPolicy = {
  dashboard: ["VIEW_DASHBOARD"],
  manufacturing: ["VIEW_MANUFACTURING"],
  vision: ["VIEW_VISION"],
  logic: ["VIEW_LOGIC"],
  resources: ["VIEW_INFRA"],

  lineage: ["VIEW_ANALYTICS"],
  sim: ["VIEW_SIMULATION"],
  analytics: ["VIEW_ANALYTICS"],

  oversight: ["VIEW_GOVERNANCE"],
  security: ["VIEW_GOVERNANCE"],
  billing: ["VIEW_ADMIN"],
  admin: ["VIEW_ADMIN"],

  registry: ["VIEW_REGISTRY"],
  integrations: ["VIEW_INTEGRATIONS"],
  settings: ["VIEW_SETTINGS"],
} satisfies Record<string, Capability[]>;
