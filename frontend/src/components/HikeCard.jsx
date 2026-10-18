import { Link } from "react-router-dom";
import styles from "./HikeCard.module.css";

export default function HikeCard({ hike }) {
  return (
    <article className={styles.card}>
      <Link to={`/hikes/${hike.id}`} className={styles.link}>
        <h2>{hike.title}</h2>

        <p>{hike.location}</p>

        <p>{hike.description_short}</p>

        <div className={styles.meta}>
          <span>{hike.distance_km} km</span>
          <span>
            {hike.duration_min}–{hike.duration_max} min
          </span>
          <span>{hike.difficulty}</span>
        </div>
      </Link>
    </article>
  );
}
