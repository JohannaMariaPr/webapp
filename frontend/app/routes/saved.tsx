import { useEffect, useState } from "react";
import HikeCard from "~/components/HikeCard";
import SearchBar from "~/components/SearchBar";
import DesktopFilters from "~/components/filters/DesktopFilters";
import MobileFilters from "~/components/filters/MobileFilters";
import ActiveFilterTags from "~/components/filters/ActiveFilterTags";
import { Link } from "react-router";

// Supabase connection values from the env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Temporary demo account used until real authentication is added
const DEMO_ACCOUNT_ID = 1;

// Review data used by HikeCard to calculate ratings
interface Review {
  "Star rating": string;
}

// Painting and hike data used by HikeCard to display the hike and its featured painting
interface Painting {
  id: string | number;
  title: string;
  artist?: string;
  picture?: string;
  featured?: boolean;
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
}

// Represents one row from the saved_hikes table
// The related hike is included through the Supabase relationship
interface SavedHikeRow {
  id: string | number;
  account_id: string | number;
  hike_id: string | number;
  hikes: Hike | null;
}

export function meta() {
  return [
    { title: "Saved hikes" },
    {
      name: "description",
      content: "Your saved hiking trails.",
    },
  ];
}

export default function Saved() {
  // Saved hike rows belonging to the demo account
  const [savedRows, setSavedRows] = useState<SavedHikeRow[]>([]);

  // Search and filter values
  const [search, setSearch] = useState("");
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  // Loading and error states for the Supabase request
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FETCH SAVED HIKES
  useEffect(() => {
    async function loadSavedHikes() {
      try {
        // Fetch saved rows for the demo account
        // The related hike, paintings and review ratings are included in the same Supabase request
        const response = await fetch(
          `${supabaseUrl}/rest/v1/saved_hikes?account_id=eq.${DEMO_ACCOUNT_ID}&select=id,account_id,hike_id,hikes(*,paintings(*),Reviews("Star rating"))`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );

        // Stop if Supabase does not return a successful response
        if (!response.ok) {
          const errorText = await response.text();

          throw new Error(
            `Could not load saved hikes: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();

        // Store the returned saved hike rows in state
        setSavedRows(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load saved hikes"
        );
      } finally {
        // Loading is finished whether the request succeeds or fails
        setLoading(false);
      }
    }

    // Load saved hikes once when the page first mounts
    loadSavedHikes();
  }, []);

  // GET HIKES FFROM SAVED ROWS
  // Extract the actual hike objects from the saved_hikes rows
  // Null values are removed so the result only contains valid hikes
  const savedHikes = savedRows
    .map((row) => row.hikes)
    .filter((hike): hike is Hike => hike !== null);

  // Filter saved hikes
  // same search and filter logic as the All Hikes page, but only to hikes that the user has saved
  const filteredHikes = savedHikes.filter((hike) => {
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
    // Default to true so all hikes are shown when no distance filter is selected
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

      // Use the middle of the estimated duration range to decide which duration category the hike belongs to
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

    return (
      Boolean(matchesSearch) &&
      matchesDistance &&
      matchesDuration &&
      matchesDifficulty
    );
  });

  // LOADING / ERROR STATES
  if (loading) {
    return (
      <main className="p-6">
        <h1 className="mb-4 text-3xl font-bold">
          SAVED HIKES
        </h1>

        <p>Loading saved hikes...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <h1 className="mb-4 text-3xl font-bold">
          SAVED HIKES
        </h1>

        <p className="text-red-600">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main>
      {/* Page heading, filters and search */}
      <div className="p-6">
        <h1 className="mb-2 text-3xl font-bold">
          SAVED HIKES
        </h1>

        <p className="mb-4">
          Your saved hikes are collected here for easy access.
        </p>

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
      </div>
      {/* Empty state shown when the user has not saved any hikes */}
      {savedRows.length === 0 ? (
        <section className="flex flex-col items-center pb-[32vw] text-center md:pb-0">
          <img
            src="/images/empty-saved.png"
            alt=""
            className="mb-6 w-full max-w-90"
          />

          <div className="relative z-10 px-6 md:max-w-140">
            <h2 className="text-[clamp(1.8rem,6vw,2.4rem)] font-bold leading-tight text-[#673C33]">
              You don’t have any saved hikes
            </h2>

            <p className="mx-auto mt-3 max-w-[320px] text-sm leading-relaxed text-[#673C33]">
              Find a hike you love and save it here to plan for your next adventure.
            </p>

            <Link
              to="/allhikes"
              className="
          mt-5
          inline-flex
          items-center
          gap-2
          rounded-full
          bg-[#FFF8F3]
          px-6
          py-3
          text-sm
          font-semibold
          uppercase
          text-[#673C33]
          shadow-sm
          transition
          hover:brightness-95
        "
            >
              EXPLORE HIKES
            </Link>
          </div>

           {/* Decorative mobile landscape.
              Hidden on desktop because the desktop empty state does not need the landscape illustration. */}
          <img
            src="/images/landscape.png"
            alt=""
            className="fixed bottom-0 left-0 w-full md:hidden"
          />
        </section>
      ) : (
        <>
          {/* Hike cards */}
          <div className="mb-6 px-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredHikes.map((hike) => {
              // Use the painting marked as featured. If none is featured, fall back to the first painting.
              const featuredPainting =
                hike.paintings?.find(
                  (painting) => painting.featured
                ) ?? hike.paintings?.[0];

              // A HikeCard cannot be displayed without a painting
              if (!featuredPainting) {
                return null;
              }

              return (
                <HikeCard
                  key={hike.id}
                  hike={hike}
                  painting={featuredPainting}
                  onUnsave={(hikeId) => {
                    // Remove the unsaved hike from local page state immediately so the card disappears without a reload
                    setSavedRows((currentRows) =>
                      currentRows.filter(
                        (row) =>
                          String(row.hike_id) !==
                          String(hikeId)
                      )
                    );
                  }}
                />
              );
            })}
          </div>

          {/* Filters/search returned nothing */}
          {filteredHikes.length === 0 && (
            <p className="mt-6">
              No saved hikes match your search or filters.
            </p>
          )}
        </>
      )}
    </main>
  );
}