import { Link } from "react-router";
import {
  Image as ImageIcon,
  MapPin,
  Paintbrush
} from "lucide-react";

import useSavedHike from "~/hooks/useSavedHike";
import { BookmarkIcon } from "./hikedescription";

// Review data used to calculate the average hike rating, painting and hike data shown inside the card
interface Review {
  "Star rating": string;
}

interface Painting {
  id: string | number;
  title: string;
  artist?: string;
  picture?: string;
  featured?: boolean;
}

interface Hike {
  id: string | number;
  title?: string;
  description_short?: string;
  distance_km?: number;
  duration_min?: number;
  duration_max?: number;
  difficulty?: string;
  route_picture?: string;
  Reviews?: Review[];
}

// Props used by the reusable hike card
// onClose is only used when the card appears as an overlay on the Map
// onUnsave is used on the Saved page so the card disappears immediatel
interface HikeCardProps {
  hike: Hike;
  painting: Painting;
  onClose?: () => void;
  onUnsave?: (hikeId: string | number) => void;
}

export default function HikeCard({
  hike,
  painting,
  onClose, onUnsave
}: HikeCardProps) {
 
  // RATING
  // Convert review values such as "4/5" into the number 4
  function parseRating(rating: string) {
    const value = Number(
      rating.split("/")[0].trim()
    );

    return Number.isNaN(value) ? 0 : value;
  }

  // Convert all valid review ratings into numbers
  const ratings =
    hike.Reviews
      ?.map((review) =>
        parseRating(review["Star rating"])
      )
      .filter((rating) => rating > 0) ?? [];

  // Calculate the average rating for the hike - If there are no reviews, the rating defaults to 0
  const averageRating =
    ratings.length > 0
      ? ratings.reduce(
        (sum, rating) => sum + rating,
        0
      ) / ratings.length
      : 0;

  // DURATION
  // Format the duration stored in minutes into a readable value
  function formatDuration() {
    const min = hike.duration_min;
    const max = hike.duration_max;

    // No duration can be shown if the minimum value is missing
    if (min == null) {
      return null;
    }

    // If only one duration exists, show a single value
    if (max == null || max === min) {
      if (min < 60) {
        return `${min} min`;
      }

      const hours = min / 60;

      return Number.isInteger(hours)
        ? `${hours} h`
        : `${hours.toFixed(1)} h`;
    }

    // Convert the minimum and maximum duration into hours
    const minHours = min / 60;
    const maxHours = max / 60;

    const formattedMin =
      Number.isInteger(minHours)
        ? minHours
        : minHours.toFixed(1);

    const formattedMax =
      Number.isInteger(maxHours)
        ? maxHours
        : maxHours.toFixed(1);

    return `${formattedMin}–${formattedMax} h`;
  }

  const duration = formatDuration();

  // SAVED HIKE
  // Get the current saved state and save/unsave function for this specific hike from the shared custom hook
  const {
    isSaved,
    isLoading,
    toggleSaved,
  } = useSavedHike(hike.id);

  // Toggle the saved state in Supabase
  // If the hike is removed from the Saved page, notify the parent so the card can disappear immediately
  async function handleToggleSaved() {
    const wasSaved = isSaved;

    await toggleSaved();

    if (wasSaved && onUnsave) {
      onUnsave(hike.id);
    }
  }

  return (
    <article
      className="
    relative
    flex
    h-full
    flex-col
    overflow-hidden
    rounded-2xl
    bg-[#FFF8F3]
    text-[#673C33]
    shadow-lg
  "
    >
      {/* Close button - only used on Map */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-3
            top-3
            z-30
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-[#FFF8F3]
            text-xl
            font-semibold
            text-[#673C33]
            shadow-sm
          "
          aria-label="Close hike card"
        >
          ×
        </button>
      )}
      {/* Save button - saves or removes the hike from supabase */}
      <button
        type="button"
        onClick={handleToggleSaved}
        disabled={isLoading}
        aria-label={isSaved ? "Remove saved hike" : "Save hike"}
        className="
    absolute
    left-4
    top-4
    transition
    hover:scale-105
    disabled:opacity-50
  "
      >
        <BookmarkIcon filled={isSaved} />
      </button>
      {/* Top section with painting image and route image */}
      <div className="grid grid-cols-2">
        {/* Painting image */}
        <div className="aspect-square overflow-hidden bg-[#E8E2DC]">
          {painting.picture ? (
            <img
              src={painting.picture}
              alt={painting.title}
              className="h-full w-full object-cover"
            />
          ) : (
            // Show an icon if no painting image exists
            <div className="flex h-full items-center justify-center">
              <ImageIcon size={28} />
            </div>
          )}
        </div>

        {/* Route image */}
        <div className="aspect-square overflow-hidden bg-[#E8E2DC]">
          {hike.route_picture ? (
            <img
              src={hike.route_picture}
              alt={`${hike.title} route`}
              className="h-full w-full object-cover"
            />
          ) : (
            // Show a map-pin icon if no route image exists
            <div className="flex h-full items-center justify-center">
              <MapPin size={30} />
            </div>
          )}
        </div>
      </div>

      {/* Main card content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Average review rating */}
        <div className="mb-3 flex items-center gap-1 text-[#FFB000]">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className="text-xl"
            >
              {star <= Math.round(averageRating)
                ? "★"
                : "☆"}
            </span>
          ))}
        </div>

        {/* Distance / duration / difficulty */}
        <div
          className="
            mb-2
            flex
            flex-wrap
            items-center
            gap-x-3
            gap-y-1
            text-sm
          "
        >
          {hike.distance_km != null && (
            <span>{hike.distance_km} km</span>
          )}

          {duration && (
            <>
              <span>•</span>
              <span>{duration}</span>
            </>
          )}

          {hike.difficulty && (
            <>
              <span>•</span>
              <span>{hike.difficulty}</span>
            </>
          )}
        </div>

        {/* Hike title */}
        <h2
          className="
            mb-2
            text-[clamp(1.5rem,3.8vw,1.8rem)]
            font-bold
            uppercase
            leading-none
          "
        >
          {hike.title}
        </h2>

        {/* Short hike description */}
        {hike.description_short && (
          <p className="mb-3 text-sm leading-snug">
            {hike.description_short}
          </p>
        )}

        {/* Painting title */}
        <div
          className="
            flex
            items-start
            gap-2
            text-sm
            font-semibold
            uppercase
          "
        >
          <Paintbrush
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{painting.title}</span>
        </div>

        {/* Artist */}
        {painting.artist && (
          <div
            className="
              mt-1
              flex
              items-start
              gap-2
              text-sm
            "
          >
            <Paintbrush
              size={18}
              className="mt-0.5 shrink-0"
            />

            {/* Artist pages are not implemented yet, so this currently links to 404 */}
            <Link to={`/404/`} className="underline">
              {painting.artist}
            </Link>
          </div>
        )}

        {/* Link to hike detail page */}
        <div className="mt-auto flex justify-end pt-2">
          <Link
            to={`/hikedetails/${hike.id}`}
            className="rounded-full bg-[#D14C18] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
          >
            EXPLORE
          </Link>
        </div>
      </div>
    </article>
  );
}