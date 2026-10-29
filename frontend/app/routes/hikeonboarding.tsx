import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { TouchEvent } from "react";
import type { Route } from "./+types/hikeonboarding";
import step1 from "../../images/step1.png";
import onboarding2 from "../../images/onboarding2.png";
import onboarding3 from "../../images/onboarding3.png";

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
  const [step, setStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const hikeName = getQueryParam(location.search, "name", "MØNS KLINT");
  const hikeId = new URLSearchParams(location.search).get("id");
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

  const goToStep = (nextStep: number) => {
    setStep(Math.max(0, Math.min(2, nextStep)));
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    setTouchStart(event.changedTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStart === null) {
      return;
    }

    const distance = (event.changedTouches[0]?.clientX ?? touchStart) - touchStart;
    if (Math.abs(distance) >= 50) {
      goToStep(step + (distance < 0 ? 1 : -1));
    }
    setTouchStart(null);
  };

  return (
    <main className="onboarding-page">
      <div
        className="onboarding-shell"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <header className={`onboarding-map onboarding-map--step-${step}`}>
          <img
            src={step === 0 ? step1 : step === 1 ? onboarding2 : onboarding3}
            alt={
              step === 0
                ? "Trail map preview"
                : step === 1
                ? "Hike features preview"
                : step === 2
                  ? "Hike completed illustration"
                  : "Hike onboarding preview"
            }
            className="onboarding-map__image"
          />
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

        <section className="onboarding-step" aria-live="polite">
          <div className="onboarding-progress" aria-label={`Step ${step + 1} of 3`}>
            {[0, 1, 2].map((indicator) => (
              <span key={indicator} className={indicator === step ? "is-active" : ""} />
            ))}
          </div>

          {step === 0 && (
            <>
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
            </>
          )}

          {step === 1 && (
            <>
              <h2>
                DISCOVER
                <br />
                VIEWPOINTS
              </h2>
              <p>
                Get notifications when you
                <br />
                approach scenic viewpoints and
                <br />
                interesting places along the way.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h2>
                FINISH
                <br />
                YOUR HIKE
              </h2>
              <p>
                Once you reach the end of the
                <br />
                trail, click &quot;Finish Hike&quot; to
                <br />
                complete your journey.
              </p>
            </>
          )}

          <div className="onboarding-actions">
            {step < 2 ? (
              <>
                <button
                  type="button"
                  className="onboarding-button onboarding-button--secondary"
                  onClick={() =>
                    step === 0
                      ? navigate(hikeId ? `/hikedetails/${encodeURIComponent(hikeId)}` : "/allhikes")
                      : goToStep(step - 1)
                  }
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
            ) : (
              <>
                <button
                  type="button"
                  className="onboarding-button onboarding-button--secondary onboarding-button--wide"
                  onClick={() => goToStep(0)}
                >
                  I&apos;m not ready yet
                </button>
                <Link className="onboarding-button" to="/activehike">
                  Start hike
                </Link>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
