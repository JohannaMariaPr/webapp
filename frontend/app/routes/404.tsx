import { Link } from "react-router";
import landscape from "../../images/landscape.png";

export function meta() {
  return [
    { title: "Page not found" },
    { name: "description", content: "The trail you're looking for could not be found." },
  ];
}

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-content" aria-labelledby="not-found-title">
        <div className="not-found-copy">
          <h1 id="not-found-title">
            Lost between
            <br />
            Trails &amp; Canvases
          </h1>
          <p className="not-found-lead">
            Looks like this path leads neither
            <br />
            to a scenic hike nor a painting.
          </p>
          <p className="not-found-description">
            Let&apos;s get you back to exploring nature and discovering art.
          </p>
          {/* Use the router link to return home without a full page reload. */}
          <Link className="not-found-home-link" to="/">
            Back to home
          </Link>
        </div>
        {/* Decorative illustration; the page text already communicates the error. */}
        <img
          className="not-found-landscape"
          src={landscape}
          alt=""
          aria-hidden="true"
        />
      </section>
    </main>
  );
}
