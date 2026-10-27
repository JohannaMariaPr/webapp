import { useState } from "react";

export type HikeDescriptionData = {
  name: string;
  location: string;
  distanceKm: number;
  duration: string;
  difficulty: string;
  rating: number;
  headline: string;
  description: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`} style={{ color: "#F4D78B", fontSize: "2rem" }}>
      {[1, 2, 3, 4, 5].map((n) => (n <= Math.round(rating) ? "★" : "☆"))}
    </span>
  );
}

function renderDescription(text: string) {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="48"
      height="52"
      viewBox="0 0 24 26"
      fill={filled ? "#F4D78B" : "none"}
      stroke="#673C33"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 3.5A1.5 1.5 0 0 1 5.5 2h13A1.5 1.5 0 0 1 20 3.5V23l-8-5.5L4 23V3.5Z" />
    </svg>
  );
}

export default function HikeDescription({ hike }: { hike: HikeDescriptionData }) {
  const [saved, setSaved] = useState(false);

  return (
    <section style={{ background: "#f3eee8", color: "#673C33", padding: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h1 style={{ margin: 0 }}>{hike.name}, {hike.location}</h1>
       <button
  onClick={() => setSaved(!saved)}
  aria-pressed={saved}
  aria-label={saved ? "Remove hike from saved hikes" : "Save this hike"}
  style={{
    background: "none",
    border: "none",
    color: saved ? "#your-saved-color" : "#673C33",
    cursor: "pointer",
    padding: 0,
  }}
>
  <BookmarkIcon filled={saved} />
</button>
      </header>

      <p>{hike.distanceKm} km • {hike.duration} • {hike.difficulty}</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Stars rating={hike.rating} />
        <a href="#rate" style={{ color: "inherit", fontWeight: 600 }}>Rate this hike</a>
      </div>

      <h2 style={{ textTransform: "uppercase" }}>{hike.headline}</h2>
      <p>{renderDescription(hike.description)}</p>
    </section>
  );
}