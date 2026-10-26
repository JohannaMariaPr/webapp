import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Map" },
    { name: "description", content: "Explore the map of all hikes." },
  ];
}

export default function Map() {
  return (
    <div>
      <h1>Map</h1>
      <p>Welcome to the Map page!</p>
    </div>
  );
}