import type { CSSProperties } from "react";
import type { Friend, FriendsLayout } from "./types";
import { objectPosition } from "./utils";

const SHAPE_LAYOUTS = new Set<FriendsLayout>(["pentagon-up", "pentagon-down", "ring"]);

export function resolveFriendsLayout(
  layout: FriendsLayout,
  count: number,
): FriendsLayout {
  if (SHAPE_LAYOUTS.has(layout) && count !== 5) return "wrap";
  return layout;
}

function layoutClass(layout: FriendsLayout): string {
  if (SHAPE_LAYOUTS.has(layout)) return "face-grid--shape";
  const map: Record<string, string> = {
    wrap: "face-grid--wrap",
    column: "face-grid--column",
    row: "face-grid--row",
    "single-row": "face-grid--row",
  };
  return map[layout] ?? "face-grid--wrap";
}

function polarSlot(
  index: number,
  total: number,
  radiusPercent: number,
  startAngleDeg: number,
): CSSProperties {
  const angleDeg = startAngleDeg + (360 / total) * index;
  const rad = (angleDeg * Math.PI) / 180;
  return {
    position: "absolute",
    left: `${50 + radiusPercent * Math.cos(rad)}%`,
    top: `${50 + radiusPercent * Math.sin(rad)}%`,
    transform: "translate(-50%, -50%)",
  };
}

function slotStyle(
  layout: FriendsLayout,
  index: number,
  total: number,
): CSSProperties | undefined {
  if (total === 0) return undefined;

  if (layout === "pentagon-up" && total === 5) {
    return polarSlot(index, 5, 40, -90);
  }

  if (layout === "pentagon-down" && total === 5) {
    return polarSlot(index, 5, 40, 90);
  }

  if (layout === "ring") {
    return polarSlot(index, total, 38, -90);
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

  return (
    <div className={`face-grid ${layoutClass(resolved)}`} data-layout={resolved}>
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
