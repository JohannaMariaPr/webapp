import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { TouchEvent } from "react";
import type { Route } from "./+types/hikeonboarding";
import step1 from "../../images/step1.png"; // 1 welcome: route map
import mapActive from "../../images/mapActive.png"; // 2 explore the map
import onboarding2 from "../../images/onboarding2.png"; // 3 discover viewpoints
import onboarding3 from "../../images/onboarding3.png"; // 4 hike completed

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

function getQueryParam(search: string, key: string, fallback: string) {
  const params = new URLSearchParams(search);
  // The onboarding page can also be opened directly, so keep the summary usable
  // when a navigation link does not provide every hike detail.
  return params.get(key) ?? fallback;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Start Hike" },
    { name: "description", content: "Prepare to start your hike." },
  ];
}

// step 0 is the welcome screen steps 1-3 are the tour

const steps = [
  {
    image: step1,
    alt: "Trail map preview",
    title: ["WELCOME TO", "YOUR HIKE"],
    text: [
      "Let's take a quick tour to show you",
      "how the map works and what to",
      "expect along your journey.",
    ],
  },
  {
    image: mapActive,
    alt: "Map of the trail with places to visit",
    title: ["EXPLORE", "THE MAP"],
    text: [
      "Pan around to explore the route,",
      "zoom in for details, and see where",
      "the trail takes you.",
    ],
  },
  {
    image: onboarding2,
    alt: "Hike features preview",
    title: ["DISCOVER", "VIEWPOINTS"],
    text: [
      "Get notifications when you",
      "approach scenic viewpoints and",
      "interesting places along the way.",
    ],
  },
  {
    image: onboarding3,
    alt: "Hike completed illustration",
    title: ["FINISH", "YOUR HIKE"],
    text: [
      "Once you reach the end of the",
      'trail, click "Finish Hike" to',
      "complete your journey.",
    ],
  },
];

const LAST_STEP = steps.length - 1;

