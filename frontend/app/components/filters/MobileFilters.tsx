import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
} from "lucide-react";
import DistanceFilter from "./DistanceFilter";
import DurationFilter from "./DurationFilter";
import DifficultyFilter from "./DifficultyFilter";

// This component does not store the filter state by itself, the current filter values are created in the page 
// that uses this component and passed in as props
// A value of null means that no filter is currently active

interface MobileFiltersProps {
  distance: string | null;
  setDistance: (value: string | null) => void;

  duration: string | null;
  setDuration: (value: string | null) => void;

  difficulty: string | null;
  setDifficulty: (value: string | null) => void;
}

export default function MobileFilters({
  distance,
  setDistance,
  duration,
  setDuration,
  difficulty,
  setDifficulty,
}: MobileFiltersProps) {
  // Controls whether the full mobile filter panel is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Controls whether each filter section inside the panel is expanded or collapsed
  const [distanceOpen, setDistanceOpen] = useState(true);
  const [durationOpen, setDurationOpen] = useState(true);
  const [difficultyOpen, setDifficultyOpen] = useState(true);

  return (
    // This component is only shown on mobile
    <div className="md:hidden">
      {/* Button that opens the mobile filter panel */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-[#673C33]
          bg-[#FFFDF9]
          text-[#673C33]
        "
        aria-label="Open filters"
      >
        <SlidersHorizontal size={20} strokeWidth={1.8} />
      </button>

      {/* Only show the filter panel when isOpen is true */}
      {isOpen && (
        <div
          className="
            fixed
            left-0
            right-0
            bottom-0
            top-32.5
            z-50
            flex
            flex-col
            overflow-y-auto
            rounded-t-3xl
            bg-[#F7F0E9]
            px-5
            pt-6
            shadow-[0_-4px_20px_rgba(62,42,34,0.12)]
          "
        >
          {/* Filter overlay header */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#673C33]">
              Filters
            </h2>

            {/* Close the filter overlay */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#673C33]"
              aria-label="Close filters"
            >
              <X size={22} strokeWidth={1.8} />
            </button>
          </div>

          {/* Distance filter section*/}
          <div className="border-b border-[#704238]/15 py-4">
            <button
              type="button"
              // Collapse or open the distance filter section
              onClick={() => setDistanceOpen((open) => !open)}
              className="
                flex
                w-full
                items-center
                justify-between
                text-left
                text-[#673C33]
              "
            >
              <span className="font-medium">
                Distance
              </span>

              {/* Show a different arrow depending on whether the section is open or closed. */}
              {distanceOpen ? (
                <ChevronUp size={18} strokeWidth={1.8} />
              ) : (
                <ChevronDown size={18} strokeWidth={1.8} />
              )}
            </button>

            {/* Only show the distance options when the section is open */}
            {distanceOpen && (
              <div className="mt-3">
                <DistanceFilter
                  value={distance}
                  onChange={setDistance}
                />
              </div>
            )}
          </div>

          {/* Duration filter section */}
          <div className="border-b border-[#704238]/15 py-4">
            <button
              type="button"
              // Collapse or open the duration filter section
              onClick={() => setDurationOpen((open) => !open)}
              className="
                flex
                w-full
                items-center
                justify-between
                text-left
                text-[#673C33]
              "
            >
              <span className="font-medium">
                Duration
              </span>

              {/* Show a different arrow depending on whether the section is open or closed. */}
              {durationOpen ? (
                <ChevronUp size={18} strokeWidth={1.8} />
              ) : (
                <ChevronDown size={18} strokeWidth={1.8} />
              )}
            </button>
            
            {/* Only show the duration options when the section is open */}
            {durationOpen && (
              <div className="mt-3">
                <DurationFilter
                  value={duration}
                  onChange={setDuration}
                />
              </div>
            )}
          </div>

          {/* Difficulty filter section */}
          <div className="border-b border-[#704238]/15 py-4">
            <button
              type="button"
              // Collapse or open the difficulty filter section
              onClick={() => setDifficultyOpen((open) => !open)}
              className="
                flex
                w-full
                items-center
                justify-between
                text-left
                text-[#673C33]
              "
            >
              <span className="font-medium">
                Difficulty
              </span>

              {/* Show a different arrow depending on whether the section is open or closed. */}
              {difficultyOpen ? (
                <ChevronUp size={18} strokeWidth={1.8} />
              ) : (
                <ChevronDown size={18} strokeWidth={1.8} />
              )}
            </button>

            {/* Only show the difficulty options when the section is open */}
            {difficultyOpen && (
              <div className="mt-3">
                <DifficultyFilter
                  value={difficulty}
                  onChange={setDifficulty}
                />
              </div>
            )}
          </div>

          {/* Close the overlay and return to the filtered results */}
          <div className="mt-auto flex justify-center pb-7 pt-6">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="
                min-w-37.5
                rounded-full
                bg-[#FFF8F3]
                px-7
                py-2.5
                text-sm
                font-semibold
                text-[#673C33]
                shadow-sm
              "
            >
              VIEW RESULTS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}