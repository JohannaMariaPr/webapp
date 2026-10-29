import { useEffect, useState } from "react";

type Hike = {
  id: string | number;
  title: string;
  location: string;
};

export function meta() {
  return [
    { title: "Saved hikes" },
    { name: "description", content: "Your saved hiking trails." },
  ];
}

export default function Saved() {
  const [hikes, setHikes] = useState<Hike[]>([]);

  useEffect(() => {
    async function loadSavedHikes() {
      const savedIds = JSON.parse(localStorage.getItem("savedHikes") || "[]") as Array<string | number>;
      if (savedIds.length === 0) return;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
      const response = await fetch(
        `${supabaseUrl}/rest/v1/hikes?id=in.(${savedIds.join(",")})&select=id,title,location`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } },
      );

      if (response.ok) setHikes(await response.json());
    }

    loadSavedHikes();
  }, []);

  return (
    <main className="p-6">
      <h1 className="mb-4 text-3xl font-bold">SAVED HIKES</h1>
      {hikes.length === 0 ? (
        <p>Your saved trails will appear here.</p>
      ) : (
        <div className="space-y-3">
          {hikes.map((hike) => (
            <article key={hike.id} className="rounded-lg bg-white p-4 shadow-sm">
              <h2 className="text-xl font-semibold">{hike.title}</h2>
              <p>{hike.location}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
