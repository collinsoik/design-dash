// ParkWise safety variants are rendered as overlays on ParkWiseCore.
// This file exports a helper to resolve the safety variant from decisions.

export type SafetyVariant = "safety-score" | "community-reviews" | null;

export function resolveSafetyVariant(branchId: string | undefined): SafetyVariant {
  if (branchId === "safety-score") return "safety-score";
  if (branchId === "community-reviews") return "community-reviews";
  return null;
}
