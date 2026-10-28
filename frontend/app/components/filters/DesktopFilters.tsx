import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

import DistanceFilter from "./DistanceFilter";
import DurationFilter from "./DurationFilter";
import DifficultyFilter from "./DifficultyFilter";

interface DesktopFiltersProps {
  distance: string | null;
  setDistance: (value: string | null) => void;

  duration: string | null;
  setDuration: (value: string | null) => void;

  difficulty: string | null;
  setDifficulty: (value: string | null) => void;
}

type OpenFilter = "distance" | "duration" | "difficulty" | null;

export default function DesktopFilters({
  distance,
  setDistance,
  duration,
  setDuration,
  difficulty,
  setDifficulty,
}: DesktopFiltersProps) {
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);

  function toggleFilter(filter: OpenFilter) {
    setOpenFilter((current) =>
      current === filter ? null : filter
    );
  }

  return (
    <div className="relative hidden md:block">
      {/* Filter category buttons */}
      <div className="flex gap-10">
        <button
          type="button"
          onClick={() => toggleFilter("distance")}
          className="flex items-center gap-2 text-[#704238]"
        >
          Distance

          {openFilter === "distance" ? (
            <ChevronUp size={18} strokeWidth={1.8} />
          ) : (
            <ChevronDown size={18} strokeWidth={1.8} />
          )}
        </button>

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

      {/* Distance overlay */}
      {openFilter === "distance" && (
        <div className="absolute left-0 top-8 z-30 w-[320px] border border-[#704238]/20 bg-[#FFFDF9] p-4 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg text-[#704238]">
              Distance
            </h3>

            <button
              type="button"
              onClick={() => setOpenFilter(null)}
              className="text-[#704238]"
              aria-label="Close distance filter"
            >
              <X size={20} strokeWidth={1.8} />
            </button>
          </div>

          <DistanceFilter
            value={distance}
            onChange={setDistance}
          />
        </div>
      )}

      {/* Duration overlay */}
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

          <DurationFilter
            value={duration}
            onChange={setDuration}
          />
        </div>
      )}

      {/* Difficulty overlay */}
      {openFilter === "difficulty" && (
        <div className="absolute left-72 top-8 z-30 w-[260px] border border-[#704238]/20 bg-[#FFFDF9] p-4 shadow-md">
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

          <DifficultyFilter
            value={difficulty}
            onChange={setDifficulty}
          />
        </div>
      )}
    </div>
  );
}