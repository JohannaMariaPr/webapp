import { useEffect, useState } from "react";
import HikeCard from "~/components/HikeCard";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const DEMO_ACCOUNT_ID = 1;

interface Review {
  "Star rating": string;
}

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
  const [savedRows, setSavedRows] = useState<SavedHikeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSavedHikes() {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/saved_hikes?account_id=eq.${DEMO_ACCOUNT_ID}&select=id,account_id,hike_id,hikes(*,paintings(*),Reviews("Star rating"))`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();

          throw new Error(
            `Could not load saved hikes: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();

        setSavedRows(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load saved hikes"
        );
      } finally {
        setLoading(false);
      }
    }

    loadSavedHikes();
  }, []);

  // Same header on every state of the page (loading, error, list)
  const pageHeader = (
    <Header
      title="Saved hikes"
      description="View and manage all the hikes you've saved for your next adventure."
    />
  );

  if (loading) {
    return (
      <main>
        {pageHeader}

        <div className="p-6">
          <p>Loading saved hikes...</p>
        </div>

        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main>
        {pageHeader}

        <div className="p-6">
          <p className="text-red-600">
            {error}
          </p>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main>
      {pageHeader}

      {/* The header has its own padding, so the rest keeps the old p-6 here */}
      <div className="p-6">
        {savedRows.length === 0 ? (
          <p>
            You haven't saved any hikes yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savedRows.map((savedRow) => {
              const hike = savedRow.hikes;

              if (!hike) {
                return null;
              }

              const featuredPainting =
                hike.paintings?.find(
                  (painting) => painting.featured
                ) ?? hike.paintings?.[0];

              if (!featuredPainting) {
                return null;
              }

              return (
                <HikeCard
                  key={savedRow.id}
                  hike={hike}
                  painting={featuredPainting}
                  onUnsave={(hikeId) => {
                    setSavedRows((currentRows) =>
                      currentRows.filter(
                        (row) =>
                          String(row.hike_id) !== String(hikeId)
                      )
                    );
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
