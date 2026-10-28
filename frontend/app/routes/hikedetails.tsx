import { Link, useParams } from "react-router";
import type { Route } from "./+types/hikedetails";
import { useState } from "react";
import Slider from "../components/Slider";
import HikeDescription from "../components/hikedescription";
import SearchBar from "../components/SearchBar";
import MapPart from "../components/mappart";
import HikeReview from "../components/hikereview";

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

interface ReviewRow {
  id: number;
  "Star rating": string;
  review_title: string;
  "Review description": string;
  Picture: string;
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

  const reviewsResponse = await fetch(
    `${supabaseUrl}/rest/v1/Reviews?hike_id=eq.${encodeURIComponent(params.id)}&select=*&order=id.asc`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    },
  );

  if (!reviewsResponse.ok) {
    throw new Response("Could not load hike reviews", { status: reviewsResponse.status });
  }

  const reviews = (await reviewsResponse.json()) as ReviewRow[];

  return {
    name: row.title,
    location: row.location,
    distanceKm: row.distance_km,
    duration: `${row.duration_min}-${row.duration_max} min`,
    difficulty: row.difficulty,
    rating: 0,
    headline: row.description_short,
    description: row.description_long,
    reviews,
  };
}

export default function HikeDetail({ loaderData }: Route.ComponentProps) {
  const { id } = useParams<{ id: string }>();
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="font-sans min-h-screen bg-gray-50 p-8">
      <header className="flex justify-center p-6">
        <SearchBar value={searchValue} onChange={setSearchValue} />
      </header>

      <Slider
        beforeImage="/Sliderimages/before.webp"
        afterImage="/Sliderimages/after.png"
      />
      <HikeDescription hike={loaderData} />
      <div className="flex flex-wrap justify-center gap-4 p-6">
        <button
          className="rounded-full  bg-white px-5 py-3 font-semibold text-[#673C33] shadow-sm transition hover:bg-[#f3eee8]"
        >
          Back to Hikes
        </button>
        <button
          className="rounded-full  bg-[#D14C18] px-5 py-3 font-semibold text-[white] shadow-sm transition hover:brightness-95"
        >
          Start Hike
        </button>
        {/* Passes the hike id along so the reviews page shows (and saves) reviews for this hike */}
        <Link
          to={`/reviews?hike=${id}`}
          className="rounded-full bg-white px-5 py-3 font-semibold text-[#673C33] shadow-sm transition hover:bg-[#f3eee8]"
        >
          Rate Hike
        </Link>
      </div>
       <MapPart />
      <img
      src="/wonders/wonders%20picture.png"
      alt="Wonders along the way"
      className="mx-auto my-6 w-full max-w-3xl rounded-lg shadow-lg"
    />
      <HikeReview reviews={loaderData.reviews} />
     <div className="flex justify-center gap-4 p-6">
        <button
          className="rounded-full  bg-white px-5 py-3 font-semibold text-[#673C33] shadow-sm transition hover:bg-[#f3eee8]"
        >
          Back to Hikes
        </button>
        <button
          className="rounded-full  bg-[#D14C18] px-5 py-3 font-semibold text-[white] shadow-sm transition hover:brightness-95"
        >
          Start Hike
        </button>
      </div>
    </div>
  );
}
