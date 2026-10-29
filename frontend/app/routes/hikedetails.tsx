import { Link, useNavigate, useParams } from "react-router";
import type { Route } from "./+types/hikedetails";
import { useState } from "react";
import Slider from "../components/Slider";
import HikeDescription from "../components/hikedescription";
import SearchBar from "../components/SearchBar";
import MapPart from "../components/mappart";
import HikeReview from "../components/hikereview";
import ArtistPart from "../components/artistpart";


interface HikeRow {
  title: string;
  location: string;
  distance_km: number;
  duration_min: number;
  duration_max: number;
  difficulty: string;
  description_short: string;
  description_long: string;
  paintings?: PaintingRow[];
}

interface PaintingRow {
  title?: string;
  artist?: string;
  location?: string;
  description?: string;
  artist_description?: string;
  image?: string;
  picture?: string;
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

function StartHikeButton({
  hikeId,
  name,
  distanceKm,
  duration,
  difficulty,
}: {
  hikeId?: string;
  name: string;
  distanceKm: number;
  duration: string;
  difficulty: string;
}) {
  const navigate = useNavigate();

  const handleStartHike = () => {
    const params = new URLSearchParams({
      name,
      distance: `${distanceKm} km`,
      duration,
      difficulty,
    });
    if (hikeId) {
      params.set("id", hikeId);
    }
    const destination =
      window.innerWidth <= 768 ? "/hikeonboarding" : "/sendtodevice";

    navigate(`${destination}?${params.toString()}`);
  };

  return (
    <button
      type="button"
      onClick={handleStartHike}
      className="rounded-full bg-[#D14C18] px-5 py-3 font-semibold text-[white] shadow-sm transition hover:brightness-95"
    >
      Start Hike
    </button>
  );
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey || !params.id) {
    throw new Response("Hike details are not configured", { status: 500 });
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/hikes?id=eq.${encodeURIComponent(params.id)}&select=title,location,distance_km,duration_min,duration_max,difficulty,description_short,description_long,paintings(*)`,
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
  const rating = reviews.length
    ? reviews.reduce((total, review) => {
        return total + Number.parseInt(review["Star rating"], 10);
      }, 0) / reviews.length
    : 0;

  return {
    id: params.id,
    name: row.title,
    location: row.location,
    distanceKm: row.distance_km,
    duration: `${row.duration_min}-${row.duration_max} min`,
    difficulty: row.difficulty,
    rating,
    headline: row.description_short,
    description: row.description_long,
    reviews,
    paintings: row.paintings ?? [],
  };
}

export default function HikeDetail({ loaderData }: Route.ComponentProps) {
  const { id } = useParams<{ id: string }>();
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="min-h-screen bg-background p-8 font-body">
      <header className="flex justify-center p-6">
        <SearchBar value={searchValue} onChange={setSearchValue} />
      </header>

      <Slider
        beforeImage="/Sliderimages/before.webp"
        afterImage="/Sliderimages/after.png"
      />
      <HikeDescription hike={loaderData} />
      <div className="flex flex-wrap justify-center gap-4 p-6">
        <Link
          to="/allhikes"
          className="rounded-full  bg-white px-5 py-3 font-semibold text-[#673C33] shadow-sm transition hover:bg-[#f3eee8]"
        >
          Back to Hikes
        </Link>
        <StartHikeButton
          hikeId={id}
          name={loaderData.name}
          distanceKm={loaderData.distanceKm}
          duration={loaderData.duration}
          difficulty={loaderData.difficulty}
        />
      </div>
       <MapPart />
      <img
      src="/wonders/wonders%20picture.png"
      alt="Wonders along the way"
      className="mx-auto my-6 w-full max-w-xs rounded-lg shadow-lg"
    />
      <HikeReview reviews={loaderData.reviews} hikeId={id} />
      <ArtistPart paintings={loaderData.paintings} />
     <div className="flex justify-center gap-4 p-6">
        <Link
          to="/allhikes"
          className="rounded-full  bg-white px-5 py-3 font-semibold text-[#673C33] shadow-sm transition hover:bg-[#f3eee8]"
        >
          Back to Hikes
        </Link>
        <StartHikeButton
          hikeId={id}
          name={loaderData.name}
          distanceKm={loaderData.distanceKm}
          duration={loaderData.duration}
          difficulty={loaderData.difficulty}
        />
      </div>
    </div>
  );
}
