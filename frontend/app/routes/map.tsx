import type { Route } from "./+types/map";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  GeoJSONSource,
  Map as MapLibreMap,
  Marker,
  setWorkerUrl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import ActiveFilterTags from "~/components/filters/ActiveFilterTags";
import MobileFilters from "~/components/filters/MobileFilters";
import DesktopFilters from "~/components/filters/DesktopFilters";
import SearchBar from "~/components/SearchBar";
import MobileViewSwitch from "~/components/MobileViewSwitch";
import HikeCard from "~/components/HikeCard";

// Tells MapLibre which worker file to use & the worker handles map rendering tasks in the background
setWorkerUrl(workerUrl);

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Map" },
    {
      name: "description",
      content: "Explore the map of all hikes.",
    },
  ];
}

// Supabase connection values from the environment file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Painting, review and hike data from supabase
interface Painting {
  id: string | number;
  title: string;
  artist?: string;
  picture?: string;
  pin: string;
  hike_id: string | number;
  latitude: number;
  longitude: number;
  location_verified?: boolean;
  featured?: boolean;
}
interface Review {
  "Star rating": string;
}
interface Hike {
  id: string | number;
  title?: string;
  location?: string;
  description_short?: string;
  distance_km?: number;
  duration_min?: number;
  duration_max?: number;
  difficulty?: string;
  route_picture?: string;
  paintings?: Painting[];
  Reviews?: Review[];

  [key: string]: unknown;
}

