import { useEffect, useState } from "react";
import HikeCard from "../components/HikeCard";
import SearchBar from "../components/SearchBar";

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
  paintings?: Painting[];
  [key: string]: unknown;
}

export default function AllHikes() {
  const [hikes, setHikes] = useState<Hike[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

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

    if (!query) {
      return true;
    }

    const matchesHike =
      hike.title?.toLowerCase().includes(query) ?? false;

    const matchesLocation =
      hike.location?.toLowerCase().includes(query) ?? false;

    const matchesPainting =
      hike.paintings?.some((painting) =>
        painting.title?.toLowerCase().includes(query)
      ) ?? false;

    const matchesArtist =
      hike.paintings?.some((painting) =>
        painting.artist?.toLowerCase().includes(query)
      ) ?? false;

    return (
      matchesHike ||
      matchesLocation ||
      matchesPainting ||
      matchesArtist
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
        Discover hikes, paintings, artists, and locations.
      </p>

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredHikes.map((hike) => (
          <HikeCard key={hike.id} hike={hike} />
        ))}
      </div>

      {filteredHikes.length === 0 && (
        <p className="mt-6">
          No hikes found.
        </p>
      )}
    </main>
  );
}
