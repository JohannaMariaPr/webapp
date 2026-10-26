import { Link } from "react-router";

export default function HikeCard({ hike }) {
  return (
    <Link
      to={`/hikedetails/${hike.id}`}
      className="block max-w-[360px] rounded-xl border border-[#ddd] bg-white p-4 text-inherit no-underline"
    >
      

      <div className="flex flex-wrap gap-3 text-[0.9rem]">
        <span>
          <h2 className="mb-2 text-xl font-bold">{hike.title}</h2>
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-gray-700">
        <span>{hike.distance_km} km</span>
        <span>{hike.difficulty}</span>
        
        <span>{hike.duration_max} hours</span>
        </div>
        <h3 className="text-sm font-semibold">{hike.location}</h3>
        <p className="mt-3 text-sm">{hike.description_short}</p>
        <p className="mt-2 text-sm text-gray-600">{hike.description_long}</p>
      </div>
      <div className="mt-2">
      <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        View Details
      </button>
    </div>
    </Link>
  );
}
