"use client";

import React, { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, Layers, Compass, AlertCircle } from "lucide-react";
import {
  KENYA_SAFARI_PARKS,
  KENYA_SAFARI_LODGES,
  KENYA_KWS_GATES,
} from "@/data/kenyaGeoData";

export interface RealGpsVehiclePing {
  vehicleId: string;
  registrationPlate: string;
  driverName: string;
  latitude: number;
  longitude: number;
  updatedAtIso: string;
}

interface EastAfricaSafariMapProps {
  /** Only genuine GPS telemetry rows; never pass fabricated coordinates */
  liveVehiclePings?: RealGpsVehiclePing[];
  heightClassName?: string;
}

type MapStyleKey = "dark" | "liberty" | "satellite";

const MAP_STYLES: Record<MapStyleKey, string | maplibregl.StyleSpecification> = {
  dark: "https://tiles.openfreemap.org/styles/dark",
  liberty: "https://tiles.openfreemap.org/styles/liberty",
  satellite: {
    version: 8,
    sources: {
      "arcgis-satellite": {
        type: "raster",
        tiles: [
          "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "Tiles &copy; Esri",
      },
    },
    layers: [
      {
        id: "satellite",
        type: "raster",
        source: "arcgis-satellite",
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
};

export function EastAfricaSafariMap({
  liveVehiclePings = [],
  heightClassName = "h-[420px]",
}: EastAfricaSafariMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [mapStyle, setMapStyle] = useState<MapStyleKey>("dark");
  const [showParks, setShowParks] = useState(true);
  const [showLodges, setShowLodges] = useState(true);
  const [showGates, setShowGates] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedParkId, setSelectedParkId] = useState<string>("");

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const instance = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLES[mapStyle],
        center: [37.5, -1.7],
        zoom: 5.8,
        attributionControl: false,
      });

      instance.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");
      instance.on("error", () => {
        setMapError("Map tile service temporarily unavailable.");
      });

      mapRef.current = instance;
      return () => {
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
        instance.remove();
        mapRef.current = null;
      };
    } catch {
      setMapError("WebGL map initialization failed on this device.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update map style cleanly when toggled
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(MAP_STYLES[mapStyle]);
  }, [mapStyle]);

  // Render markers whenever layer toggles or live GPS pings change
  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!mapInstance) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const addPin = (
      lngLat: [number, number],
      color: string,
      label: string,
      popupHtml: string
    ) => {
      const el = document.createElement("div");
      el.className = "cursor-pointer";
      el.style.width = "12px";
      el.style.height = "12px";
      el.style.borderRadius = "9999px";
      el.style.backgroundColor = color;
      el.style.border = "2px solid #0B0D0C";
      el.style.boxShadow = "0 0 0 2px rgba(212,175,106,0.35)";
      el.title = label;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(lngLat)
        .setPopup(
          new maplibregl.Popup({ offset: 14, closeButton: false }).setHTML(popupHtml)
        )
        .addTo(mapInstance);

      markersRef.current.push(marker);
    };

    if (showParks) {
      KENYA_SAFARI_PARKS.forEach((park) => {
        addPin(
          park.center,
          "#D4AF6A",
          park.name,
          `<div style="font-family:sans-serif;padding:4px 6px;color:#0B0D0C;">
            <strong style="font-size:12px;">${park.name}</strong>
            <div style="font-size:11px;margin-top:2px;color:#3f3f46;">${park.description}</div>
          </div>`
        );
      });
    }

    if (showLodges) {
      KENYA_SAFARI_LODGES.forEach((lodge) => {
        addPin(
          lodge.center,
          "#10B981",
          lodge.name,
          `<div style="font-family:sans-serif;padding:4px 6px;color:#0B0D0C;">
            <strong style="font-size:12px;">${lodge.name}</strong>
            <div style="font-size:10px;color:#047857;">${lodge.parkName} · ${lodge.stars}★</div>
            <div style="font-size:11px;margin-top:2px;color:#3f3f46;">${lodge.description}</div>
          </div>`
        );
      });
    }

    if (showGates) {
      KENYA_KWS_GATES.forEach((gate) => {
        addPin(
          gate.center,
          "#60A5FA",
          gate.name,
          `<div style="font-family:sans-serif;padding:4px 6px;color:#0B0D0C;">
            <strong style="font-size:12px;">${gate.name}</strong>
            <div style="font-size:10px;color:#1D4ED8;">KWS Gate · ${gate.openHours}</div>
            <div style="font-size:11px;margin-top:2px;color:#3f3f46;">${gate.direction}</div>
          </div>`
        );
      });
    }

    // Genuine GPS vehicle telemetry only
    liveVehiclePings.forEach((ping) => {
      addPin(
        [ping.longitude, ping.latitude],
        "#F43F5E",
        ping.registrationPlate,
        `<div style="font-family:sans-serif;padding:4px 6px;color:#0B0D0C;">
          <strong style="font-size:12px;">${ping.registrationPlate}</strong>
          <div style="font-size:11px;">Guide: ${ping.driverName}</div>
          <div style="font-size:10px;color:#52525b;">Last GPS: ${ping.updatedAtIso}</div>
        </div>`
      );
    });
  }, [showParks, showLodges, showGates, liveVehiclePings]);

  const handleFlyToPark = (parkId: string) => {
    setSelectedParkId(parkId);
    const park = KENYA_SAFARI_PARKS.find((p) => p.id === parkId);
    if (park && mapRef.current) {
      mapRef.current.flyTo({ center: park.center, zoom: park.zoom, duration: 900 });
    }
  };

  return (
    <div className="bg-safari-card border border-safari-border rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-safari-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-gold-400" />
          <div>
            <h3 className="font-serif text-lg text-white leading-tight">
              East African Geographic Intelligence
            </h3>
            <p className="text-[11px] font-mono text-safari-sand/55">
              {KENYA_SAFARI_PARKS.length} Parks · {KENYA_SAFARI_LODGES.length} Lodges ·{" "}
              {liveVehiclePings.length > 0
                ? `${liveVehiclePings.length} Live GPS Cruisers`
                : "Awaiting Driver App GPS Stream"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
          {/* Park Jump */}
          <select
            value={selectedParkId}
            onChange={(e) => handleFlyToPark(e.target.value)}
            aria-label="Focus safari park on map"
            className="bg-safari-night border border-safari-border rounded-lg px-2.5 py-1.5 text-safari-sand focus:outline-none focus:border-gold-400"
          >
            <option value="">All Kenya Circuits</option>
            {KENYA_SAFARI_PARKS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Layer Toggles */}
          <button
            type="button"
            onClick={() => setShowParks((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg border transition-colors ${
              showParks
                ? "bg-gold-400/15 border-gold-400/40 text-gold-300"
                : "bg-safari-night border-safari-border text-safari-sand/50"
            }`}
          >
            Parks
          </button>
          <button
            type="button"
            onClick={() => setShowLodges((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg border transition-colors ${
              showLodges
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : "bg-safari-night border-safari-border text-safari-sand/50"
            }`}
          >
            Lodges
          </button>
          <button
            type="button"
            onClick={() => setShowGates((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg border transition-colors ${
              showGates
                ? "bg-blue-500/15 border-blue-500/40 text-blue-300"
                : "bg-safari-night border-safari-border text-safari-sand/50"
            }`}
          >
            KWS Gates
          </button>

          {/* Style Selector */}
          <div className="inline-flex rounded-lg bg-safari-night border border-safari-border p-0.5">
            {(["dark", "liberty", "satellite"] as MapStyleKey[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setMapStyle(st)}
                className={`px-2 py-1 rounded-md uppercase transition-colors ${
                  mapStyle === st
                    ? "bg-gold-400 text-safari-night font-bold"
                    : "text-safari-sand/60 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      {mapError ? (
        <div
          className={`${heightClassName} flex flex-col items-center justify-center gap-2 text-xs font-mono text-safari-sand/60 bg-safari-night`}
        >
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <span>{mapError}</span>
        </div>
      ) : (
        <div className="relative">
          <div ref={containerRef} className={`w-full ${heightClassName}`} />
          {/* Legend */}
          <div className="absolute bottom-3 left-3 bg-safari-night/90 backdrop-blur-xs border border-safari-border rounded-lg px-3 py-1.5 flex items-center gap-3 text-[10px] font-mono text-safari-sand/80">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gold-400" /> Parks
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Lodges
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400" /> Gates
            </span>
            <span className="inline-flex items-center gap-1">
              <Layers className="w-3 h-3 text-safari-sand/50" />
              <MapPin className="w-3 h-3 text-rose-400" /> GPS ({liveVehiclePings.length})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
