import { Link, useParams } from "react-router";
import type { Route } from "./+types/hikedetails";
import Slider from "../components/Slider";
import HikeDescription from "../components/hikedescription";

interface HikeRow {
  title: string;
  location: string;
  distance_km: number;
  duration_min: number;
  duration_max: number;
  difficulty: string;
  description_short: string;
  description_long: string;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hike Detail" },
    { name: "description", content: "Detailed information about a specific hike." },
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey || !params.id) {
    throw new Response("Hike details are not configured", { status: 500 });
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/hikes?id=eq.${encodeURIComponent(params.id)}&select=title,location,distance_km,duration_min,duration_max,difficulty,description_short,description_long`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    },
  );

  if (!response.ok) {
    throw new Response("Could not load hike details", { status: response.status });
  }

  const hikes = (await response.json()) as HikeRow[];
  const row = hikes[0];

  if (!row) {
    throw new Response("Hike not found", { status: 404 });
  }

  return {
    name: row.title,
    location: row.location,
    distanceKm: row.distance_km,
    duration: `${row.duration_min}-${row.duration_max} min`,
    difficulty: row.difficulty,
    rating: 0,
    headline: row.description_short,
    description: row.description_long,
  };
}

export default function HikeDetail({ loaderData }: Route.ComponentProps) {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <Slider
        beforeImage="/Sliderimages/before.webp"
        afterImage="/Sliderimages/after.png"
      />
      <HikeDescription hike={loaderData} />

      {/* Passes the hike id along so the reviews page shows (and saves) reviews for this hike */}
      <div className="p-6 text-center">
        <Link
          to={`/reviews?hike=${id}`}
          className="inline-block rounded-xl bg-ink px-5 py-2 text-details font-medium text-background"
        >
          Rate Hike
        </Link>
      </div>
    </div>
  );
}
