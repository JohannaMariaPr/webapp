import { useState } from "react";
import { Link } from "react-router";

export type HikeDescriptionData = {
  id: string | number;
  name: string;
  location: string;
  distanceKm: number;
  duration: string;
  difficulty: string;
  rating: number;
  headline: string;
  description: string;
  isSaved: boolean;
  isSaving: boolean;
  onToggleSaved: () => void;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`} style={{ color: "#FFC100", fontSize: "2rem" }}>
      {[1, 2, 3, 4, 5].map((n) => (n <= Math.round(rating) ? "★" : "☆"))}
    </span>
  );
}

function renderDescription(text: string) {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

export function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="36"
      height="39"
      viewBox="0 0 24 26"
      fill={filled ? "#F4D78B" : "#F6EFE9"}
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

export default function HikeDescription({ hike, isSaved,
  isSaving,
  onToggleSaved }: { hike: HikeDescriptionData }) {
  const [saved, setSaved] = useState(() => {
    if (typeof window === "undefined") return false;
    const savedHikes = JSON.parse(localStorage.getItem("savedHikes") || "[]") as Array<string | number>;
    return savedHikes.some((id) => String(id) === String(hike.id));
  });

  function toggleSaved() {
    const savedHikes = JSON.parse(localStorage.getItem("savedHikes") || "[]") as Array<string | number>;
    const nextSaved = saved
      ? savedHikes.filter((id) => String(id) !== String(hike.id))
      : [...savedHikes, hike.id];

    localStorage.setItem("savedHikes", JSON.stringify(nextSaved));
    setSaved(!saved);
  }

  return (
    <section style={{ background: "#f3eee8", color: "#673C33", padding: "1.5rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          {hike.name}
        </h1>
       <button
  type="button"
  onClick={onToggleSaved}
  disabled={isSaving}
  aria-label={
    isSaved ? "Remove saved hike" : "Save hike"
  }
  style={{
    background: "none",
    border: "none",
    color: saved ? "#F4D78B" : "#673C33",
    cursor: "pointer",
    padding: 0,
  }}
>
  <BookmarkIcon filled={isSaved} />
</button>
      </header>

      <p>{hike.distanceKm} km • {hike.duration} • {hike.difficulty}</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Stars rating={hike.rating} />
        <Link
          to={`/reviews?hike=${hike.id}`}
          style={{ color: "inherit", fontWeight: 600, textDecoration: "underline" }}
        >
          Rate this hike
        </Link>
      </div>

      <h2 style={{ fontWeight: "bold", marginBottom: "1rem" }}>{hike.headline}</h2>
      <p style={{ marginTop: 0 }}>{renderDescription(hike.description)}</p>
    </section>
  );
}