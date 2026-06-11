import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

type ProductCarouselProps = {
  title: string;
  subtitle?: string;
  products: Product[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  viewAllTo?: string;
};

const GAP_REM = 1.5;
const AUTOPLAY_DELAY = 4000;

function getItemsPerView() {
  if (typeof window === "undefined") return 4;
  if (window.innerWidth >= 1024) return 4;
  if (window.innerWidth >= 900) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

function ProductCarousel({
  title,
  subtitle,
  products,
  loading = false,
  error = "",
  emptyMessage = "No products available yet.",
  viewAllTo = "/products",
}: ProductCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ pointerId: 0, startX: 0, startScrollLeft: 0, moved: false });
  const suppressClickRef = useRef(false);
  const [itemsPerView, setItemsPerView] = useState(getItemsPerView);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const canSlide = products.length > itemsPerView;
  const itemWidth = `calc((100% - ${(itemsPerView - 1) * GAP_REM}rem) / ${itemsPerView})`;
  const pageCount = Math.max(1, Math.ceil(products.length / itemsPerView));
  const maxStartIndex = Math.max(products.length - itemsPerView, 0);
  const activePage = currentIndex >= maxStartIndex
    ? pageCount - 1
    : Math.min(Math.floor(currentIndex / itemsPerView), pageCount - 1);

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const viewport = viewportRef.current;
    const item = trackRef.current?.children[index] as HTMLElement | undefined;
    if (!viewport || !item) return;

    viewport.scrollTo({ left: item.offsetLeft, behavior });
    setCurrentIndex(index);
  }, []);

  const goToIndex = useCallback((index: number) => {
    if (!canSlide) return;
    const boundedIndex = Math.max(0, Math.min(index, maxStartIndex));
    scrollToIndex(boundedIndex, "smooth");
  }, [canSlide, maxStartIndex, scrollToIndex]);

  const goToPage = useCallback((page: number) => {
    const target = Math.min(page * itemsPerView, maxStartIndex);
    goToIndex(target);
  }, [goToIndex, itemsPerView, maxStartIndex]);

  const goToPrevious = useCallback(() => {
    const previousPage = activePage <= 0 ? pageCount - 1 : activePage - 1;
    goToPage(previousPage);
  }, [activePage, goToPage, pageCount]);

  const goToNext = useCallback(() => {
    const nextPage = activePage >= pageCount - 1 ? 0 : activePage + 1;
    goToPage(nextPage);
  }, [activePage, goToPage, pageCount]);

  useEffect(() => {
    const handleResize = () => setItemsPerView(getItemsPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    requestAnimationFrame(() => scrollToIndex(0, "auto"));
  }, [itemsPerView, products.length, scrollToIndex]);

  useEffect(() => {
    if (!canSlide || loading || error || isHovering || isFocused || isDragging) return;

    const intervalId = window.setInterval(goToNext, AUTOPLAY_DELAY);
    return () => window.clearInterval(intervalId);
  }, [canSlide, error, goToNext, isDragging, isFocused, isHovering, loading]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canSlide) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: viewportRef.current?.scrollLeft ?? 0,
      moved: false,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragRef.current.pointerId !== event.pointerId || !viewportRef.current) return;

    const delta = event.clientX - dragRef.current.startX;
    if (Math.abs(delta) > 4) dragRef.current.moved = true;
    viewportRef.current.scrollLeft = dragRef.current.startScrollLeft - delta;
  };

  const finishPointerDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragRef.current.pointerId !== event.pointerId) return;

    const delta = event.clientX - dragRef.current.startX;
    suppressClickRef.current = dragRef.current.moved;
    setIsDragging(false);

    if (Math.abs(delta) > 60) {
      if (delta > 0) goToPrevious();
      else goToNext();
    } else {
      scrollToIndex(currentIndex, "smooth");
    }

    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  };

  return (
    <section
      className="container mx-auto px-6"
      aria-label={`${title} product carousel`}
      onKeyDown={handleKeyDown}
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          {subtitle && <p className="mt-2 text-gray-400">{subtitle}</p>}
        </div>
        <Link to={viewAllTo} className="inline-flex w-fit items-center gap-2 text-primary transition-colors hover:text-accent">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading && <ProductCarouselSkeleton itemsPerView={itemsPerView} />}

      {!loading && error && (
        <div className="glass-card flex items-center gap-3 rounded-2xl p-5 text-sm text-red-200">
          <AlertCircle className="h-5 w-5 text-red-300" />
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="glass-card rounded-2xl p-5 text-sm text-gray-400">{emptyMessage}</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div
          className="group/carousel relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseOut={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsHovering(false);
          }}
          onPointerEnter={() => setIsHovering(true)}
          onPointerMove={() => setIsHovering(true)}
          onPointerLeave={() => setIsHovering(false)}
          onPointerOut={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsHovering(false);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <div
            ref={viewportRef}
            role="region"
            aria-roledescription="carousel"
            aria-label={title}
            tabIndex={0}
            className="overflow-hidden outline-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointerDrag}
            onPointerCancel={finishPointerDrag}
            onClickCapture={handleClickCapture}
          >
            <div
              ref={trackRef}
              className={`flex gap-6 ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
              style={{ scrollBehavior: "smooth" }}
            >
              {products.map((product, index) => (
                <div
                  key={`${title}-${product.uuid ?? product.id}-${index}`}
                  className="min-w-0 shrink-0"
                  style={{ width: itemWidth }}
                >
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={goToPrevious}
            disabled={!canSlide}
            aria-label={`Previous ${title} products`}
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-zinc-950/90 text-white shadow-xl backdrop-blur transition-colors hover:border-primary/40 hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40 sm:left-0 sm:h-11 sm:w-11 sm:-translate-x-1/2"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            disabled={!canSlide}
            aria-label={`Next ${title} products`}
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-zinc-950/90 text-white shadow-xl backdrop-blur transition-colors hover:border-primary/40 hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40 sm:right-0 sm:h-11 sm:w-11 sm:translate-x-1/2"
          >
            <ArrowRight className="h-5 w-5" />
          </button>

          {canSlide && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, page) => (
                <button
                  key={`${title}-dot-${page}`}
                  type="button"
                  aria-label={`Go to ${title} slide ${page + 1}`}
                  onClick={() => goToPage(page)}
                  className={`h-2 rounded-full transition-all ${
                    activePage === page ? "w-8 bg-primary" : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ProductCarouselSkeleton({ itemsPerView }: { itemsPerView: number }) {
  const itemWidth = `calc((100% - ${(itemsPerView - 1) * GAP_REM}rem) / ${itemsPerView})`;

  return (
    <div className="overflow-hidden">
      <div className="flex gap-6">
        {Array.from({ length: itemsPerView }).map((_, item) => (
          <div key={item} className="glass-card shrink-0 rounded-2xl p-4" style={{ width: itemWidth }}>
            <div className="h-48 animate-pulse rounded-xl bg-white/5" />
            <div className="mt-4 h-4 w-24 animate-pulse rounded bg-white/10" />
            <div className="mt-3 h-5 w-4/5 animate-pulse rounded bg-white/10" />
            <div className="mt-6 h-6 w-20 animate-pulse rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ProductCarousel);
