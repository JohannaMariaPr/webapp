import { useParams } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Active Hike" },
    { name: "description", content: "Information about the active hike." },
  ];
}

export default function ActiveHike() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <h1>Active Hike: {id}</h1>
      <p>Welcome to the Active Hike page!</p>
    </div>
  );
}
