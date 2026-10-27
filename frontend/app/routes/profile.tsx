import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile" },
    { name: "description", content: "User profile information." },
  ];
}

export default function Profile() {
  return (
    <div>
      <h1>Profile TEST</h1>
      <p>Welcome to the Profile page!</p>
    </div>
  );
}