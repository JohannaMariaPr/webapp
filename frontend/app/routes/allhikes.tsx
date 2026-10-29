import { useEffect, useState } from "react";
import HikeCard from "../components/HikeCard";
import SearchBar from "~/components/SearchBar";
import DesktopFilters from "../components/filters/DesktopFilters";
import MobileFilters from "../components/filters/MobileFilters";
import ActiveFilterTags from "../components/filters/ActiveFilterTags";
import MobileViewSwitch from "~/components/MobileViewSwitch";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

// Supabase connection values from the environment file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Review data used to calculate the average hike rating, painting and hike data shown inside the card
interface Painting {
  id: string | number;
  title: string;
  artist?: string;
  picture?: string;
  location?: string;
  hike_id?: string | number;
  featured?: boolean;
}

interface Review {
  "Star rating": string;
}

interface Hike {
  id: string | number;
  title?: string;
  location?: string;
  description_short?: string;
  distance_km?: number;
  duration_min?: number;
  duration_max?: number;
  difficulty?: string;
  route_picture?: string;

  paintings?: Painting[];
  Reviews?: Review[];

  [key: string]: unknown;
}

export default function AllHikes() {
  // All hikes fetched from Supabase
  const [hikes, setHikes] = useState<Hike[]>([]);
  // Search input value
  const [search, setSearch] = useState("");
  // Stores an error message if the Supabase request fails
  const [error, setError] = useState<string | null>(null);
  // Active filter values, null means that no filter is selected for that category
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  // FETCH HIKES
  useEffect(() => {
    async function fetchHikes() {
      try {
        // Fetch hikes together with their paintings and review ratings
        const response = await fetch(
          `${supabaseUrl}/rest/v1/hikes?select=*,paintings(*),Reviews("Star rating")`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );

        // Stop if Supabase does not return a successful response
        if (!response.ok) {
          throw new Error(`Failed to fetch hikes: ${response.status}`);
        }

        const data = await response.json();
        // Store the returned hikes in state
        setHikes(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unknown error"
        );
      }
    }

    // Load the hikes once when the page first mounts
    fetchHikes();
  }, []);

  // FILTER HIKES
  // Create the list of hikes that match the current search query and all selected filters
  const filteredHikes = hikes.filter((hike) => {
    const query = search.trim().toLowerCase();

    // SEARCH matches if the search term appears in the hike title, location, painting title or artist name
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
    // Start with true so all hikes are shown when no distance filter is selected
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
    // Compare the selected difficulty with the hike value
    const matchesDifficulty =
      !difficulty ||
      hike.difficulty?.toLowerCase() ===
      difficulty.toLowerCase();

    // Hike has to match search and all active filters
    return (
      Boolean(matchesSearch) &&
      matchesDistance &&
      matchesDuration &&
      matchesDifficulty
    );
  });

  // Show the error message if loading from Supabase failed
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main>
      <Header
        title="Explore all hikes"
        description="Discover every hike, with scenic details and paintings inspired by each trail."
      />

      {/* The header has its own padding, so the rest gets its own side padding here */}
      <div className="px-6 pb-6">

      {/* Desktop filters */}
      <div className="mb-2 hidden md:block">
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

      {/* Grid containing all hikes that match the active filters */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredHikes.map((hike) => {
          // Use the painting marked as featured. If none is featured, fall back to the first painting
          const featuredPainting =
            hike.paintings?.find(
              (painting) => painting.featured
            ) ?? hike.paintings?.[0];

          // A card cannot be displayed without a painting
          if (!featuredPainting) {
            return null;
          }

          return (
            <HikeCard
              key={hike.id}
              hike={hike}
              painting={featuredPainting}
            />
          );
        })}
      </div>

      {/* Message shown when the search or filters return no hikes */}
      {filteredHikes.length === 0 && (
        <p className="mt-6">
          No hikes found.
        </p>
      )}

      {/* Mobile button for switching from card view to map view */}
      <MobileViewSwitch target="map" />
      </div>

      <Footer />
    </main>
  );
}
