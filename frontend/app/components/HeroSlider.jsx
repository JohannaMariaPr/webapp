import { useEffect, useState } from "react";

// images:   [{ src: "https://...", alt: "optional description" }, ...]
// interval: milliseconds each image stays on screen
// children: whatever should sit on top of the images (title, text...)
export default function HeroSlider({
  images,
  interval = 5000,
  className = "",
  children,
}) {
  const count = images.length;

  // index === count means "showing the cloned first slide" (see handleTransitionEnd)
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Respect "reduce motion": no automatic sliding for those users
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(query.matches);

    const onChange = (e) => setReduceMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Automatic slide
  useEffect(() => {
    if (count < 2 || paused || reduceMotion) return;

    const id = setInterval(() => {
      setAnimate(true);
      setIndex((i) => Math.min(i + 1, count));
    }, interval);

    return () => clearInterval(id);
  }, [count, interval, paused, reduceMotion]);

  // After sliding onto the clone of the first image, jump back to the real first
  // image without animation, so the slider loops forward forever.
  function handleTransitionEnd(e) {
    if (e.target !== e.currentTarget) return;
    if (index === count) {
      setAnimate(false);
      setIndex(0);
    }
  }

  // Turn the animation back on right after that silent jump
  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimate(true))
    );
    return () => cancelAnimationFrame(id);
  }, [animate]);

  const slides = count > 0 ? [...images, images[0]] : [];
  const activeDot = count > 0 ? index % count : 0;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured hikes and paintings"
      // bg-mist is the muted brown from app.css, shown until the images have loaded
      className={`relative overflow-hidden bg-mist/40 ${className}`}
      // Pause while a mouse is over it or a keyboard user is focused inside it
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className={`flex h-full ${
          animate && !reduceMotion
            ? "transition-transform duration-700 ease-in-out"
            : ""
        }`}
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
        aria-live={paused ? "polite" : "off"}
      >
        {slides.map((image, i) => (
          <img
            key={i}
            src={image.src}
            alt={image.alt ?? ""}
            aria-hidden={i === count}
            draggable={false}
            className="h-full w-full shrink-0 object-cover"
          />
        ))}
      </div>

      {/* Soft dark fade so the white text stays readable on bright images */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      <div className="absolute inset-0">{children}</div>

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show image ${i + 1}`}
              aria-current={i === activeDot}
              onClick={() => {
                setAnimate(true);
                setIndex(i);
              }}
              // same focus ring as the rest of the site (outline #879fd0 in app.css)
              className={`size-2.5 rounded-full border border-white/70 transition focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#879fd0] ${
                i === activeDot ? "bg-white" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
