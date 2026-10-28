import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/home";
import HeroSlider from "../components/HeroSlider";
import HomeCardSlider from "../components/HomeCardSlider";
import Footer from "../components/Footer";

// Pictures for the "Take a walk inside the painting" section (frontend/images).
// If one turns out to be the wrong picture, swap the file names here.
import walkImage from "../../images/360 home.svg"; // photo + yellow frames + phone with the 360 icon
import SearchBar from "../components/SearchBar";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const MAX_SLIDES = 5;

interface HeroImage {
  src: string;
  alt: string;
}

interface HikeCard {
  id: string | number;
  title: string;
  subtitle?: string;
  image: string;
}

// Each card opens the detail page of its own hike. The detail page loads everything itself
// from the id in the URL (params.id), so the card only has to pass the id.
// Must match the hike detail route in routes.ts, the same path the HikeCard on All Hikes links to.
const hikePath = (id: string | number) => `/hikedetails/${id}`;

interface HikeWithPaintings {
  id: string | number;
  title?: string;
  location?: string;
  hike_picture?: string | string[] | null; // hikes.hike_picture
  paintings?: {
    title?: string;
    picture?: string | string[] | null; // paintings.picture
  }[];
}

// The column may hold one URL or a list of URLs: take the first usable one
function firstUrl(value?: string | string[] | null): string | null {
  const url = Array.isArray(value) ? value[0] : value;
  return typeof url === "string" && url.trim() ? url.trim() : null;
}

// The four ways to give. Icons are small inline SVGs (no extra package needed).
const donationOptions = [
  {
    title: "One-Time Contributions",
    text: "Give once, in any amount, and help bring these stories to life.",
    icon: (
      <>
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
        <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
      </>
    ),
  },
  {
    title: "Friends of the Project",
    text: "Join a community bringing art, nature, and the stories behind our landscapes closer together.",
    icon: (
      <>
        <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z" />
        <path d="M12 5 9 8a2.2 2.2 0 0 0 0 3.1c.8.8 2.1.9 3 .1l2.1-1.9a2.8 2.8 0 0 1 3.8 0l3 2.7" />
      </>
    ),
  },
  {
    title: "Founding Patrons",
    text: "Help bring the project to life by supporting our walking routes.",
    icon: (
      <>
        <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" />
        <circle cx="13.5" cy="6.5" r="1" />
        <circle cx="17.5" cy="10.5" r="1" />
        <circle cx="6.5" cy="12.5" r="1" />
        <circle cx="8.5" cy="7.5" r="1" />
      </>
    ),
  },
  {
    title: "Sponsor a Trail",
    text: "Help us tell the story of a landscape that inspired an artist.",
    icon: (
      <>
        <path d="M9 22l1-14h4l1 14z" />
        <path d="M8 8h8M10 4h4v4h-4zM12 2v2M9 22h6" />
      </>
    ),
  },
];

const filters = [
  { label: "Near me", value: "near-me" },
  { label: "Artist", value: "artist" },
  { label: "Commune", value: "commune" },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LYSTTi" },
    {
      name: "description",
      content: "From canvas to countryside, experience Denmark's most picturesque landscapes.",
    },
  ];
}

