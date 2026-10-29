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
import Header from "~/components/Header";

import HikeCard from "~/components/HikeCard";

setWorkerUrl(workerUrl);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Map" },
    {
      name: "description",
      content: "Explore the map of all hikes.",
    },
  ];
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

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
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  const [hikes, setHikes] = useState<Hike[]>([]);

  const [search, setSearch] = useState("");
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [selectedPainting, setSelectedPainting] =
    useState<Painting | null>(null);

    const selectedHike = selectedPainting
  ? hikes.find(
      (hike) =>
        String(hike.id) ===
        String(selectedPainting.hike_id)
    )
  : undefined;

  // --------------------------------------------------
  // FETCH HIKES + PAINTINGS
  // --------------------------------------------------

  useEffect(() => {
    async function fetchHikes() {
      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/hikes?select=*,paintings(*),Reviews("Star rating")`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();

          throw new Error(
            `Failed to fetch hikes: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();

        setHikes(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error"
        );
      }
    }

    fetchHikes();
  }, []);

  // --------------------------------------------------
  // FILTER HIKES
  // --------------------------------------------------

  const filteredHikes = useMemo(() => {
    return hikes.filter((hike) => {
      const query = search.trim().toLowerCase();

      // SEARCH
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

  // --------------------------------------------------
  // GET PAINTINGS THAT SHOULD APPEAR ON MAP
  // --------------------------------------------------

  const filteredPaintings = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return filteredHikes.flatMap((hike) => {
      const paintings =
        hike.paintings ?? [];

      // No search:
      // show every painting belonging to
      // hikes that passed the filters.
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

      // Search matched hike/location:
      // show all paintings belonging to it.
      if (hikeMatchesSearch) {
        return paintings;
      }

      // Otherwise only show the exact
      // paintings/artists that match.
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

  // --------------------------------------------------
  // CREATE MAP
  // --------------------------------------------------

  useEffect(() => {
    if (!mapContainer.current) return;

    const isMobile =
      window.innerWidth < 768;

    const map = new MapLibreMap({
      container: mapContainer.current,

      style:
        "https://demotiles.maplibre.org/style.json",

      center: isMobile
        ? [11.7, 55.7]
        : [10.9, 55.7],

      zoom: 7,
    });

    mapRef.current = map;

    const markers = new Map<
      string | number,
      {
        marker: Marker;
        element: HTMLImageElement;
      }
    >();

    map.on("load", () => {

      // Custom country colours
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
      // ----------------------------------------------
      // CREATE GEOJSON FROM FILTERED PAINTINGS
      // ----------------------------------------------

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

      // ----------------------------------------------
      // CLUSTER SOURCE
      // ----------------------------------------------

      map.addSource("paintings", {
        type: "geojson",
        data: paintingGeoJSON,

        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 60,
      });

      // ----------------------------------------------
      // CLUSTER PIN IMAGE
      // ----------------------------------------------

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

      // ----------------------------------------------
      // CUSTOM PAINTING MARKERS
      // ----------------------------------------------

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

          markerElement.style.display =
            "none";

          const activeFilter =
            "drop-shadow(2px 0 0 #D14C18) " +
            "drop-shadow(-2px 0 0 #D14C18) " +
            "drop-shadow(0 2px 0 #D14C18) " +
            "drop-shadow(0 -2px 0 #D14C18)";

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

      // ----------------------------------------------
      // SHOW ONLY NON-CLUSTERED CUSTOM PINS
      // ----------------------------------------------

      function updateMarkers() {
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

      map.on(
        "render",
        updateMarkers
      );

      // ----------------------------------------------
      // CLICK CLUSTER → ZOOM IN
      // ----------------------------------------------

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
      markers.forEach(
        ({ marker }) => {
          marker.remove();
        }
      );

      map.remove();

      mapRef.current = null;
    };
  }, [filteredPaintings]);

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <Header
        title="Map"
        description="Explore the map, select a location, and discover paintings inspired by its landscape."
      />

      {/* Content above map (the header has its own padding, so only the side padding is needed here) */}
      <div className="px-6">

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