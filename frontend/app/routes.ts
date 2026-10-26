import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
  route("allhikes", "routes/allhikes.tsx"),
  route("map", "routes/map.tsx"),
  route("profile", "routes/profile.tsx"),
  route("activehike", "routes/activehike.tsx"),
route("featureview", "routes/featureview.tsx"),
route("hikedetails/:id", "routes/hikedetails.tsx"),
route("hikeonboarding", "routes/hikeonboarding.tsx"),
route("*", "routes/404.tsx"),
] satisfies RouteConfig;