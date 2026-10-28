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
  const [isOpen, setIsOpen] = useState(false);

  const [distanceOpen, setDistanceOpen] = useState(true);
  const [durationOpen, setDurationOpen] = useState(true);
  const [difficultyOpen, setDifficultyOpen] = useState(true);

  return (
    <div className="md:hidden">
      {/* Filter icon button */}
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
          bg-[#F7F0E9]
          text-[#673C33]
        "
        aria-label="Open filters"
      >
        <SlidersHorizontal size={20} strokeWidth={1.8} />
      </button>

      {/* Mobile filter overlay */}
      {isOpen && (
        <div
          className="
            fixed
            left-0
            right-0
            bottom-0
            top-[130px]
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
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#673C33]">
              Filters
            </h2>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#673C33]"
              aria-label="Close filters"
            >
              <X size={22} strokeWidth={1.8} />
            </button>
          </div>

          {/* Distance */}
          <div className="border-b border-[#704238]/15 py-4">
            <button
              type="button"
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

              {distanceOpen ? (
                <ChevronUp size={18} strokeWidth={1.8} />
              ) : (
                <ChevronDown size={18} strokeWidth={1.8} />
              )}
            </button>

            {distanceOpen && (
              <div className="mt-3">
                <DistanceFilter
                  value={distance}
                  onChange={setDistance}
                />
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="border-b border-[#704238]/15 py-4">
            <button
              type="button"
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

              {durationOpen ? (
                <ChevronUp size={18} strokeWidth={1.8} />
              ) : (
                <ChevronDown size={18} strokeWidth={1.8} />
              )}
            </button>

            {durationOpen && (
              <div className="mt-3">
                <DurationFilter
                  value={duration}
                  onChange={setDuration}
                />
              </div>
            )}
          </div>

          {/* Difficulty */}
          <div className="border-b border-[#704238]/15 py-4">
            <button
              type="button"
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

              {difficultyOpen ? (
                <ChevronUp size={18} strokeWidth={1.8} />
              ) : (
                <ChevronDown size={18} strokeWidth={1.8} />
              )}
            </button>

            {difficultyOpen && (
              <div className="mt-3">
                <DifficultyFilter
                  value={difficulty}
                  onChange={setDifficulty}
                />
              </div>
            )}
          </div>

          {/* View results */}
          <div className="mt-auto flex justify-center pb-[28px] pt-6">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="
                min-w-[150px]
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
              View Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}