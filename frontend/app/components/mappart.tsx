import { useState } from "react";

export default function MapPart() {
  // Track whether the full map is open.
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <section className="grid grid-cols-2 items-center gap-3 p-3 sm:gap-8 sm:p-6">
      {/* Show the map section title and short description. */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-[#673C33]">
          Follow the Trail
        </h1>

        <p className="max-w-[220px] text-sm leading-6 text-[#673C33]">
          Here's an overview of the hiking route and the 
          surrounding landscape.
        </p>

        <button
          className="rounded-full bg-white px-5 py-3 font-semibold text-[#673C33] shadow-sm transition hover:bg-[#f3eee8]"
        >
          See More
        </button>
      </div>

      {/* Open the full map when the preview is clicked. */}
      <button
        type="button"
        onClick={() => setIsMapOpen(true)}
        className="relative cursor-zoom-in rounded-lg text-left"
        aria-label="Open the full hiking map"
      >
        <img
          src="/Mappart/map.png"
          alt="Map of the hiking route"
          className="h-64 w-full rounded-lg object-cover object-center shadow-lg sm:h-80"
        />
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 grid grid-cols-2 rounded-md bg-white/80 px-2 py-1 text-lg font-bold leading-4 text-[#673C33] shadow-sm backdrop-blur-sm"
        >
          <span>↖</span>
          <span>↗</span>
          <span>↙</span>
          <span>↘</span>
        </span>
      </button>

      {/* Show the full map in a popup when it is open. */}
      {isMapOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full hiking map"
          onClick={() => setIsMapOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setIsMapOpen(false)}
            aria-label="Close full hiking map"
            className="absolute right-5 top-5 border-0 bg-transparent px-4 py-2 text-3xl font-bold text-[#673C33] shadow-none"
          >
            &times;
          </button>

          //Map image that can be clicked to close the popup, but clicking on the image itself does not close it.

          <img
            src="/Mappart/map.png"
            alt="Full hiking route map"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] max-w-full object-contain shadow-2xl"
          />
        </div>
      )}

    </section>

  );
}