export default function MapPage() {
  // Reference to the HTML element where MapLibre renders the map
  const mapContainer = useRef<HTMLDivElement | null>(null);

  // Stores the MapLibre map instance so it can be accessed and cleaned up
  const mapRef = useRef<MapLibreMap | null>(null);

  // All hikes loaded from Supabase
  const [hikes, setHikes] = useState<Hike[]>([]);

  // Search and filter values
  const [search, setSearch] = useState("");
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  // Stores an error message if Supabase loading fails
  const [error, setError] = useState<string | null>(null);

  // Painting selected by clicking a pin on the map
  const [selectedPainting, setSelectedPainting] =
    useState<Painting | null>(null);

  // Finds the hike connected to the selected painting and shows the correct HikeCard in the map overlay
  const selectedHike = selectedPainting
    ? hikes.find(
      (hike) =>
        String(hike.id) ===
        String(selectedPainting.hike_id)
    )
    : undefined;

  // FETCH HIKES & PAINTINGS

  useEffect(() => {
    async function fetchHikes() {
      try {
        // Fetch hikes together with their paintings and review ratings
        const response = await fetch(
          `${supabaseUrl}/rest/v1/hikes?select=*,paintings(*),Reviews("Star rating")`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );

        // Stop and show an error if Supabase does not return a successful response
        if (!response.ok) {
          const errorText = await response.text();

          throw new Error(
            `Failed to fetch hikes: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();

        // Store the fetched hikes in state
        setHikes(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error"
        );
      }
    }

    // Load hike data once when the page first mounts
    fetchHikes();
  }, []);

  // FILTER HIKES
  // Recalculates the visible hikes only when the hike data, search term or filter values change
  const filteredHikes = useMemo(() => {
    return hikes.filter((hike) => {
      const query = search.trim().toLowerCase();

      // SEARCH matches hike title, location, painting title or artist name
      const matchesSearch =
        !query ||
        hike.title?.toLowerCase().includes(query) ||
        hike.location?.toLowerCase().includes(query) ||
        hike.paintings?.some((painting) =>
          painting.title
            ?.toLowerCase()
            .includes(query)
        ) ||
        hike.paintings?.some((painting) =>
          painting.artist
            ?.toLowerCase()
            .includes(query)
        );

      // DISTANCE
      let matchesDistance = true;

      if (distance) {
        const km = hike.distance_km ?? 0;

        if (distance === "under-2") {
          matchesDistance = km < 2;
        }

        if (distance === "2-5") {
          matchesDistance =
            km >= 2 && km < 5;
        }

        if (distance === "5-10") {
          matchesDistance =
            km >= 5 && km < 10;
        }

        if (distance === "10-15") {
          matchesDistance =
            km >= 10 && km <= 15;
        }

        if (distance === "over-15") {
          matchesDistance = km > 15;
        }
      }

      // DURATION
      let matchesDuration = true;

      if (duration) {
        const min = hike.duration_min ?? 0;
        const max = hike.duration_max ?? min;

        // Use average of min and max duration when deciding which duration category the hike belongs to
        const averageDuration =
          (min + max) / 2;

        if (duration === "under-1") {
          matchesDuration =
            averageDuration < 60;
        }

        if (duration === "1-2") {
          matchesDuration =
            averageDuration >= 60 &&
            averageDuration < 120;
        }

        if (duration === "2-3") {
          matchesDuration =
            averageDuration >= 120 &&
            averageDuration < 180;
        }

        if (duration === "3-4") {
          matchesDuration =
            averageDuration >= 180 &&
            averageDuration <= 240;
        }

        if (duration === "over-4") {
          matchesDuration =
            averageDuration > 240;
        }
      }

      // DIFFICULTY
      const matchesDifficulty =
        !difficulty ||
        hike.difficulty?.toLowerCase() ===
        difficulty.toLowerCase();

      return (
        Boolean(matchesSearch) &&
        matchesDistance &&
        matchesDuration &&
        matchesDifficulty
      );
    });
  }, [
    hikes,
    search,
    distance,
    duration,
    difficulty,
  ]);

  // GET PAINTINGS THAT SHOULD APPEAR ON MAP
  // Create final list of painting pins that should be visible, result depends on both the hike filters and the search query
  const filteredPaintings = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return filteredHikes.flatMap((hike) => {
      const paintings =
        hike.paintings ?? [];

      // If there is no search query, show every painting belonging to hikes that passed the active filters
      if (!query) {
        return paintings;
      }

      const hikeMatchesSearch =
        hike.title
          ?.toLowerCase()
          .includes(query) ||
        hike.location
          ?.toLowerCase()
          .includes(query);

      // If the search matches the hike or location, show every painting connected to that hike
      if (hikeMatchesSearch) {
        return paintings;
      }

      // Otherwise only show the exact paintings/artists that match
      return paintings.filter(
        (painting) => {
          const matchesTitle =
            painting.title
              ?.toLowerCase()
              .includes(query);

          const matchesArtist =
            painting.artist
              ?.toLowerCase()
              .includes(query);

          return (
            matchesTitle ||
            matchesArtist
          );
        }
      );
    });
  }, [filteredHikes, search]);

  // CREATE MAP

  useEffect(() => {
    // Do not create the map until the container exists in the DOM
    if (!mapContainer.current) return;

    // Use a slightly different center on mobile, so Denmark is positioned better on smaller screens
    const isMobile =
      window.innerWidth < 768;

    // Create a new MapLibre map instance
    const map = new MapLibreMap({
      container: mapContainer.current,

      style:
        "https://demotiles.maplibre.org/style.json",

      center: isMobile
        ? [11.7, 55.7]
        : [10.9, 55.7],

      zoom: 7,
    });

    // Save the map instance for later access and cleanup
    mapRef.current = map;

    // Store custom HTML markers by painting ID to show/hide them when clustering changes
    const markers = new Map<
      string | number,
      {
        marker: Marker;
        element: HTMLImageElement;
      }
    >();

    map.on("load", () => {

      // Change the default map colours so Denmark uses the app's green brand colour
      map.setPaintProperty(
        "countries-fill",
        "fill-color",
        [
          "match",
          ["get", "ADM0_A3"],

          "DNK",
          "#B3AB2C",

          "#D9D9D9",
        ]
      );

      map.setPaintProperty(
        "countries-fill",
        "fill-opacity",
        [
          "case",
          ["==", ["get", "ADM0_A3"], "DNK"],
          0.63,
          1
        ]
      );

      // Convert the filtered paintings into GeoJSON points, because MapLibre requires GeoJSON data for clustering
      const paintingGeoJSON = {
        type: "FeatureCollection" as const,

        features: filteredPaintings
          .filter(
            (painting) =>
              painting.latitude != null &&
              painting.longitude != null
          )
          .map((painting) => ({
            type: "Feature" as const,

            geometry: {
              type: "Point" as const,

              coordinates: [
                painting.longitude,
                painting.latitude,
              ],
            },

            properties: {
              id: painting.id,
            },
          })),
      };

      // Add the painting points as a clustered GeoJSON source, nearby paintings are grouped together while zoomed out
      map.addSource("paintings", {
        type: "geojson",
        data: paintingGeoJSON,

        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 60,
      });

      // Load the custom cluster-pin graphic before creating the cluster layers
      const clusterPinImage =
        new Image();

      clusterPinImage.onload = () => {
        if (!map.getStyle()) return;

        map.addImage(
          "cluster-pin",
          clusterPinImage
        );

        map.addLayer({
          id: "clusters",
          type: "symbol",
          source: "paintings",

          filter: [
            "has",
            "point_count",
          ],

          layout: {
            "icon-image":
              "cluster-pin",

            "icon-size": 0.8,

            "icon-anchor":
              "bottom",

            "icon-allow-overlap":
              true,
          },
        });

        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "paintings",

          filter: [
            "has",
            "point_count",
          ],

          layout: {
            "text-field":
              "{point_count_abbreviated}",

            "text-size": 20,

            "text-offset": [
              0,
              -2,
            ],

            "text-allow-overlap":
              true,
          },

          paint: {
            "text-color":
              "#FFFFFF",
          },
        });
      };

      clusterPinImage.src =
        "/pins/cluster-pin.png";

      // ----------------------------------------------
      // INVISIBLE UNCLUSTERED POINTS
      // ----------------------------------------------

      map.addLayer({
        id: "unclustered-points",
        type: "circle",
        source: "paintings",

        filter: [
          "!",
          [
            "has",
            "point_count",
          ],
        ],

        paint: {
          "circle-radius": 1,
          "circle-opacity": 0,
        },
      });

      // Create one custom image marker for every filtered painting

      filteredPaintings.forEach(
        (painting) => {
          if (
            painting.latitude == null ||
            painting.longitude == null
          ) {
            return;
          }

          const markerElement =
            document.createElement("img");

          markerElement.src =
            painting.pin;

          markerElement.alt =
            painting.title;

          markerElement.style.width =
            "80px";

          markerElement.style.height =
            "90px";

          markerElement.style.objectFit =
            "contain";

          markerElement.style.cursor =
            "pointer";

          markerElement.style.transition =
            "filter 0.15s ease";

          // Custom markers start hidden, updateMarkers() later decides whether each marker should be visible or hidden inside a cluster
          markerElement.style.display =
            "none";

          // Orange outline used when a painting pin is hovered or pressed
          const activeFilter =
            "drop-shadow(2px 0 0 #D14C18) " +
            "drop-shadow(-2px 0 0 #D14C18) " +
            "drop-shadow(0 2px 0 #D14C18) " +
            "drop-shadow(0 -2px 0 #D14C18)";

          // Save the clicked painting so its hike card can open
          markerElement.addEventListener(
            "mouseenter",
            () => {
              markerElement.style.filter =
                activeFilter;
            }
          );

          markerElement.addEventListener(
            "mouseleave",
            () => {
              markerElement.style.filter =
                "none";
            }
          );

          markerElement.addEventListener(
            "mousedown",
            () => {
              markerElement.style.filter =
                activeFilter;
            }
          );

          markerElement.addEventListener(
            "mouseup",
            () => {
              markerElement.style.filter =
                activeFilter;
            }
          );

          markerElement.addEventListener(
            "click",
            () => {
              setSelectedPainting(
                painting
              );
            }
          );

          const marker =
            new Marker({
              element:
                markerElement,

              anchor:
                "bottom",
            })
              .setLngLat([
                painting.longitude,
                painting.latitude,
              ])
              .addTo(map);

          markers.set(
            painting.id,
            {
              marker,
              element:
                markerElement,
            }
          );
        }
      );

      // Show only custom markers that are not clustered
      // MapLibre handles clustering using the invisible GeoJSON layer, while the visible painting pins are separate HTML markers.
      // This function keeps both systems synchronized.
      function updateMarkers() {
        // Get painting points that are currently not inside a cluster.
        const visibleFeatures =
          map.querySourceFeatures(
            "paintings",
            {
              filter: [
                "!",
                [
                  "has",
                  "point_count",
                ],
              ],
            }
          );

        // Store the IDs of paintings that should currently be visible
        const visibleIds =
          new Set(
            visibleFeatures.map(
              (feature) =>
                String(
                  feature
                    .properties?.id
                )
            )
          );

        // Show only markers whose painting is not currently clustered
        markers.forEach(
          ({ element }, id) => {
            if (
              visibleIds.has(
                String(id)
              )
            ) {
              element.style.display =
                "block";
            } else {
              element.style.display =
                "none";
            }
          }
        );
      }

      // Recheck marker visibility whenever MapLibre renders the map
      map.on(
        "render",
        updateMarkers
      );

      // Clicking a cluster automatically zooms to the level where the paintings inside the cluster begin separating
      map.on(
        "click",
        "clusters",
        async (event) => {
          const features =
            map.queryRenderedFeatures(
              event.point,
              {
                layers: [
                  "clusters",
                ],
              }
            );

          const cluster =
            features[0];

          if (!cluster) return;

          const clusterId =
            cluster.properties
              ?.cluster_id;

          if (
            clusterId == null
          ) {
            return;
          }

          if (
            cluster.geometry
              .type !== "Point"
          ) {
            return;
          }

          const source =
            map.getSource(
              "paintings"
            ) as GeoJSONSource;

          const zoom =
            await source.getClusterExpansionZoom(
              clusterId
            );

          const coordinates =
            cluster.geometry
              .coordinates;

          map.easeTo({
            center: [
              coordinates[0],
              coordinates[1],
            ],

            zoom,
          });
        }
      );

      // ----------------------------------------------
      // CLUSTER CURSOR
      // ----------------------------------------------

      map.on(
        "mouseenter",
        "clusters",
        () => {
          map.getCanvas().style.cursor =
            "pointer";
        }
      );

      map.on(
        "mouseleave",
        "clusters",
        () => {
          map.getCanvas().style.cursor =
            "";
        }
      );

      updateMarkers();
    });

    return () => {
      // Remove all custom HTML markers when the map is recreated or when the user leaves the page
      markers.forEach(
        ({ marker }) => {
          marker.remove();
        }
      );

      // Destroy the MapLibre instance to prevent memory leaks
      map.remove();

      mapRef.current = null;
    };
  }, [filteredPaintings]);

  // PAGE
  return (
    <main className="flex h-screen flex-col overflow-hidden">
      {/* Page heading, search and filters */}
      <div className="px-6 pt-6">
        <h1 className="mb-2 text-3xl font-bold">
          MAP
        </h1>

        <p className="mb-3.5">
          Explore the map, select a location, and discover paintings inspired by its landscape.
        </p>

        {error && (
          <p className="mb-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Desktop filters */}
        <div className="mb-2 hidden md:block">
          <DesktopFilters
            distance={distance}
            setDistance={setDistance}
            duration={duration}
            setDuration={setDuration}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
        </div>

        {/* Desktop search + active filter tags */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <div className="w-full max-w-md">
            <SearchBar
              value={search}
              onChange={setSearch}
            />
          </div>

          <ActiveFilterTags
            distance={distance}
            setDistance={setDistance}
            duration={duration}
            setDuration={setDuration}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
        </div>

        {/* Mobile search + filter button */}
        <div className="flex items-center gap-3 md:hidden">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
            />
          </div>

          <MobileFilters
            distance={distance}
            setDistance={setDistance}
            duration={duration}
            setDuration={setDuration}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
        </div>

        {/* Mobile active filter tags */}
        <div className="mt-2 md:hidden">
          <ActiveFilterTags
            distance={distance}
            setDistance={setDistance}
            duration={duration}
            setDuration={setDuration}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
        </div>
      </div>

      {/* Map */}
      <div className="relative mt-2 min-h-0 flex-1">
        <div
          ref={mapContainer}
          className="h-full w-full overflow-hidden"
        />
      </div>

      {/* Hike card overlay */}
      {selectedPainting && selectedHike && (
        <div
          className="
      absolute
      inset-0
      z-20
      flex
      items-center
      justify-center
      bg-black/20
      p-4
    "
          onClick={() =>
            setSelectedPainting(null)
          }
        >
          <div
            className="w-full max-w-105"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <HikeCard
              hike={selectedHike}
              painting={selectedPainting}
              onClose={() =>
                setSelectedPainting(null)
              }
            />
          </div>
        </div>
      )}
      <MobileViewSwitch target="cards" />
    </main>
  );
}