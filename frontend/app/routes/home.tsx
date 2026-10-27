import type { Route } from "./+types/home";
import { Link } from "react-router";

export default function Home() {
  return (
    
    <main className="font-sans min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-600">
TEST      </h1>

      <p className="mt-4 text-gray-700">
THIS IS A TEST
      </p>

      <nav>
        <ul>
          <li>
            <Link to="/allhikes" className="text-black-600 hover:underline">All Hikes</Link>
          </li>
          <li>
            <Link to="/map" className="text-black-600 hover:underline">Map</Link>
          </li>
          <li>
            <Link to="/profile" className="text-black-600 hover:underline">Profile</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}

