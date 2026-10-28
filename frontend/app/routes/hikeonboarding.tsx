import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { Route } from "./+types/hikeonboarding";
import routeMap from "../../images/routemap.png";

function getQueryParam(search: string, key: string, fallback: string) {
  const params = new URLSearchParams(search);
  return params.get(key) ?? fallback;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Start Hike" },
    { name: "description", content: "Prepare to start your hike." },
  ];
}

export default function HikeOnboarding() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDesktopGate, setShowDesktopGate] = useState(false);
  const hikeName = getQueryParam(location.search, "name", "MØNS KLINT");
  const distance = getQueryParam(location.search, "distance", "2.4 km");
  const duration = getQueryParam(location.search, "duration", "0.5-1 h");
  const difficulty = getQueryParam(location.search, "difficulty", "Easy");

  useEffect(() => {
    const handleViewport = () => {
      const isDesktop = window.innerWidth > 768;
      setShowDesktopGate(isDesktop);

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

  return (
    <main className="onboarding-page">
      <div className="onboarding-shell">
        <header className="onboarding-map">
          <img src={routeMap} alt="Route map preview" className="onboarding-map__image" />
          <Link to="/allhikes" className="onboarding-close" aria-label="Close onboarding">
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

        <section className="onboarding-welcome">
          <h2>
            WELCOME TO
            <br />
            YOUR HIKE
          </h2>

          <p>
            Let&apos;s take a quick tour to show you
            <br />
            how the map works and what to
            <br />
            expect along your journey.
          </p>

          <Link className="onboarding-button" to="/activehike">
            Start Hike
          </Link>
        </section>

        <section className="onboarding-location">
          <div className="onboarding-location__icon" aria-hidden="true">
            <span />
          </div>
          <p>
            Allow your Location
            <br />
            Allow location access to track your progress along the trail and receive
            notifications about nearby viewpoints and places of interest.
          </p>
        </section>
      </div>
    </main>
  );
}
