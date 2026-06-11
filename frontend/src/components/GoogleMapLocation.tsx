import { useEffect, useRef, useState } from "react";
import { AlertTriangle, LoaderCircle, MapPin } from "lucide-react";

const mapQuery = "Dukagjini Center, Prishtinë, Kosovo";
const encodedQuery = encodeURIComponent(mapQuery);
const mapEmbedUrl = `https://www.google.com/maps?q=${encodedQuery}&z=16&output=embed`;
const mapExternalUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

export default function GoogleMapLocation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
      { rootMargin: "320px" },
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

  return (
    <div ref={containerRef} className="overflow-hidden rounded-lg border border-white/10 bg-black/40">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-sm font-bold text-white">
        <MapPin className="h-4 w-4 text-primary" />
        Dukagjini Center
      </div>
      <div className="relative aspect-[4/3] min-h-64 w-full bg-black/30">
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
  );
}
