import type { SiteSettings } from "./types";

export const AVATAR_SIZE_PRESETS = {
  sm: 88,
  md: 112,
  lg: 136,
  xl: 168,
  xxl: 196,
} as const;

export const GAP_PRESETS = {
  cozy: 12,
  normal: 20,
  roomy: 32,
} as const;

export type AvatarSizePreset = keyof typeof AVATAR_SIZE_PRESETS | "custom";
export type FriendsGapPreset = keyof typeof GAP_PRESETS | "custom";
export type FriendsSpread = "auto" | "full";

export function resolveAvatarSizePx(settings: SiteSettings): number {
  const preset = settings.avatarSizePreset;
  if (preset && preset !== "custom" && preset in AVATAR_SIZE_PRESETS) {
    return AVATAR_SIZE_PRESETS[preset as keyof typeof AVATAR_SIZE_PRESETS];
  }
  return settings.avatarSizePx > 0 ? settings.avatarSizePx : AVATAR_SIZE_PRESETS.md;
}

export function resolveGridGapPx(settings: SiteSettings): number {
  const preset = settings.friendsGapPreset;
  if (preset && preset !== "custom" && preset in GAP_PRESETS) {
    return GAP_PRESETS[preset as keyof typeof GAP_PRESETS];
  }
  return settings.gridGapPx >= 0 ? settings.gridGapPx : GAP_PRESETS.normal;
}

/** Width of the face group: wide enough for every friend on one row when spread is auto. */
export function friendsBandMaxWidth(friendCount: number, settings: SiteSettings): string {
  if (settings.friendsSpread === "full") {
    return "100%";
  }
  const size = resolveAvatarSizePx(settings);
  const gap = resolveGridGapPx(settings);
  const n = Math.max(1, friendCount);
  const needed = n * size + (n - 1) * gap;
  return `min(100%, ${needed}px)`;
}

export function shapeContainerSize(settings: SiteSettings): string {
  const avatar = resolveAvatarSizePx(settings);
  const gap = resolveGridGapPx(settings);
  return `${avatar * 2.75 + gap}px`;
}
