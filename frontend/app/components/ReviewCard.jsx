import { useEffect, useRef, useState } from "react";

function parseStars(rating) {
  // round up
  const n = parseInt(rating ?? "", 10);
  return Number.isNaN(n) ? 0 : Math.max(0, Math.min(5, n));
}

export default function ReviewCard({ review }) {
  const stars = parseStars(review["Star rating"]);

  const textRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  // show more button only if the text is actually cut off
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    function check() {
      if (!expanded) setCanExpand(el.scrollHeight > el.clientHeight + 1);
    }

    check();
    const observer = new ResizeObserver(check); // re-check when the screen is resized
    observer.observe(el);
    return () => observer.disconnect();
  }, [review, expanded]);

  return (
    // layout: image on the left, text on the right (mobile + desktop)
    <article className="flex items-start gap-4 border-b-2 border-ink py-5 text-left text-ink sm:gap-6">
      {review.Picture && (
        <img
          src={review.Picture}
          alt={review.review_title ?? "Review picture"}
          loading="lazy"
          className="size-24 shrink-0 rounded-2xl object-cover sm:size-40 sm:rounded-[1.75rem]"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <h2 className="text-base font-semibold leading-snug sm:text-paragraph">
            {review.review_title ?? "Untitled review"}
          </h2>

          <p
            className="whitespace-nowrap text-base font-medium leading-snug tracking-widest text-star sm:text-paragraph"
            aria-label={`Rated ${review["Star rating"] ?? "no rating"}`}
          >
            {"★".repeat(stars)}
            <span className="text-mist/40">{"★".repeat(5 - stars)}</span>
          </p>
        </div>

        <p
          ref={textRef}
          className={`mt-2 break-words text-sm font-medium leading-snug sm:text-paragraph ${
            expanded ? "" : "line-clamp-2"
          }`}
        >
          {review["Review description"]}
        </p>

        {(canExpand || expanded) && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-1 text-details font-semibold text-ink underline underline-offset-2 hover:opacity-70"
          >
            {expanded ? "See less" : "See more"}
          </button>
        )}
      </div>
    </article>
  );
}
