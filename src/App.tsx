import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import confetti from "canvas-confetti";
import type { ConfettiIntensity, Friend, SiteSettings } from "./types";
import { FriendsGrid } from "./FriendsGrid";
import { friendsBandMaxWidth, resolveAvatarSizePx, resolveGridGapPx, shapeContainerSize } from "./layoutSettings";
import { getSettings } from "./settings";
import { hasText, objectPosition, resolveFont } from "./utils";
import "./App.css";

const settings = getSettings();

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

type Phase = "intro" | "intro-out" | "main";

export default function App() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [active, setActive] = useState<Friend | null>(null);
  const introTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.title = hasText(settings.documentTitle)
      ? settings.documentTitle.trim()
      : "Birthday";
  }, []);

  useEffect(() => {
    if (!settings.confettiEnabled) return;

    const burstMs = 450;
    const t1 = window.setTimeout(() => fireConfetti(settings.confettiIntensity), burstMs);
    const t2 = window.setTimeout(
      () => fireConfetti(settings.confettiIntensity),
      burstMs + 900,
    );

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const exitMs =
      settings.introExitAnimation === "none" ? 0 : settings.introExitDurationMs;
    const holdMs = Math.max(800, settings.introDurationMs - exitMs);

    introTimer.current = window.setTimeout(() => {
      if (exitMs <= 0) setPhase("main");
      else setPhase("intro-out");
    }, holdMs);

    return () => {
      if (introTimer.current) window.clearTimeout(introTimer.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "intro-out") return;
    const t = window.setTimeout(
      () => setPhase("main"),
      settings.introExitDurationMs,
    );
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "intro") setActive(null);
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rootVars = useMemo(
    () => {
      const avatarPx = resolveAvatarSizePx(settings);
      const gapPx = resolveGridGapPx(settings);
      return {
        "--font-intro-title": resolveFont(
          settings.fontIntroTitle,
          settings.fontIntroTitleCustom,
        ),
        "--font-intro-sub": resolveFont(
          settings.fontIntroSubtitle,
          settings.fontIntroSubtitleCustom,
        ),
        "--font-friends-title": resolveFont(
          settings.fontFriendsTitle,
          settings.fontFriendsTitleCustom,
        ),
        "--font-friends-hint": resolveFont(
          settings.fontFriendsHint,
          settings.fontFriendsHintCustom,
        ),
        "--font-modal-title": resolveFont(
          settings.fontModalTitle,
          settings.fontModalTitleCustom,
        ),
        "--font-modal-note": resolveFont(
          settings.fontModalNote,
          settings.fontModalNoteCustom,
        ),
        "--font-modal-track": resolveFont(
          settings.fontModalTrack,
          settings.fontModalTrackCustom,
        ),
        "--accent": settings.accentColor,
        "--accent-2": settings.accentColor2,
        "--surface": settings.surfaceColor,
        "--text-on-surface": settings.textOnSurface,
        "--avatar-ring": settings.avatarRingColor,
        "--avatar-size": `${avatarPx}px`,
        "--grid-gap": `${gapPx}px`,
        "--overlay-tint": settings.overlayTint,
        "--bg-blur": `${settings.backgroundBlurPx}px`,
        "--vinyl-spin": `${settings.vinylSpinDurationSec}s`,
        "--friends-justify": settings.friendsJustify,
        "--friends-band-max": friendsBandMaxWidth(friends.length, settings),
        "--friends-shape-size": shapeContainerSize(settings),
        "--friends-offset-y": `${settings.friendsOffsetYVh}vh`,
        "--intro-exit-dur": `${settings.introExitDurationMs}ms`,
      } as CSSProperties;
    },
    [],
  );

  const introClass =
    settings.introAnimation === "fade"
      ? "intro-fade"
      : settings.introAnimation === "slide-up"
        ? "intro-slide-up"
        : "intro-fade-scale";

  const bgStyle = useMemo((): CSSProperties | undefined => {
    if (!settings.backgroundImage) return undefined;
    return {
      backgroundImage: `url(${settings.backgroundImage})`,
      backgroundPosition: objectPosition(
        settings.backgroundPositionX,
        settings.backgroundPositionY,
      ),
    };
  }, []);

  const hasBackground = Boolean(settings.backgroundImage);
  const showIntroTitle = hasText(settings.introTitle);
  const showIntroSub = hasText(settings.introSubtitle);
  const showFriendsTitle = hasText(settings.friendsPageTitle);
  const showFriendsHint = hasText(settings.friendsPageHint);

  return (
    <div className="app" style={rootVars}>
      <div
        className={
          "site-backdrop" + (hasBackground ? " site-backdrop--image" : " site-backdrop--fallback")
        }
        style={bgStyle}
        aria-hidden
      />
      <div className="site-overlay" aria-hidden />

      {phase === "intro" || phase === "intro-out" ? (
        <div
          className={[
            "intro-root",
            introClass,
            phase === "intro-out" ? "intro-root--out" : "",
            phase === "intro-out"
              ? `intro-root--out-${settings.introExitAnimation}`
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          role="status"
          aria-live="polite"
        >
          <div className="intro-inner">
            {showIntroTitle ? (
              <h1 className="intro-title">{settings.introTitle.trim()}</h1>
            ) : null}
            {showIntroSub ? (
              <p className="intro-sub">{settings.introSubtitle.trim()}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {phase === "main" ? (
        <main className="page page--enter">
          <div className="page__content">
            {showFriendsTitle ? (
              <h2 className="page__title">{settings.friendsPageTitle.trim()}</h2>
            ) : null}
            {showFriendsHint ? (
              <p className="page__hint">{settings.friendsPageHint.trim()}</p>
            ) : null}
            <FriendsGrid
              friends={friends}
              layout={settings.friendsLayout}
              onSelect={setActive}
              initials={initials}
            />
          </div>
        </main>
      ) : null}

      {phase === "main" && active ? (
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

  const showName =
    friend.showNameInModal !== false && hasText(friend.name);
  const showNote = hasText(friend.note);
  const showSongTitle = hasText(friend.songTitle);
  const showArtist = hasText(friend.songArtist);
  const showTrackMeta = showSongTitle || showArtist;

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
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => setPlaying(false);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnd);
    };
  }, [friend.song]);

  const modalClass =
    modalStyle === "solid" ? "modal modal--solid" : "modal modal--glass";
  const backdropClass =
    "modal-backdrop" + (modalBackdropBlur ? " modal-backdrop--blur" : "");

  const dialogLabel = showName
    ? `friend-title-${friend.slug}`
    : `friend-dialog-${friend.slug}`;

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
        aria-labelledby={dialogLabel}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {showName ? (
          <h3 className="modal__title" id={dialogLabel}>
            {friend.name.trim()}
          </h3>
        ) : (
          <span id={dialogLabel} className="sr-only">
            Message
          </span>
        )}
        {showNote ? <p className="modal__note">{friend.note.trim()}</p> : null}

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
              <span className="vinyl__rotor" aria-hidden>
                <span className="vinyl__label">
                  {friend.discImage ? (
                    <img
                      src={friend.discImage}
                      alt=""
                      style={{
                        objectPosition: objectPosition(
                          friend.discFocusX,
                          friend.discFocusY,
                        ),
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                      {initials(friend.name || friend.slug)}
                    </span>
                  )}
                </span>
              </span>
              <span className="vinyl__hole" aria-hidden />
            </button>
          </div>
          {showTrackMeta ? (
            <div className="track-meta">
              {showSongTitle ? (
                <p className="track-meta__title">{friend.songTitle.trim()}</p>
              ) : null}
              {showArtist ? (
                <p className="track-meta__artist">{friend.songArtist!.trim()}</p>
              ) : null}
            </div>
          ) : null}
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