export default function Home() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [cards, setCards] = useState<HikeCard[]>([]);
  const navigate = useNavigate();

  // Hero images from Supabase, in this order: hike picture, then that hike's painting,
  // then the next hike's picture, and so on. Only the first 5 are used.
  useEffect(() => {
    let cancelled = false;

    async function fetchHeroImages() {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/hikes?select=id,title,location,hike_picture,paintings(*)&order=id.asc&limit=10`,
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
        const hikeCards: HikeCard[] = [];

        for (const hike of hikes) {
          const photo = firstUrl(hike.hike_picture);
          if (photo) {
            slides.push({ src: photo, alt: hike.title ?? "Hike" });
            // the same hikes also become the cards below the search bar
            hikeCards.push({
              id: hike.id,
              title: hike.title ?? "Hike",
              subtitle: hike.location,
              image: photo,
            });
          }

          const painting = hike.paintings
            ?.map((p) => ({ url: firstUrl(p.picture), title: p.title }))
            .find((p) => p.url);
          if (painting?.url) {
            slides.push({ src: painting.url, alt: painting.title ?? "Painting" });
          }
        }

        if (!cancelled) {
          setHeroImages(slides.slice(0, MAX_SLIDES));
          setCards(hikeCards);
        }
      } catch (err) {
        console.error(err); // the hero then simply shows no images
      }
    }

    fetchHeroImages();
    return () => {
      cancelled = true;
    };
  }, []);

  // The search bar here is only a doorway: a click (or Enter) opens the Explore page with all hikes.
  // The real searching happens there.
  function goToAllHikes(e?: React.SyntheticEvent) {
    e?.preventDefault();
    navigate("/allhikes");
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

        <form
          onSubmit={goToAllHikes}
          onClick={goToAllHikes}
          className="flex w-full cursor-pointer justify-center"
        >
          <SearchBar value="" onChange={() => {}} />
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

      <HomeCardSlider cards={cards} hrefFor={(card) => hikePath(card.id)} />

      {/* TAKE A WALK INSIDE THE PAINTING */}
      <section className="relative isolate overflow-hidden bg-background text-center text-ink">
        {/* No side padding on the section itself, so the hills below can reach both edges */}
        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 pb-12 pt-10 min-[761px]:pb-16 min-[761px]:pt-14">
          {/* Sub header style: Montserrat Bold, uppercase. 45px on web, smaller on a phone. */}
          <h2 className="text-[clamp(1.5rem,6.5vw,2.8125rem)] font-bold uppercase leading-tight">
            Take a walk inside the painting
          </h2>

          <p className="mt-5 max-w-md text--paragraph leading-snug">
            Step inside the painting with our{" "}
            <strong className="font-bold">360°</strong> experience and explore the
            world beyond the canvas.
          </p>

          <img
            src={walkImage}
            alt="A phone showing a 360° view of a painted landscape, next to a photo of the same place"
            loading="lazy"
            className="my-8 w-full max-w-lg"
          />

          <p className="max-w-md text--paragraph font-semibold leading-snug">
            Discover the landscapes, and perspectives that bring each artwork to life!
          </p>

          {/* Orange = the same one as the "Start Hike" button (#D14C18) */}
          <Link
            to="/allhikes"
            className="mt-8 rounded-2xl bg-[#D14C18] px-8 py-2.5 text-[clamp(1rem,3.5vw,1.5rem)] font-bold uppercase text-white shadow-sm transition hover:brightness-95 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#879fd0]"
          >
            Discover
          </Link>
        </div>
      </section>

      {/* KEEP THE ART ALIVE: donation section */}
      <section className="bg-gradient-to-b from-[#5f3d33] to-[#3d2822] px-6 pb-14 pt-12 text-background">
        <div className="mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="text-center text-[clamp(1.75rem,8vw,2.8125rem)] font-bold uppercase leading-tight">
            Keep the art alive
          </h2>
          <p className="mt-5 max-w-lg text-center text--paragraph leading-snug">
            Every painting begins somewhere. Help us bring those places, their stories, and the
            paths that lead to them closer to everyone.
          </p>

          <ul className="mt-10 flex w-full flex-col gap-8">
            {donationOptions.map((option) => (
              <li key={option.title} className="flex items-start gap-5">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-background text-[#D14C18]">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {option.icon}
                  </svg>
                </span>
                <div>
                  <h3 className="text-[clamp(1.1rem,4.5vw,1.5rem)] font-bold leading-tight">
                    {option.title}
                  </h3>
                  <p className="mt-1 text-[clamp(0.95rem,3.6vw,1.125rem)] leading-snug">
                    {option.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Change "/donate" to your donation page (or a payment link) */}
          <Link
            to="/donate"
            className="mt-8 rounded-2xl bg-[#D14C18] px-8 py-2.5 text-[clamp(1rem,3.5vw,1.5rem)] font-bold uppercase text-white shadow-sm transition hover:brightness-95 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#879fd0]"
          >
            Donate
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
