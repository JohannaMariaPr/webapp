
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./pages/Layout";
import Home from "./pages/Home";
import MapPage from "./pages/Map";
import Hikes from "./pages/AllHikes";
import HikeDetail from "./pages/HikeDetail";
import RoutePage from "./pages/Route";
import Profile from "./pages/Profile";

import './App.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "map",
        element: <MapPage />,
      },
      {
        path: "hikes",
        element: <Hikes />,
      },
      {
        path: "hikes/:id",
        element: <HikeDetail />,
      },
      {
        path: "route/:id",
        element: <RoutePage />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}