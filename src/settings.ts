import settingsJson from "../content/settings.json";
import { AVATAR_SIZE_PRESETS } from "./layoutSettings";
import type { AvatarSizePreset, FriendsLayout, SiteSettings } from "./types";

function normalizeLayout(layout?: string): FriendsLayout {
  if (layout === "single-row") return "row";
  const allowed: FriendsLayout[] = [
    "wrap",
    "column",
    "row",
    "pentagon-up",
    "pentagon-down",
    "ring",
    "cross",
    "arc",
  ];
  if (layout && allowed.includes(layout as FriendsLayout)) {
    return layout as FriendsLayout;
  }
  return "wrap";
}

function inferAvatarPreset(px: number): AvatarSizePreset {
  let best: AvatarSizePreset = "custom";
  let bestDiff = Infinity;
  for (const [key, value] of Object.entries(AVATAR_SIZE_PRESETS)) {
    const diff = Math.abs(px - value);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = key as AvatarSizePreset;
    }
  }
  return bestDiff <= 8 ? best : "custom";
}

const defaults: SiteSettings = {
  documentTitle: "Happy Birthday",
  introTitle: "Happy Birthday",
  introSubtitle: "",
  introDurationMs: 3800,
  introAnimation: "fade-scale",
  introExitAnimation: "fade",
  introExitDurationMs: 700,
  confettiEnabled: true,
  confettiIntensity: "medium",
  backgroundImage: "",
  backgroundPositionX: 50,
  backgroundPositionY: 50,
  backgroundBlurPx: 8,
  overlayTint: "rgba(15, 23, 42, 0.55)",
  fontIntroTitle: "'Playfair Display', Georgia, serif",
  fontIntroTitleCustom: "",
  fontIntroSubtitle: "'DM Sans', system-ui, sans-serif",
  fontIntroSubtitleCustom: "",
  fontFriendsTitle: "'Playfair Display', Georgia, serif",
  fontFriendsTitleCustom: "",
  fontFriendsHint: "'DM Sans', system-ui, sans-serif",
  fontFriendsHintCustom: "",
  fontModalTitle: "'Playfair Display', Georgia, serif",
  fontModalTitleCustom: "",
  fontModalNote: "'DM Sans', system-ui, sans-serif",
  fontModalNoteCustom: "",
  fontModalTrack: "'DM Sans', system-ui, sans-serif",
  fontModalTrackCustom: "",
  friendsPageTitle: "",
  friendsPageHint: "",
  friendsLayout: "wrap",
  avatarSizePreset: "md",
  friendsGapPreset: "normal",
  friendsSpread: "auto",
  friendsJustify: "center",
  friendsOffsetYVh: 0,
  friendsMaxWidthPx: 0,
  accentColor: "#f9a8d4",
  accentColor2: "#a5b4fc",
  surfaceColor: "rgba(15, 23, 42, 0.82)",
  textOnSurface: "#f8fafc",
  avatarRingColor: "#ffffff",
  avatarSizePx: 112,
  gridGapPx: 20,
  modalBackdropBlur: true,
  modalStyle: "glass",
  vinylSpinDurationSec: 4,
  vinylIdlePulse: true,
};

export function getSettings(): SiteSettings {
  const s = settingsJson as SiteSettings & {
    fontHeading?: string;
    fontBody?: string;
    avatarSizing?: string;
  };

  const spread: SiteSettings["friendsSpread"] =
    s.friendsSpread === "full" ? "full" : "auto";

  const avatarSizePreset =
    s.avatarSizePreset ??
    (s.avatarSizePx ? inferAvatarPreset(s.avatarSizePx) : defaults.avatarSizePreset);

  return {
    ...defaults,
    ...s,
    fontIntroTitle: s.fontIntroTitle ?? s.fontHeading ?? defaults.fontIntroTitle,
    fontIntroSubtitle: s.fontIntroSubtitle ?? defaults.fontIntroSubtitle,
    fontFriendsTitle: s.fontFriendsTitle ?? s.fontHeading ?? defaults.fontFriendsTitle,
    fontFriendsHint: s.fontFriendsHint ?? s.fontBody ?? defaults.fontFriendsHint,
    fontModalTitle: s.fontModalTitle ?? s.fontHeading ?? defaults.fontModalTitle,
    fontModalNote: s.fontModalNote ?? s.fontBody ?? defaults.fontModalNote,
    fontModalTrack: s.fontModalTrack ?? s.fontBody ?? defaults.fontModalTrack,
    friendsPageTitle: s.friendsPageTitle ?? "",
    friendsPageHint: s.friendsPageHint ?? "",
    friendsLayout: normalizeLayout(s.friendsLayout),
    introExitAnimation: s.introExitAnimation ?? defaults.introExitAnimation,
    introExitDurationMs: s.introExitDurationMs ?? defaults.introExitDurationMs,
    avatarSizePreset,
    friendsGapPreset: s.friendsGapPreset ?? defaults.friendsGapPreset,
    friendsSpread: spread,
    friendsJustify: s.friendsJustify ?? defaults.friendsJustify,
    friendsOffsetYVh: s.friendsOffsetYVh ?? defaults.friendsOffsetYVh,
    friendsMaxWidthPx: s.friendsMaxWidthPx ?? 0,
    backgroundPositionX: s.backgroundPositionX ?? 50,
    backgroundPositionY: s.backgroundPositionY ?? 50,
  };
}