export default function HikeOnboarding() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDesktopGate, setShowDesktopGate] = useState(false);
  const [step, setStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  // hikes.route_picture of this hike, fetched from Supabase
  const [routePicture, setRoutePicture] = useState<string | null>(null);
  const hikeName = getQueryParam(location.search, "name", "MØNS KLINT");
  const hikeId = new URLSearchParams(location.search).get("id");
  const distance = getQueryParam(location.search, "distance", "2.4 km");
  const duration = getQueryParam(location.search, "duration", "0.5-1 h");
  const difficulty = getQueryParam(location.search, "difficulty", "Easy");

  // "Start hike" leads: the active hike of this hike (needs the id), otherwise All Hikes
  const activeHikePath = hikeId ? `/activehike/${encodeURIComponent(hikeId)}` : "/allhikes";
  const HikeDetailsPath = hikeId ? `/hikedetails/${encodeURIComponent(hikeId)}` : "/allhikes";

  // load the route picture of this hike (the hike id comes in the address: ?id=4)
  useEffect(() => {
    if (!hikeId) return;

    let cancelled = false;

    async function fetchRoutePicture() {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/hikes?id=eq.${encodeURIComponent(hikeId!)}&select=route_picture`,
          { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } },
        );
        if (!response.ok) return;

        const [hike] = (await response.json()) as { route_picture?: string | null }[];
        const picture = hike?.route_picture?.trim();
        if (!cancelled && picture) setRoutePicture(picture);
      } catch {
        // if no route picture: the welcome screen keeps the default picture (step1.png)
      }
    }

    fetchRoutePicture();
    return () => {
      cancelled = true;
    };
  }, [hikeId]);

  useEffect(() => {
    const handleViewport = () => {
      const isDesktop = window.innerWidth > 768;
      setShowDesktopGate(isDesktop);

      // Onboarding is designed for a phone; desktop users continue through the
      // send-to-device flow instead of briefly seeing the mobile layout.
      if (isDesktop) {
        navigate("/sendtodevice", { replace: true });
      }
    };

    handleViewport();
    window.addEventListener("resize", handleViewport);

    return () => window.removeEventListener("resize", handleViewport);
  }, [navigate]);

  if (showDesktopGate) {
    return null;
  }

  const goToStep = (nextStep: number) => {
    // Keep button and swipe navigation inside the available onboarding steps.
    setStep(Math.max(0, Math.min(LAST_STEP, nextStep)));
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    setTouchStart(event.changedTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStart === null) {
      return;
    }

    const distance = (event.changedTouches[0]?.clientX ?? touchStart) - touchStart;
    // Ignore short movements so ordinary taps/scroll gestures do not change
    // slides; the direction is based on the horizontal movement.
    if (Math.abs(distance) >= 50) {
      goToStep(step + (distance < 0 ? 1 : -1));
    }
    setTouchStart(null);
  };

  const current = steps[step];

  // step 1 shows the route of this hike from Supabase 
  const image = step === 0 && routePicture ? routePicture : current.image;

  return (
    <main className="onboarding-page">
      {/* menu button hidden, so the close X is the
          only button there and can be clicked */}
      <style>{".sidebar-menu-button { display: none !important; }"}</style>

      <div
        className="onboarding-shell"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <header className={`onboarding-map onboarding-map--step-${step}`}>
          <img
            src={image}
            alt={step === 0 && routePicture ? `Route of ${hikeName}` : current.alt}
            className="onboarding-map__image"
            // if the file from Supabase does not exist, fall back to the default picture
            onError={() => setRoutePicture(null)}
          />
          <Link
            to={HikeDetailsPath}
            className="onboarding-close"
            aria-label="Close onboarding"
            style={{ zIndex: 60 }}
          >
            ×
          </Link>
        </header>

        <section className="onboarding-summary">
          <p className="onboarding-summary__label">YOU ARE ABOUT TO START:</p>
          <h1 className="onboarding-summary__title">{hikeName}</h1>
          <div className="onboarding-summary__meta">
            <span>{distance}</span>
            <span>•</span>
            <span>{duration}</span>
            <span>•</span>
            <span>{difficulty}</span>
          </div>
        </section>

        <section className="onboarding-step" aria-live="polite">
          {/* step 0 no dots the other three do */}
          {step > 0 && (
            <div className="onboarding-progress" aria-label={`Step ${step} of ${LAST_STEP}`}>
              {[1, 2, 3].map((indicator) => (
                <span key={indicator} className={indicator === step ? "is-active" : ""} />
              ))}
            </div>
          )}

          <h2>
            {current.title[0]}
            <br />
            {current.title[1]}
          </h2>
          <p>
            {current.text.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>

          <div className="onboarding-actions">
            {step === 0 && (
              <button
                type="button"
                className="onboarding-button"
                onClick={() => {
                  // Ask for location permission (see "Allow your Location" below)
                  navigator.geolocation?.getCurrentPosition(
                    () => {},
                    () => {},
                  );
                  goToStep(1);
                }}
              >
                START HIKE
              </button>
            )}

            {step > 0 && step < LAST_STEP && (
              <>
                <button
                  type="button"
                  className="onboarding-button onboarding-button--secondary"
                  onClick={() => goToStep(step - 1)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="onboarding-button"
                  onClick={() => goToStep(step + 1)}
                >
                  Next
                </button>
              </>
            )}

            {step === LAST_STEP && (
              <>
                <button
                  type="button"
                  className="onboarding-button onboarding-button--secondary onboarding-button--wide"
                  onClick={() => goToStep(0)}
                >
                  I&apos;m not ready yet
                </button>
                <Link className="onboarding-button" to={activeHikePath}>
                  Start hike
                </Link>
              </>
            )}
          </div>

          {step === 0 && (
            <div className="mt-8 flex items-start gap-4 text-left">
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[#5c3d2e] text-[#f6efe9]">
                <svg viewBox="0 0 24 24" className="size-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
              </span>
              <div>
                <h3 className="text-sm font-bold">Allow your Location</h3>
                <p className="mt-1 text-xs leading-snug">
                  Allow location access to track your progress along the trail and receive
                  notifications about nearby viewpoints and places of interest.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
