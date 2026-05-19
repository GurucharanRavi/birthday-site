export type Friend = {
  name: string;
  slug: string;
  order: number;
  photo: string;
  photoFocusX?: number;
  photoFocusY?: number;
  note: string;
  song: string;
  songTitle: string;
  songArtist?: string;
  discImage: string;
  discFocusX?: number;
  discFocusY?: number;
  showNameInModal?: boolean;
};

export type IntroAnimation = "fade-scale" | "fade" | "slide-up";
export type IntroExitAnimation = "fade" | "fade-scale" | "slide-down" | "none";
export type ConfettiIntensity = "light" | "medium" | "heavy";
export type ModalStyle = "glass" | "solid";
export type AvatarSizePreset = "sm" | "md" | "lg" | "xl" | "xxl" | "custom";
export type FriendsGapPreset = "cozy" | "normal" | "roomy" | "custom";
export type FriendsSpread = "auto" | "full";
/** @deprecated kept for older settings.json */
export type AvatarSizing = "fixed" | "responsive";
export type FriendsLayout =
  | "wrap"
  | "column"
  | "row"
  | "single-row"
  | "pentagon-up"
  | "pentagon-down"
  | "ring"
  | "cross"
  | "arc";
export type FriendsJustify =
  | "center"
  | "flex-start"
  | "flex-end"
  | "space-between"
  | "space-around";

export type SiteSettings = {
  documentTitle: string;
  introTitle: string;
  introSubtitle: string;
  introDurationMs: number;
  introAnimation: IntroAnimation;
  introExitAnimation: IntroExitAnimation;
  introExitDurationMs: number;
  confettiEnabled: boolean;
  confettiIntensity: ConfettiIntensity;
  backgroundImage: string;
  backgroundPositionX: number;
  backgroundPositionY: number;
  backgroundBlurPx: number;
  overlayTint: string;
  fontIntroTitle: string;
  fontIntroTitleCustom: string;
  fontIntroSubtitle: string;
  fontIntroSubtitleCustom: string;
  fontFriendsTitle: string;
  fontFriendsTitleCustom: string;
  fontFriendsHint: string;
  fontFriendsHintCustom: string;
  fontModalTitle: string;
  fontModalTitleCustom: string;
  fontModalNote: string;
  fontModalNoteCustom: string;
  fontModalTrack: string;
  fontModalTrackCustom: string;
  /** @deprecated use fontFriendsTitle — kept for older settings.json */
  fontHeading?: string;
  /** @deprecated use fontFriendsHint — kept for older settings.json */
  fontBody?: string;
  friendsPageTitle: string;
  friendsPageHint: string;
  friendsLayout: FriendsLayout;
  avatarSizePreset: AvatarSizePreset;
  friendsGapPreset: FriendsGapPreset;
  friendsSpread: FriendsSpread;
  /** @deprecated use avatarSizePreset — still used when preset is custom */
  friendsJustify: FriendsJustify;
  friendsOffsetYVh: number;
  /** @deprecated use friendsSpread auto — 0 means auto */
  friendsMaxWidthPx: number;
  accentColor: string;
  accentColor2: string;
  surfaceColor: string;
  textOnSurface: string;
  avatarRingColor: string;
  avatarSizePx: number;
  gridGapPx: number;
  /** @deprecated */
  avatarSizing?: AvatarSizing;
  avatarSizeMinPx?: number;
  avatarSizeMaxPx?: number;
  gridGapMinPx?: number;
  gridGapMaxPx?: number;
  modalBackdropBlur: boolean;
  modalStyle: ModalStyle;
  vinylSpinDurationSec: number;
  vinylIdlePulse: boolean;
};
