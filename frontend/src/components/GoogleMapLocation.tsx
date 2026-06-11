import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Copy, ExternalLink, LoaderCircle, MapPin, Navigation } from "lucide-react";

const addressLines = ["Dukagjini Center", "Prishtinë, Kosovo"];
const mapQuery = addressLines.join(", ");
const encodedQuery = encodeURIComponent(mapQuery);
const mapEmbedUrl = `https://www.google.com/maps?q=${encodedQuery}&z=16&output=embed`;
const mapExternalUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedQuery}`;

export default function GoogleMapLocation() {
  const containerRef = useRef<HTMLElement>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !("IntersectionObserver" in window)) {
      setShouldLoadMap(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: "360px" },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoadMap || !isLoading) return;

    const timeout = window.setTimeout(() => {
      if (isLoading) setHasError(true);
    }, 12000);

    return () => window.clearTimeout(timeout);
  }, [isLoading, shouldLoadMap]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(mapQuery);
      setCopyMessage("Address copied.");
    } catch (_error) {
      setCopyMessage("Copy failed.");
    }

    window.setTimeout(() => setCopyMessage(""), 2200);
  };

  return (
    <section ref={containerRef} className="mt-12 border-t border-white/10 pt-10">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            <MapPin className="h-4 w-4" />
            Our Location
          </div>
          <h2 className="text-3xl font-black text-white">Our Location</h2>
          <p className="mt-2 text-gray-400">Visit us at Dukagjini Center, Prishtinë</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/80"
          >
            <Navigation className="h-4 w-4" />
            Directions
          </a>
          <a
            href={mapExternalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-gray-200 transition-colors hover:border-primary/40 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            Open in Google Maps
          </a>
          <button
            type="button"
            onClick={copyAddress}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-gray-200 transition-colors hover:border-primary/40 hover:text-white"
          >
            <Copy className="h-4 w-4" />
            Copy Address
          </button>
        </div>
      </div>

      {copyMessage && <p className="mb-3 text-sm font-medium text-green-300">{copyMessage}</p>}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
        <div className="relative h-[300px] w-full bg-black/30 sm:h-[400px] lg:h-[540px]">
          {isLoading && !hasError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 text-sm text-gray-300">
              <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-primary" />
              Loading map...
            </div>
          )}

          {hasError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/70 p-6 text-center">
              <AlertTriangle className="h-7 w-7 text-yellow-300" />
              <p className="text-sm font-bold text-white">Map could not be loaded.</p>
              <a
                href={mapExternalUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-gray-200 transition-colors hover:border-primary/40 hover:text-white"
              >
                Open in Google Maps
              </a>
            </div>
          )}

          {shouldLoadMap && (
            <iframe
              title="Google Map location for Dukagjini Center, Prishtinë, Kosovo"
              src={mapEmbedUrl}
              className="h-full w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => {
                setIsLoading(false);
                setHasError(false);
              }}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1 text-sm text-gray-400 sm:flex-row sm:items-center sm:gap-3">
        <span className="font-bold text-gray-200">Address:</span>
        <span>Dukagjini Center</span>
        <span className="hidden text-gray-600 sm:inline">/</span>
        <span>Prishtinë, Kosovo</span>
      </div>
    </section>
  );
}
