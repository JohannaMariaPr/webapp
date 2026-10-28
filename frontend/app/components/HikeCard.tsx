import { Link } from "react-router";
import {
  Image as ImageIcon,
  MapPin,
  Paintbrush,
} from "lucide-react";

interface Review {
  rating: string;
}

interface Hike {
  id: string | number;
  title?: string;
  description_short?: string;
  distance_km?: number;
  duration_min?: number;
  duration_max?: number;
  difficulty?: string;

  reviews?: Review[];
}

interface Painting {
  id: string | number;
  title: string;
  artist?: string;
  picture?: string;
  featured?: boolean;
}

interface HikeCardProps {
  hike: Hike;
  painting: Painting;
  onClose?: () => void;
}

export default function HikeCard({
  hike,
  painting,
  onClose,
}: HikeCardProps) {
  // ----------------------------------------
  // RATING
  // Converts "4/5" → 4
  // ----------------------------------------

  function parseRating(rating: string) {
    const value = Number(rating.split("/")[0]);

    return Number.isNaN(value)
      ? 0
      : value;
  }

  const ratings =
    hike.reviews
      ?.map((review) =>
        parseRating(review.rating)
      )
      .filter((rating) => rating > 0) ?? [];

  const averageRating =
    ratings.length > 0
      ? ratings.reduce(
          (sum, rating) =>
            sum + rating,
          0
        ) / ratings.length
      : 0;

  // ----------------------------------------
  // DURATION
  // ----------------------------------------

  function formatDuration() {
    const min = hike.duration_min;
    const max = hike.duration_max;

    if (min == null) {
      return null;
    }

    if (
      max == null ||
      max === min
    ) {
      if (min < 60) {
        return `${min} min`;
      }

      const hours =
        min / 60;

      return Number.isInteger(hours)
        ? `${hours} h`
        : `${hours.toFixed(1)} h`;
    }

    const minHours =
      min / 60;

    const maxHours =
      max / 60;

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

  const duration =
    formatDuration();

  return (
    <article
      className="
        relative
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

      {/* Top images */}
      <div className="grid grid-cols-2">
        {/* Painting */}
        <div className="aspect-square overflow-hidden bg-[#E8E2DC]">
          {painting.picture ? (
            <img
              src={painting.picture}
              alt={painting.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon size={28} />
            </div>
          )}
        </div>

        {/* Temporary map / route placeholder */}
        <div
          className="
            flex
            aspect-square
            items-center
            justify-center
            bg-[#DCE8D7]
          "
        >
          <MapPin size={30} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div
          className="
            mb-3
            flex
            items-center
            gap-1
            text-[#FFB000]
          "
        >
          {[1, 2, 3, 4, 5].map(
            (star) => (
              <span
                key={star}
                className="text-xl"
              >
                {star <=
                Math.round(
                  averageRating
                )
                  ? "★"
                  : "☆"}
              </span>
            )
          )}
        </div>

        {/* Stats */}
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
            <span>
              {hike.distance_km} km
            </span>
          )}

          {duration && (
            <>
              <span>•</span>

              <span>
                {duration}
              </span>
            </>
          )}

          {hike.difficulty && (
            <>
              <span>•</span>

              <span>
                {hike.difficulty}
              </span>
            </>
          )}
        </div>

        {/* Hike title */}
        <h2
          className="
            mb-2
            text-[clamp(1.6rem,4vw,2rem)]
            font-bold
            uppercase
            leading-none
          "
        >
          {hike.title}
        </h2>

        {/* Short hike description */}
        {hike.description_short && (
          <p
            className="
              mb-3
              text-sm
              leading-snug
            "
          >
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

          <span>
            {painting.title}
          </span>
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

            <span className="underline">
              {painting.artist}
            </span>
          </div>
        )}

        {/* Explore button */}
        <div className="flex justify-end">
          <Link
            to={`/hike/${hike.id}`}
            className="mt-8 rounded-2xl bg-[#D14C18] px-8 py-2.5 text-[clamp(1rem,3.5vw,1.5rem)] font-bold uppercase text-white shadow-sm transition hover:brightness-95 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#879fd0]"
          >
            EXPLORE
          </Link>
        </div>
      </div>
    </article>
  );
}