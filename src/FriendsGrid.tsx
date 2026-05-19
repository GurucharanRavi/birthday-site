import type { CSSProperties } from "react";
import type { Friend, FriendsLayout } from "./types";
import { objectPosition } from "./utils";

const NEEDS_FIVE: FriendsLayout[] = [
  "pentagon-up",
  "pentagon-down",
  "ring",
  "cross",
  "arc",
];

export function resolveFriendsLayout(
  layout: FriendsLayout,
  count: number,
): FriendsLayout {
  if (NEEDS_FIVE.includes(layout) && count !== 5) return "wrap";
  return layout;
}

function layoutClass(layout: FriendsLayout): string {
  const map: Record<FriendsLayout, string> = {
    wrap: "face-grid--wrap",
    column: "face-grid--column",
    row: "face-grid--row",
    "single-row": "face-grid--row",
    "pentagon-up": "face-grid--pentagon-up",
    "pentagon-down": "face-grid--pentagon-down",
    ring: "face-grid--ring",
    cross: "face-grid--cross",
    arc: "face-grid--arc",
  };
  return map[layout] ?? "face-grid--wrap";
}

function slotStyle(layout: FriendsLayout, index: number, total: number): CSSProperties | undefined {
  if (total === 0) return undefined;

  if (layout === "ring") {
    const angle = (360 / total) * index - 90;
    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(-1 * var(--ring-radius))) rotate(${-angle}deg)`,
    };
  }

  if (layout === "arc" && total === 5) {
    const angles = [-60, -30, 0, 30, 60];
    const angle = angles[index] ?? 0;
    return {
      position: "absolute",
      left: "50%",
      bottom: "0",
      transform: `translate(-50%, 0) rotate(${angle}deg) translateY(calc(-1 * var(--arc-radius))) rotate(${-angle}deg)`,
    };
  }

  return undefined;
}

type Props = {
  friends: Friend[];
  layout: FriendsLayout;
  onSelect: (friend: Friend) => void;
  initials: (name: string) => string;
};

export function FriendsGrid({ friends, layout, onSelect, initials }: Props) {
  const resolved = resolveFriendsLayout(layout, friends.length);
  const isPositioned = resolved === "ring" || (resolved === "arc" && friends.length === 5);

  return (
    <div
      className={`face-grid ${layoutClass(resolved)}${isPositioned ? " face-grid--positioned" : ""}`}
    >
      {friends.map((f, i) => (
        <button
          key={f.slug}
          type="button"
          className="face-button"
          style={slotStyle(resolved, i, friends.length)}
          onClick={() => onSelect(f)}
          aria-label={`Open message from ${f.name || f.slug}`}
        >
          {f.photo ? (
            <img
              className="face"
              src={f.photo}
              alt=""
              style={{
                objectPosition: objectPosition(f.photoFocusX, f.photoFocusY),
              }}
            />
          ) : (
            <span className="face-placeholder" aria-hidden>
              {initials(f.name || f.slug)}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
