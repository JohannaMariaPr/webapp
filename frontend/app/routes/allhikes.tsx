import { useEffect, useState } from "react";
import HikeCard from "../components/HikeCard";
import SearchBar from "../components/SearchBar";
import DesktopFilters from "../components/filters/DesktopFilters";
import MobileFilters from "../components/filters/MobileFilters";
import ActiveFilterTags from "../components/filters/ActiveFilterTags";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

interface Painting {
  id: string | number;
  title?: string;
  artist?: string;
  location?: string;
  hike_id?: string | number;
}

interface Hike {
  id: string | number;
  title?: string;
  location?: string;

  distance_km?: number;
  duration_min?: number;
  duration_max?: number;
  difficulty?: string;

  paintings?: Painting[];

  [key: string]: unknown;
}

export default function AllHikes() {
  const [hikes, setHikes] = useState<Hike[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHikes() {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/hikes?select=*,paintings(*)`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch hikes: ${response.status}`);
        }

        const data = await response.json();
        setHikes(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unknown error"
        );
      }
    }

    fetchHikes();
  }, []);

  const filteredHikes = hikes.filter((hike) => {
    const query = search.trim().toLowerCase();

    // SEARCH
    const matchesSearch =
      !query ||
      hike.title?.toLowerCase().includes(query) ||
      hike.location?.toLowerCase().includes(query) ||
      hike.paintings?.some((painting) =>
        painting.title?.toLowerCase().includes(query)
      ) ||
      hike.paintings?.some((painting) =>
        painting.artist?.toLowerCase().includes(query)
      );

    // DISTANCE
    let matchesDistance = true;

    if (distance) {
      const km = hike.distance_km ?? 0;

      if (distance === "under-2") {
        matchesDistance = km < 2;
      }

      if (distance === "2-5") {
        matchesDistance = km >= 2 && km < 5;
      }

      if (distance === "5-10") {
        matchesDistance = km >= 5 && km < 10;
      }

      if (distance === "10-15") {
        matchesDistance = km >= 10 && km <= 15;
      }

      if (distance === "over-15") {
        matchesDistance = km > 15;
      }
    }

    // DURATION
    let matchesDuration = true;

    if (duration) {
      const min = hike.duration_min ?? 0;
      const max = hike.duration_max ?? min;

      // Use the middle of the estimated duration range
      const averageDuration = (min + max) / 2;

      if (duration === "under-1") {
        matchesDuration = averageDuration < 60;
      }

      if (duration === "1-2") {
        matchesDuration =
          averageDuration >= 60 &&
          averageDuration < 120;
      }

      if (duration === "2-3") {
        matchesDuration =
          averageDuration >= 120 &&
          averageDuration < 180;
      }

      if (duration === "3-4") {
        matchesDuration =
          averageDuration >= 180 &&
          averageDuration <= 240;
      }

      if (duration === "over-4") {
        matchesDuration = averageDuration > 240;
      }
    }

    // DIFFICULTY
    const matchesDifficulty =
      !difficulty ||
      hike.difficulty?.toLowerCase() ===
      difficulty.toLowerCase();

    // HIKE HAS TO MATCH ALL ACTIVE FILTERS
    return (
      Boolean(matchesSearch) &&
      matchesDistance &&
      matchesDuration &&
      matchesDifficulty
    );
  });

  if (error) {
    return <p>{error}</p>;
  }

  return (
  <main className="p-6">
    <h1 className="mb-2 text-3xl font-bold">
      Explore All Hikes
    </h1>

    <p className="mb-4">
      Discover every hike, with scenic details and paintings inspired by each trail.
    </p>

    {/* Desktop filters */}
    <div className="mb-4 hidden md:block">
      <DesktopFilters
        distance={distance}
        setDistance={setDistance}
        duration={duration}
        setDuration={setDuration}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
    </div>

    {/* Desktop search + active filter tags */}
    <div className="hidden md:flex md:items-center md:gap-3">
      <div className="w-full max-w-md">
        <SearchBar
          value={search}
          onChange={setSearch}
        />
      </div>

      <ActiveFilterTags
        distance={distance}
        setDistance={setDistance}
        duration={duration}
        setDuration={setDuration}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
    </div>

    {/* Mobile search + filter button */}
    <div className="flex items-center gap-3 md:hidden">
      <div className="flex-1">
        <SearchBar
          value={search}
          onChange={setSearch}
        />
      </div>

      <MobileFilters
        distance={distance}
        setDistance={setDistance}
        duration={duration}
        setDuration={setDuration}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
    </div>

    {/* Mobile active filter tags */}
    <div className="mt-2 md:hidden">
      <ActiveFilterTags
        distance={distance}
        setDistance={setDistance}
        duration={duration}
        setDuration={setDuration}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
    </div>

    {/* Hike cards */}
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredHikes.map((hike) => (
        <HikeCard key={hike.id} hike={hike} />
      ))}
    </div>

    {/* No results */}
    {filteredHikes.length === 0 && (
      <p className="mt-6">
        No hikes found.
      </p>
    )}
  </main>
  );
}