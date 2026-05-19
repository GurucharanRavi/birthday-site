export type Friend = {
  name: string;
  slug: string;
  order: number;
  photo: string;
  note: string;
  song: string;
  songTitle: string;
  songArtist?: string;
  discImage: string;
};

export type IntroAnimation = "fade-scale" | "fade" | "slide-up";
export type ConfettiIntensity = "light" | "medium" | "heavy";
export type ModalStyle = "glass" | "solid";

export type SiteSettings = {
  documentTitle: string;
  introTitle: string;
  introSubtitle: string;
  introDurationMs: number;
  introAnimation: IntroAnimation;
  confettiEnabled: boolean;
  confettiIntensity: ConfettiIntensity;
  backgroundImage: string;
  backgroundBlurPx: number;
  overlayTint: string;
  fontHeading: string;
  fontBody: string;
  accentColor: string;
  accentColor2: string;
  surfaceColor: string;
  textOnSurface: string;
  avatarRingColor: string;
  avatarSizePx: number;
  gridGapPx: number;
  modalBackdropBlur: boolean;
  modalStyle: ModalStyle;
  vinylSpinDurationSec: number;
  vinylIdlePulse: boolean;
};
