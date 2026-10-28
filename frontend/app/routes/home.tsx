import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/home";
import HeroSlider from "../components/HeroSlider";
import SearchBar from "../components/SearchBar";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const MAX_SLIDES = 5;

interface HeroImage {
  src: string;
  alt: string;
}

interface HikeWithPaintings {
  id: string | number;
  title?: string;
  hike_picture?: string | string[] | null; // hikes.hike_picture
  paintings?: {
    title?: string;
    pictures?: string | string[] | null; // paintings.pictures
  }[];
}

// The column may hold one URL or a list of URLs: take the first usable one
function firstUrl(value?: string | string[] | null): string | null {
  const url = Array.isArray(value) ? value[0] : value;
  return typeof url === "string" && url.trim() ? url.trim() : null;
}

const filters = [
  { label: "Near me", value: "near-me" },
  { label: "Artist", value: "artist" },
  { label: "Commune", value: "commune" },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LYSTT" },
    {
      name: "description",
      content: "From canvas to countryside, experience Denmark's most picturesque landscapes.",
    },
  ];
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const navigate = useNavigate();

  // Hero images from Supabase, in this order: hike picture, then that hike's painting,
  // then the next hike's picture, and so on. Only the first 5 are used.
  useEffect(() => {
    let cancelled = false;

    async function fetchHeroImages() {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/hikes?select=id,title,hike_picture,paintings(*)&order=id.asc&limit=10`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );
        if (!response.ok) throw new Error(`Failed to fetch hero images: ${response.status}`);

        const hikes: HikeWithPaintings[] = await response.json();
        const slides: HeroImage[] = [];

        for (const hike of hikes) {
          const photo = firstUrl(hike.hike_picture);
          if (photo) slides.push({ src: photo, alt: hike.title ?? "Hike" });

          const painting = hike.paintings
            ?.map((p) => ({ url: firstUrl(p.pictures), title: p.title }))
            .find((p) => p.url);
          if (painting?.url) {
            slides.push({ src: painting.url, alt: painting.title ?? "Painting" });
          }
        }

        if (!cancelled) setHeroImages(slides.slice(0, MAX_SLIDES));
      } catch (err) {
        console.error(err); // the hero then simply shows no images
      }
    }

    fetchHeroImages();
    return () => {
      cancelled = true;
    };
  }, []);

  // Enter in the search bar -> Explore page with the search text in the URL
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = search.trim();
    navigate(query ? `/allhikes?q=${encodeURIComponent(query)}` : "/allhikes");
  }

  /*
    Hero sizes
    - Mobile (under 761px): 10% smaller than the original design (height 34rem -> 30.6rem, text and spacing x0.9)
    - Web (761px and up, same breakpoint as the sidebar): 25% smaller (height 42rem -> 31.5rem, text and spacing x0.75)
    The hero is always w-full, so it fills all the space next to the sidebar.
  */
  return (
    <main>
      <HeroSlider
        images={heroImages}
        className="h-[30.6rem] w-full min-[761px]:h-[31.5rem]"
      >
        <div className="flex h-full flex-col items-start justify-center pb-7 min-[761px]:pb-6">
          {/* Sub header style from the design sheet: Montserrat Bold, uppercase */}
          <h1 className="flex flex-col items-start gap-[11px] min-[761px]:gap-[9px]">
            <span className="rounded-r-full bg-background py-2 pl-7 pr-7 text-[clamp(2rem,10.5vw,2.8125rem)] font-bold uppercase leading-tight text-ink shadow-md min-[761px]:py-2.5 min-[761px]:pl-10 min-[761px]:pr-8 min-[761px]:text-subheader">
              Where art
            </span>
            {/* blue = the focus colour already used in app.css (#879fd0) */}
            <span className="rounded-r-full bg-[#879fd0] py-2 pl-11 pr-7 text-[clamp(2rem,10.5vw,2.8125rem)] font-bold uppercase leading-tight text-background shadow-md min-[761px]:py-2.5 min-[761px]:pl-16 min-[761px]:pr-8 min-[761px]:text-subheader">
              Meets
            </span>
            <span className="rounded-r-full bg-background py-2 pl-7 pr-7 text-[clamp(2rem,10.5vw,2.8125rem)] font-bold uppercase leading-tight text-[#b0ab45] shadow-md min-[761px]:py-2.5 min-[761px]:pl-10 min-[761px]:pr-8 min-[761px]:text-subheader">
              Adventure
            </span>
          </h1>

          {/* Paragraph (Home) style: Montserrat SemiBold, 21px x0.9 on mobile, x0.75 on web */}
          <p className="mt-[22px] max-w-72 px-7 text-[1.19rem] font-semibold leading-snug text-white drop-shadow min-[761px]:mt-[18px] min-[761px]:max-w-84 min-[761px]:px-9 min-[761px]:text-[0.985rem]">
            From canvas to country side, experience Denmark's most picturesque
            landscapes.
          </p>
        </div>
      </HeroSlider>

      <section className="flex flex-col items-center gap-6 px-6 py-10 text-center">
        <h2 className="text-2xl font-bold uppercase text-ink sm:text-subheader">
          One trail at a time!
        </h2>

        <form onSubmit={handleSearch} className="flex w-full justify-center">
          <SearchBar value={search} onChange={setSearch} />
        </form>

        {/* Chips use the same pill style as .not-found-home-link in app.css, Details text (14px) */}
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <Link
              key={filter.value}
              to={`/allhikes?filter=${filter.value}`}
              className="rounded-full border border-[#704238]/20 bg-[#fffaf5] px-5 py-2.5 text-details font-bold uppercase text-[#704238] shadow-[0_2px_4px_rgba(62,42,34,0.16)] transition hover:-translate-y-px hover:bg-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#879fd0]"
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
