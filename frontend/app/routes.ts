import { type RouteConfig, index, route } from "@react-router/dev/routes";
import View360 from "./routes/View360";

export default [
    index("routes/home.tsx"),
  route("allhikes", "routes/allhikes.tsx"),
  route("map", "routes/map.tsx"),
  route("saved", "routes/saved.tsx"),
  route("profile", "routes/profile.tsx"),
  route("activehike/:id", "routes/activehike.tsx"),
  route("featureview", "routes/featureview.tsx"),
  route("hikedetails/:id", "routes/hikedetails.tsx"),
  route("hikeonboarding", "routes/hikeonboarding.tsx"),
  route("*", "routes/404.tsx"),
  route("View360", "routes/View360.tsx"),
  route("reviews", "routes/AllReviews.tsx"),
] satisfies RouteConfig;