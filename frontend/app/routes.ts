import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx")

  // All hikes: /allhikes
  route("allhikes", "routes/allhikes.tsx"),
  route("map", "routes/map.tsx"),
  route("profile", "routes/profile.tsx"),
] satisfies RouteConfig;