import { describe, expect, it } from "vitest";
import { ROLES } from "../types/user";
import { canAccessPath, permissions } from "./permissions";
import { dashboardPath } from "../routes/paths";

describe("canAccessPath", () => {
  it("lets only the system admin open the team page", () => {
    for (const role of ROLES) {
      expect(canAccessPath(role, dashboardPath.team), role).toBe(role === "system_admin");
    }
  });

  it("hides analytics from sales staff but not from the analyst", () => {
    expect(canAccessPath("analyst", dashboardPath.analytics)).toBe(true);
    expect(canAccessPath("sales_manager", dashboardPath.analytics)).toBe(true);
    expect(canAccessPath("salesperson", dashboardPath.analytics)).toBe(false);
  });

  it("denies everything without a role and keeps undefined paths open to roles", () => {
    expect(canAccessPath(undefined, dashboardPath.root)).toBe(false);
    expect(canAccessPath("analyst", "/dashboard/products/12")).toBe(true);
  });
});

describe("permissions", () => {
  it("makes the analyst read-only for products and orders", () => {
    expect(permissions.canManageProducts("analyst")).toBe(false);
    expect(permissions.canManageOrders("analyst")).toBe(false);
    expect(permissions.canManageProducts("salesperson")).toBe(true);
    expect(permissions.canManageOrders(undefined)).toBe(false);
  });

  it("allows wiping system data only for the system admin", () => {
    for (const role of ROLES) {
      expect(permissions.canManageSystemData(role), role).toBe(role === "system_admin");
    }
  });
});
