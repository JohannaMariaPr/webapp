import { useRef } from "react";
import { Link } from "react-router";

type HomeCard = {
  id: string | number;
  title: string;
  subtitle?: string;
  image: string;
};

type HomeCardSliderProps = {
  cards?: HomeCard[];
  hrefFor?: (card: HomeCard) => string;
};

const GAP_PX = 20; // = gap-5

// cards:   [{ id, title, subtitle, image }]
// hrefFor: (card) => the page a card opens
export default function HomeCardSlider({ cards = [], hrefFor }: HomeCardSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Arrow buttons (for mouse users): scroll by one card
  function scrollByCard(direction: number) {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector("[data-card]");
    const step = card
      ? card.getBoundingClientRect().width + GAP_PX
      : track.clientWidth * 0.8;

    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  if (cards.length === 0) return null;

  return (
    // The light olive is the map colour from the design. Put the map pattern in as a
    // background image here if you have one.
    <section aria-label="Hikes" className="relative bg-[#dcd9a9] py-10">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory scroll-pl-6 gap-5 overflow-x-auto px-6 pb-2 [scrollbar-width:none] min-[761px]:scroll-pl-10 min-[761px]:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <Link
            key={card.id}
            to={hrefFor ? hrefFor(card) : "#"}
            data-card
            className="group relative h-[22.5rem] w-[17rem] shrink-0 snap-start overflow-hidden rounded-[1.75rem] bg-ink/60 shadow-md focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#879fd0]"
          >
            <img
              src={card.image}
              alt=""
              loading="lazy"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* dark fade so the white text is readable on any picture */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
              <h3 className="text-2xl font-bold leading-tight">{card.title}</h3>
              {card.subtitle && (
                <p className="mt-2 text-base tracking-wide text-white/90">
                  {card.subtitle}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Arrows only on web: on a phone you just swipe */}
      {cards.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous hikes"
            onClick={() => scrollByCard(-1)}
            className="absolute left-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-[#fffaf5] text-2xl leading-none text-[#704238] shadow-[0_2px_4px_rgba(62,42,34,0.16)] transition hover:bg-white min-[761px]:grid"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next hikes"
            onClick={() => scrollByCard(1)}
            className="absolute right-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-[#fffaf5] text-2xl leading-none text-[#704238] shadow-[0_2px_4px_rgba(62,42,34,0.16)] transition hover:bg-white min-[761px]:grid"
          >
            ›
          </button>
        </>
      )}
    </section>
  );
}
