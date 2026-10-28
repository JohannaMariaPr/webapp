import { X } from "lucide-react";

interface ActiveFilterTagsProps {
  distance: string | null;
  setDistance: (value: string | null) => void;

  duration: string | null;
  setDuration: (value: string | null) => void;

  difficulty: string | null;
  setDifficulty: (value: string | null) => void;
}

const distanceLabels: Record<string, string> = {
  "under-2": "< 2 km",
  "2-5": "2-5 km",
  "5-10": "5-10 km",
  "10-15": "10-15 km",
  "over-15": "> 15 km",
};

const durationLabels: Record<string, string> = {
  "under-1": "< 1 h",
  "1-2": "1-2 h",
  "2-3": "2-3 h",
  "3-4": "3-4 h",
  "over-4": "> 4 h",
};

const difficultyLabels: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export default function ActiveFilterTags({
  distance,
  setDistance,
  duration,
  setDuration,
  difficulty,
  setDifficulty,
}: ActiveFilterTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {distance && (
        <button
          type="button"
          onClick={() => setDistance(null)}
          className="
            flex
            items-center
            gap-1
            rounded-full
            bg-[#673C33]
            px-3
            py-1.5
            text-sm
            text-white
          "
        >
          {distanceLabels[distance]}
          <X size={14} strokeWidth={2} />
        </button>
      )}

      {duration && (
        <button
          type="button"
          onClick={() => setDuration(null)}
          className="
            flex
            items-center
            gap-1
            rounded-full
            bg-[#7C9DD2]
            px-3
            py-1.5
            text-sm
            text-white
          "
        >
          {durationLabels[duration]}
          <X size={14} strokeWidth={2} />
        </button>
      )}

      {difficulty && (
        <button
          type="button"
          onClick={() => setDifficulty(null)}
          style={{
            backgroundColor:
              difficulty === "easy"
                ? "#B2AB2B"
                : difficulty === "medium"
                ? "#F4D68C"
                : "#D14C18",
          }}
          className={`
            flex
            items-center
            gap-1
            rounded-full
            px-3
            py-1.5
            text-sm
            ${
              difficulty === "medium"
                ? "text-[#673C33]"
                : "text-white"
            }
          `}
        >
          {difficultyLabels[difficulty]}
          <X size={14} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}