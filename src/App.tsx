import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import confetti from "canvas-confetti";
import settingsJson from "../content/settings.json";
import type { ConfettiIntensity, Friend, SiteSettings } from "./types";
import "./App.css";

const settings = settingsJson as SiteSettings;

const friendModules = import.meta.glob<{ default: Friend }>(
  "../content/friends/*.json",
  { eager: true },
);

const friends: Friend[] = Object.values(friendModules)
  .map((m) => m.default)
  .sort((a, b) => a.order - b.order);

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

function fireConfetti(intensity: ConfettiIntensity) {
  const scale = intensity === "heavy" ? 1.35 : intensity === "medium" ? 1 : 0.7;
  const count = (n: number) => Math.max(12, Math.floor(n * scale));

  void confetti({
    particleCount: count(90),
    spread: 70,
    startVelocity: 35,
    origin: { y: 0.25 },
    ticks: 220,
  });
  window.setTimeout(() => {
    void confetti({
      particleCount: count(55),
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.65 },
      ticks: 200,
    });
  }, 140);
  window.setTimeout(() => {
    void confetti({
      particleCount: count(55),
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.65 },
      ticks: 200,
    });
  }, 260);
}

export default function App() {
  const [phase, setPhase] = useState<"intro" | "main">("intro");
  const [active, setActive] = useState<Friend | null>(null);
  const introTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.title = settings.documentTitle;
  }, []);

  useEffect(() => {
    introTimer.current = window.setTimeout(() => {
      setPhase("main");
      if (settings.confettiEnabled) {
        fireConfetti(settings.confettiIntensity);
      }
    }, settings.introDurationMs);
    return () => {
      if (introTimer.current) window.clearTimeout(introTimer.current);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rootVars = useMemo(
    () =>
      ({
        "--font-heading": settings.fontHeading,
        "--font-body": settings.fontBody,
        "--accent": settings.accentColor,
        "--accent-2": settings.accentColor2,
        "--surface": settings.surfaceColor,
        "--text-on-surface": settings.textOnSurface,
        "--avatar-ring": settings.avatarRingColor,
        "--avatar-size": `${settings.avatarSizePx}px`,
        "--grid-gap": `${settings.gridGapPx}px`,
        "--overlay-tint": settings.overlayTint,
        "--bg-blur": `${settings.backgroundBlurPx}px`,
        "--vinyl-spin": `${settings.vinylSpinDurationSec}s`,
      }) as CSSProperties,
    [],
  );

  const introClass =
    settings.introAnimation === "fade"
      ? "intro-fade"
      : settings.introAnimation === "slide-up"
        ? "intro-slide-up"
        : "intro-fade-scale";

  const bgStyle = useMemo(() => {
    if (!settings.backgroundImage) return undefined;
    return { backgroundImage: `url(${settings.backgroundImage})` };
  }, []);

  return (
    <div className="app" style={rootVars}>
      {phase === "intro" ? (
        <div className={`intro-root ${introClass}`} role="status" aria-live="polite">
          <div className="intro-inner">
            <h1 className="intro-title">{settings.introTitle}</h1>
            <p className="intro-sub">{settings.introSubtitle}</p>
          </div>
        </div>
      ) : null}

      <main className="page">
        <div className="page__bg" style={bgStyle} aria-hidden />
        <div className="page__overlay" aria-hidden />
        <div className="page__content">
          <h2 className="page__title">Friends</h2>
          <p className="page__hint">Choose a face to open a note and spin the record.</p>
          <div className="face-grid">
            {friends.map((f) => (
              <button
                key={f.slug}
                type="button"
                className="face-button"
                onClick={() => setActive(f)}
                aria-label={`Open message from ${f.name}`}
              >
                {f.photo ? (
                  <img className="face" src={f.photo} alt="" />
                ) : (
                  <span className="face-placeholder" aria-hidden>
                    {initials(f.name)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </main>

      {active ? (
        <FriendModal
          friend={active}
          onClose={() => setActive(null)}
          modalBackdropBlur={settings.modalBackdropBlur}
          modalStyle={settings.modalStyle}
          vinylIdlePulse={settings.vinylIdlePulse}
        />
      ) : null}
    </div>
  );
}

type ModalProps = {
  friend: Friend;
  onClose: () => void;
  modalBackdropBlur: boolean;
  modalStyle: SiteSettings["modalStyle"];
  vinylIdlePulse: boolean;
};

function FriendModal({
  friend,
  onClose,
  modalBackdropBlur,
  modalStyle,
  vinylIdlePulse,
}: ModalProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setPlaying(false);
    setToast(null);
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
  }, [friend.slug]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!friend.song) {
      setToast("Add an audio file for this friend in the Admin.");
      return;
    }
    setToast(null);
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      void a.play().then(
        () => setPlaying(true),
        () => {
          setToast("Could not play this file. Check the format (MP3 is safest).");
          setPlaying(false);
        },
      );
    }
  }, [friend.song, playing]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnd = () => setPlaying(false);
    a.addEventListener("ended", onEnd);
    return () => a.removeEventListener("ended", onEnd);
  }, [friend.song]);

  const modalClass =
    modalStyle === "solid" ? "modal modal--solid" : "modal modal--glass";
  const backdropClass =
    "modal-backdrop" + (modalBackdropBlur ? " modal-backdrop--blur" : "");

  return (
    <div
      className={backdropClass}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={modalClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`friend-title-${friend.slug}`}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h3 className="modal__title" id={`friend-title-${friend.slug}`}>
          {friend.name}
        </h3>
        <p className="modal__note">{friend.note}</p>

        <div className="player-row">
          <div className="vinyl-wrap">
            <button
              type="button"
              className={
                "vinyl" +
                (playing ? " vinyl--playing" : "") +
                (vinylIdlePulse && !playing ? " vinyl--pulse" : "")
              }
              onClick={togglePlay}
              aria-label={playing ? "Pause song" : "Play song"}
            >
              <span className="vinyl__label">
                {friend.discImage ? (
                  <img src={friend.discImage} alt="" />
                ) : (
                  <span aria-hidden style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                    {initials(friend.name)}
                  </span>
                )}
              </span>
              <span className="vinyl__hole" aria-hidden />
            </button>
          </div>
          <div className="track-meta">
            <p className="track-meta__title">{friend.songTitle}</p>
            {friend.songArtist ? (
              <p className="track-meta__artist">{friend.songArtist}</p>
            ) : null}
          </div>
        </div>

        {friend.song ? (
          <audio ref={audioRef} src={friend.song} preload="metadata" />
        ) : null}
        {toast ? (
          <p className="toast" role="status">
            {toast}
          </p>
        ) : null}
      </div>
    </div>
  );
}
