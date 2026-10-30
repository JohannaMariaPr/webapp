import { X } from "lucide-react";

// This component does not store the filter state by itself, the current filter values are created in the page that uses this component
// A value of null means that no filter is currently active
// When the user clicks the X on one of the active filter tags, the component calls the matching setter function with null
// and that updates the state in the parent page and removes the filter.
interface ActiveFilterTagsProps {
  distance: string | null;
  setDistance: (value: string | null) => void;

  duration: string | null;
  setDuration: (value: string | null) => void;

  difficulty: string | null;
  setDifficulty: (value: string | null) => void;
}

// Converts the internal distance filter value into readable labels shown to the user
const distanceLabels: Record<string, string> = {
  "under-2": "< 2 km",
  "2-5": "2-5 km",
  "5-10": "5-10 km",
  "10-15": "10-15 km",
  "over-15": "> 15 km",
};

// Converts the internal duration filter values into readable labels shown to the user
const durationLabels: Record<string, string> = {
  "under-1": "< 1 h",
  "1-2": "1-2 h",
  "2-3": "2-3 h",
  "3-4": "3-4 h",
  "over-4": "> 4 h",
};

// Converts the internal difficulty values into labels shown in the active filter tag
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
    // Wrap active filter tags onto a new line if there is not enough space
    <div className="flex flex-wrap gap-2">
      {/* Active distance filter */}
      {distance && (
        <button
          type="button"
          // Remove the active distance filter by changing its value back to null.
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

      {/* Active duration filter */}
      {duration && (
        <button
          type="button"
          // Remove the active duration filter by changing its value back to null.
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

      {/* Active difficulty filter */}
      {difficulty && (
        <button
          type="button"
          // Remove the active difficulty filter by changing its value back to null
          onClick={() => setDifficulty(null)}
          //The tag colour changes depending on the selected difficulty
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