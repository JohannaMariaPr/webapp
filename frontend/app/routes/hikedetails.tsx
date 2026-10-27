import { useParams } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hike Detail" },
    { name: "description", content: "Detailed information about a specific hike." },
  ];
}

export default function HikeDetail() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <h1>Hike Detail: {id}</h1>
      <p>test Welcome to the Hike Detail page!</p>
    </div>
  );
}

