import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import DistanceFilter from "./DistanceFilter";
import DurationFilter from "./DurationFilter";
import DifficultyFilter from "./DifficultyFilter";

// This component does not store the filter state by itself, the current filter values are created in the page 
// that uses this component and passed in as props
// A value of null means that no filter is currently active

interface DesktopFiltersProps {
  distance: string | null;
  setDistance: (value: string | null) => void;

  duration: string | null;
  setDuration: (value: string | null) => void;

  difficulty: string | null;
  setDifficulty: (value: string | null) => void;
}

// Defines which filter overlay can currently be open.
// Only one overlay can be open at a time, null when all overlays are closed.
type OpenFilter = "distance" | "duration" | "difficulty" | null;

export default function DesktopFilters({
  distance,
  setDistance,
  duration,
  setDuration,
  difficulty,
  setDifficulty,
}: DesktopFiltersProps) {
  // Local state used only for the desktop filter interface, it controls which filter overlay is currently visible.
  // This is separate from the actual filter values above (e.g., openFilter can be "distance" while distance is still null, 
  // because the user may have opened the distance menu without selecting an option yet)
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);
  // Opens the selected filter.
  // Clicking the same filter again closes it by setting openFilter to null.
  function toggleFilter(filter: OpenFilter) {
    setOpenFilter((current) =>
      current === filter ? null : filter
    );
  }

  return (
    // This component is only visible from the md breakpoint and up.
    // Mobile uses the separate MobileFilters component instead.
    <div className="relative hidden md:block">
      {/* Filter category buttons - Each button opens or closes its matching filter overlay*/}
      <div className="flex gap-10">
        {/* Distance filter button */}
        <button
          type="button"
          onClick={() => toggleFilter("distance")}
          className="flex items-center gap-2 text-[#704238]"
        >
          Distance

          {/* Show an upward arrow while the distance filter is open, else downward arrow. */}
          {openFilter === "distance" ? (
            <ChevronUp size={18} strokeWidth={1.8} />
          ) : (
            <ChevronDown size={18} strokeWidth={1.8} />
          )}
        </button>
        {/* Duration filter button */}
        <button
          type="button"
          onClick={() => toggleFilter("duration")}
          className="flex items-center gap-2 text-[#704238]"
        >
          Duration

          {openFilter === "duration" ? (
            <ChevronUp size={18} strokeWidth={1.8} />
          ) : (
            <ChevronDown size={18} strokeWidth={1.8} />
          )}
        </button>
        
        {/* Difficulty filter button */}
        <button
          type="button"
          onClick={() => toggleFilter("difficulty")}
          className="flex items-center gap-2 text-[#704238]"
        >
          Difficulty

          {openFilter === "difficulty" ? (
            <ChevronUp size={18} strokeWidth={1.8} />
          ) : (
            <ChevronDown size={18} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* Distance overlay - only rendered while openFilter is "distance" */}
      {openFilter === "distance" && (
        <div className="absolute left-0 top-8 z-30 w-[320px] border border-[#704238]/20 bg-[#FFFDF9] p-4 shadow-md">

          {/* Overlay heading and close button */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg text-[#704238]">
              Distance
            </h3>

            <button
              type="button"
              // Close the overlay without changing the selected distance
              onClick={() => setOpenFilter(null)}
              className="text-[#704238]"
              aria-label="Close distance filter"
            >
              <X size={20} strokeWidth={1.8} />
            </button>
          </div>

          {/* Pass currently selected distance and its update function into reusable DistanceFilter component. */}
          <DistanceFilter
            value={distance}
            onChange={setDistance}
          />
        </div>
      )}

      {/* Duration overlay - works the same way as Distance overlay */}
      {openFilter === "duration" && (
        <div className="absolute left-36 top-8 z-30 w-[320px] border border-[#704238]/20 bg-[#FFFDF9] p-4 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg text-[#704238]">
              Duration
            </h3>

            <button
              type="button"
              onClick={() => setOpenFilter(null)}
              className="text-[#704238]"
              aria-label="Close duration filter"
            >
              <X size={20} strokeWidth={1.8} />
            </button>
          </div>

        {/* Pass currently selected duration and its update function into reusable DurationFilter component. */}
          <DurationFilter
            value={duration}
            onChange={setDuration}
          />
        </div>
      )}

      {/* Difficulty overlay - works the same way as Distance and Duration overlays */}
      {openFilter === "difficulty" && (
        <div className="absolute left-72 top-8 z-30 w-65 border border-[#704238]/20 bg-[#FFFDF9] p-4 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg text-[#704238]">
              Difficulty
            </h3>

            <button
              type="button"
              onClick={() => setOpenFilter(null)}
              className="text-[#704238]"
              aria-label="Close difficulty filter"
            >
              <X size={20} strokeWidth={1.8} />
            </button>
          </div>

          {/* Pass currently selected difficulty and its update function into reusable DifficultyFilter component. */}
          <DifficultyFilter
            value={difficulty}
            onChange={setDifficulty}
          />
        </div>
      )}
    </div>
  );
}