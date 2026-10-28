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

type OpenSection = "distance" | "duration" | "difficulty" | null;

export default function MobileFilters({
  distance,
  setDistance,
  duration,
  setDuration,
  difficulty,
  setDifficulty,
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] =
    useState<OpenSection>("distance");

  function toggleSection(section: OpenSection) {
    setOpenSection((current) =>
      current === section ? null : section
    );
  }

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
          bg-[#F6EFE9]
          text-[#673C33]
        "
        aria-label="Open filters"
      >
        <SlidersHorizontal size={20} strokeWidth={1.8} />
      </button>

      {/* Filter overlay */}
      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            overflow-y-auto
            bg-[#F6EFE9]
            px-5
            py-6
          "
        >
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#673C33]">
              Filters
            </h2>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#673C33]"
              aria-label="Close filters"
            >
              <X size={26} strokeWidth={1.8} />
            </button>
          </div>

          {/* Distance */}
          <div className="border-b border-[#704238]/20 py-4">
            <button
              type="button"
              onClick={() => toggleSection("distance")}
              className="
                flex
                w-full
                items-center
                justify-between
                text-left
                text-[#673C33]
              "
            >
              <span className="font-medium">Distance</span>

              {openSection === "distance" ? (
                <ChevronUp size={20} strokeWidth={1.8} />
              ) : (
                <ChevronDown size={20} strokeWidth={1.8} />
              )}
            </button>

            {openSection === "distance" && (
              <div className="mt-4">
                <DistanceFilter
                  value={distance}
                  onChange={setDistance}
                />
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="border-b border-[#704238]/20 py-4">
            <button
              type="button"
              onClick={() => toggleSection("duration")}
              className="
                flex
                w-full
                items-center
                justify-between
                text-left
                text-[#673C33]
              "
            >
              <span className="font-medium">Duration</span>

              {openSection === "duration" ? (
                <ChevronUp size={20} strokeWidth={1.8} />
              ) : (
                <ChevronDown size={20} strokeWidth={1.8} />
              )}
            </button>

            {openSection === "duration" && (
              <div className="mt-4">
                <DurationFilter
                  value={duration}
                  onChange={setDuration}
                />
              </div>
            )}
          </div>

          {/* Difficulty */}
          <div className="border-b border-[#704238]/20 py-4">
            <button
              type="button"
              onClick={() => toggleSection("difficulty")}
              className="
                flex
                w-full
                items-center
                justify-between
                text-left
                text-[#673C33]
              "
            >
              <span className="font-medium">Difficulty</span>

              {openSection === "difficulty" ? (
                <ChevronUp size={20} strokeWidth={1.8} />
              ) : (
                <ChevronDown size={20} strokeWidth={1.8} />
              )}
            </button>

            {openSection === "difficulty" && (
              <div className="mt-4">
                <DifficultyFilter
                  value={difficulty}
                  onChange={setDifficulty}
                />
              </div>
            )}
          </div>

          {/* View results button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="
              mt-10
              w-full
              rounded-full
              bg-[#673C33]
              px-5
              py-3
              font-semibold
              text-white
            "
          >
            View Results
          </button>
        </div>
      )}
    </div>
  );
}