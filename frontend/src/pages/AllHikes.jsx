import { useEffect, useState } from "react";
import HikeCard from "../components/HikeCard";

export default function AllHikes() {

    const [hikes, setHikes] = useState([]);
  const [error, setError] = useState(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

  useEffect(() => {
    async function fetchHikes() {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/hikes?select=*`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch hikes");
        }

        const data = await response.json();

        setHikes(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchHikes();
  }, [supabaseUrl, supabaseKey]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>All Hikes</h1>
      <p>Welcome to the All Hikes page!</p>
      {hikes.map((hike) => (
        <HikeCard key={hike.id} hike={hike} />
      ))}
    </div>
  );
}