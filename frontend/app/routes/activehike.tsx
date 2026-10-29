import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import type { Route } from "./+types/activehike";

import mapImage from "../../images/mapActive.png";
import restaurantImage from "../../images/restaurant.jpg";
import fossilImage from "../../images/fossil.jpeg";
import viewImage from "../../images/view.jpeg";
import fossilIcon from "../../images/Vectorfosil.svg"; // the fossil pin icon
import loadingBar from "../../images/Loadingbar.svg"; // hiker + progress bar

// picture of map
const MAP_IMAGE = mapImage;

type Kind = "restaurant" | "spotlight" | "fossil";

const places: {
  id: string;
  kind: Kind;
  title: string;
  text: string;
  image: string;
  x: number;
  y: number;
}[] = [
  {
    id: "huno",
    kind: "restaurant",
    title: "Huno x Koral",
    text: "Restaurant\nOpen 6pm Wed...",
    image: restaurantImage,
    x: 29,
    y: 49,
  },
  {
    id: "fossil",
    kind: "fossil",
    title: "Fossil Run",
    text: "Discover fossils from millions of years ago.",
    image: fossilImage,
    x: 49,
    y: 74,
  },
  {
    id: "views",
    kind: "spotlight",
    title: "Scenic Views",
    text: "Pause and enjoy the breathtaking landscape.",
    image: viewImage,
    x: 60,
    y: 64,
  },
];

const filters: { label: string; kind: Kind }[] = [
  { label: "Spotlight Areas", kind: "spotlight" },
  { label: "Restaurants", kind: "restaurant" },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Active Hike" },
    { name: "description", content: "Information about the active hike." },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

  const response = await fetch(
    `${supabaseUrl}/rest/v1/hikes?id=eq.${encodeURIComponent(params.id ?? "")}&select=title,description_short`,
    { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } },
  );
  if (!response.ok) throw new Response("Could not load the hike", { status: response.status });

  const [hike] = (await response.json()) as { title: string; description_short: string }[];
  if (!hike) throw new Response("Hike not found", { status: 404 });
  return hike;
}

