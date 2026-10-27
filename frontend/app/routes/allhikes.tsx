import { useEffect, useState } from "react";
import HikeCard from "../components/HikeCard";

/*I HAVE NO IDEA WHY THE HOOK IS NOT HOOKING BUT IT IS HOOKING TFDYM*/

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const response = await fetch(`${supabaseUrl}/rest/v1/hikes?select=*`, {
  headers: {
    apikey: supabaseKey,
  },

});

interface Hike {
  id: string | number;
  [key: string]: unknown;
}

export default function AllHikes() {
  const [hikes, setHikes] = useState<Hike[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("effect running", { supabaseUrl, hasKey: !!supabaseKey });

    async function fetchHikes() {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/hikes?select=*`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch hikes: ${response.status}`);
        }

        const data = await response.json();
        setHikes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    fetchHikes();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    
    <main className="p-6">
      <h1 className="mb-4 text-3xl font-bold">All Hikes</h1>
      <p>Welcome to the Test Hikes page!</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hikes.map((hike) => (
          <HikeCard key={hike.id} hike={hike} />
        ))}
      </div>
    </main>
  );
  
}