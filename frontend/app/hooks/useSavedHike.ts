import { useEffect, useState } from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const DEMO_ACCOUNT_ID = 1;

export default function useSavedHike(
  hikeId: string | number
) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkSaved() {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/saved_hikes?account_id=eq.${DEMO_ACCOUNT_ID}&hike_id=eq.${hikeId}&select=id`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Could not check saved hike");
        }

        const data = await response.json();

        setIsSaved(data.length > 0);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    checkSaved();
  }, [hikeId]);

  async function toggleSaved() {
    try {
      if (isSaved) {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/saved_hikes?account_id=eq.${DEMO_ACCOUNT_ID}&hike_id=eq.${hikeId}`,
          {
            method: "DELETE",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Could not remove saved hike");
        }

        setIsSaved(false);
      } else {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/saved_hikes`,
          {
            method: "POST",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              account_id: DEMO_ACCOUNT_ID,
              hike_id: hikeId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Could not save hike");
        }

        setIsSaved(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {
    isSaved,
    isLoading,
    toggleSaved,
  };
}