// round-cornered icons, drawn inline
function Glyph({ kind, className = "size-6" }: { kind: Kind; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (kind === "restaurant")
    return (
      <svg {...common}>
        <path d="M4 9h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M6 21h9" />
      </svg>
    );
  if (kind === "fossil")
    return (
      <svg {...common}>
        <path d="M9 3c-3 0-4 2.5-3 4.5S7 11 6 13s0 4 3 4M15 3c3 0 4 2.5 3 4.5S17 11 18 13s0 4-3 4M10 21h4" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m21 16-5-5-9 9" />
    </svg>
  );
}

// pin colors
function Pin({ kind }: { kind: Kind }) {
  if (kind === "fossil")
    return <img src={fossilIcon} alt="" className="size-11 drop-shadow-md" draggable={false} />;
  return (
    <span className="relative grid size-11 place-items-center rounded-full rounded-br-none bg-[#7C9DD2] text-white shadow-md [transform:rotate(45deg)]">
      <span className="[transform:rotate(-45deg)]">
        <Glyph kind={kind} />
      </span>
    </span>
  );
}

export default function ActiveHike({ loaderData }: Route.ComponentProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // filter chips are on (none = show every pin)
  const [active, setActive] = useState<Kind[]>([]);

 
  const visible = (kind: Kind) => {
    const group: Kind = kind === "fossil" ? "spotlight" : kind;
    return active.length === 0 || active.includes(group);
  };

  function toggle(kind: Kind) {
    setActive((prev) => (prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind]));
  }

  return (
    <main className="mx-auto w-full max-w-xl bg-background text-ink">
      {/* Title */}
      <header className="px-6 pb-4 pt-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="mb-3 grid size-8 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#879fd0]"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-[clamp(1.75rem,8vw,2.8125rem)] font-bold uppercase leading-tight">
          {loaderData.title}
        </h1>
        <p className="mt-1 max-w-md text-[clamp(1rem,3.8vw,1.3125rem)] leading-snug">
          {loaderData.description_short}
        </p>
      </header>

      {/* map picture with pins on top */}
      <section className="relative h-[34rem] overflow-hidden bg-[#c9e6d8]" aria-label="Map of the trail">
        <img src={MAP_IMAGE} alt="" className="absolute inset-0 size-full object-cover" draggable={false} />

        {/* zoom and compass are a lie cause its a picture */}
        <div className="absolute right-4 top-4 flex flex-col gap-4">
          <div className="grid overflow-hidden rounded-xl bg-white/95 shadow-md">
            <span className="grid size-10 place-items-center text-xl font-bold">+</span>
            <span className="grid size-10 place-items-center border-t border-ink/20 text-xl font-bold">−</span>
          </div>
          <span className="grid size-10 place-items-center rounded-xl bg-white/95 shadow-md" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="m15 9-1.5 4.5L9 15l1.5-4.5z" />
            </svg>
          </span>
        </div>

        {places.map((place) =>
          visible(place.kind) ? (
            <a
              key={place.id}
              href={`#${place.id}`}
              aria-label={place.title}
              className="absolute -translate-x-1/2 -translate-y-full focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#879fd0]"
              style={{ left: `${place.x}%`, top: `${place.y}%` }}
            >
              <Pin kind={place.kind} />
            </a>
          ) : null,
        )}

        {/* filter chips and 360 button */}
        <div className="absolute inset-x-4 bottom-12 flex items-center gap-3">
          {filters.map((f) => (
            <button
              key={f.kind}
              type="button"
              aria-pressed={active.includes(f.kind)}
              onClick={() => toggle(f.kind)}
              className={`rounded-full px-5 py-3 text-details font-semibold shadow-md transition focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#879fd0] ${
                active.includes(f.kind) ? "bg-ink text-background" : "bg-background text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}

          {/* to link the 360 view button */}
          <span className="relative ml-auto grid size-16 place-items-center">
  {/* expanding ring animation-ish */}
  <span
    className="pointer-events-none absolute inset-0 rounded-full bg-[#7C9DD2]/60 motion-safe:animate-ping"
    aria-hidden="true"
  />
  <Link
    to="/View360"
    aria-label="360 view"
    className="relative grid size-16 place-items-center rounded-full bg-background text-base font-bold text-ink shadow-md focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#879fd0]"
  >
    360
  </Link>
</span>
        </div>
      </section>

      {/* bottom sheet - overlaps the map with rounded top corners */}
      <section className="relative -mt-9 rounded-t-[2.5rem] bg-background px-6 pb-4 pt-3">
        <span className="mx-auto block h-1.5 w-12 rounded-full bg-ink/15" aria-hidden="true" />
        <h2 className="mt-6 text-center text-[clamp(1.25rem,5vw,1.5rem)] font-bold uppercase">
          Current location
        </h2>

        <div className="relative mt-6">
          {/* The hiker and the progress bar are one picture */}
          <img
            src={loadingBar}
            alt="About 70% of the trail walked"
            className="block w-full"
            draggable={false}
          />
          <div className="mt-3 flex items-center justify-between text-details">
            <span className="text-mist">You are almost there!</span>
            <span className="font-bold">43 min &nbsp;•&nbsp; 3,2 km</span>
          </div>
        </div>
      </section>

      {/* stops cards at the bottom */}
      <ul className="flex flex-col gap-3 bg-mist/10 px-3 pb-8 pt-3">
        {places.map((place) => (
          <li
            key={place.id}
            id={place.id}
            className="flex items-center gap-4 rounded-3xl bg-[#fffaf5] p-4 shadow-sm"
          >
            <span className="shrink-0">
              <Pin kind={place.kind} />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[clamp(1.25rem,5vw,1.5rem)] font-bold leading-tight">{place.title}</h3>
              <p className="mt-1 whitespace-pre-line text-details leading-snug">{place.text}</p>
            </div>
            <img
              src={place.image}
              alt={place.title}
              loading="lazy"
              className="size-24 shrink-0 rounded-xl bg-mist/40 object-cover"
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
