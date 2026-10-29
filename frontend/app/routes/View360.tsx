import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";

const panoramas = [
  "/360panoramas/Monsklint.png",
];

function Icon360() {
  return (
    <svg width="110" height="90" viewBox="0 0 110 90" fill="none" stroke="#5a2e1f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <text x="55" y="38" textAnchor="middle" fontSize="40" fontFamily="Montserrat, sans-serif" fontWeight="300" fill="#5a2e1f" stroke="none">360</text>
      <ellipse cx="55" cy="62" rx="40" ry="11" />
      <path d="M80 70 L92 62 L80 54" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="36" height="30" viewBox="0 0 36 30" fill="white" aria-hidden="true">
      {direction === "left" ? (
        <path d="M2 15 L16 2 V9 H34 V21 H16 V28 Z" />
      ) : (
        <path d="M34 15 L20 2 V9 H2 V21 H20 V28 Z" />
      )}
    </svg>
  );
}

function RotatePhoneIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="4" width="14" height="24" rx="2" />
      <path d="M20 14 H32 A2 2 0 0 1 34 16 V34 H16" />
      <path d="M13 31 L16 34 L13 37" />
    </svg>
  );
}

export default function View360() {
  // All hooks live INSIDE the component
  const [showHint, setShowHint] = useState(true);
  const [index, setIndex] = useState(0);
  const [searchParams] = useSearchParams();
  const hikeId = searchParams.get("hike"); // comes from /View360?hike=4

  const prev = () => setIndex((i) => (i - 1 + panoramas.length) % panoramas.length);
  const next = () => setIndex((i) => (i + 1) % panoramas.length);

  return (
    <section
      className="relative h-dvh w-full overflow-hidden"
      onPointerDown={() => setShowHint(false)}
    >
      <ReactPhotoSphereViewer
        key={panoramas[index]}
        src={panoramas[index]}
        height="100%"
        width="100%"
        navbar={false}
      />

      {/* 360 circle disappears when you start moving/ dragging */}
      {showHint && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex h-52 w-52 items-center justify-center rounded-full bg-[#f3eee8]">
            <Icon360 />
          </div>
        </div>
      )}

      {/* back button */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-3 px-4">
        <div className="flex w-full items-center justify-between">
          <button onClick={prev} aria-label="Previous panorama" className="p-2">
            <ArrowIcon direction="left" />
          </button>
          <button
            onClick={() => document.documentElement.requestFullscreen?.()}
            aria-label="Rotate phone"
            className="p-2"
          >
            <RotatePhoneIcon />
          </button>
          <button onClick={next} aria-label="Next panorama" className="p-2">
            <ArrowIcon direction="right" />
          </button>
        </div>

        {/* Back to the active hike it was opened from (or All Hikes if opened directly) */}
        <Link
          to={hikeId ? `/activehike/${hikeId}` : "/allhikes"}
          className="rounded-full bg-[#f3eee8] px-5 py-2 text-sm font-bold uppercase text-[#6b3f2e] shadow-md"
        >
          Back to map
        </Link>
      </div>
    </section>
  );
}
