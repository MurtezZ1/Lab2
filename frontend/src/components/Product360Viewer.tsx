import { Maximize, Minus, Plus, RotateCcw, X } from "lucide-react";
import { PointerEvent, WheelEvent, useMemo, useRef, useState } from "react";

type Product360ViewerProps = {
  image: string;
  name: string;
};

export default function Product360Viewer({ image, name }: Product360ViewerProps) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const startX = useRef<number | null>(null);
  const startRotation = useRef(0);
  const normalizedRotation = useMemo(() => ((rotation % 360) + 360) % 360, [rotation]);

  const beginDrag = (event: PointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX;
    startRotation.current = rotation;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const delta = event.clientX - startX.current;
    setRotation(startRotation.current + delta * 0.6);
  };

  const endDrag = () => {
    startX.current = null;
  };

  const updateZoom = (nextZoom: number) => {
    setZoom(Math.min(2.2, Math.max(0.8, Number(nextZoom.toFixed(2)))));
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    updateZoom(zoom + (event.deltaY > 0 ? -0.1 : 0.1));
  };

  const viewer = (
    <div
      className="relative flex h-full min-h-[20rem] cursor-grab touch-pan-y select-none items-center justify-center overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] active:cursor-grabbing"
      onPointerDown={beginDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onWheel={handleWheel}
      role="img"
      aria-label={`${name} 360 product viewer`}
    >
      <img
        src={image}
        alt={`${name} 360 view`}
        draggable={false}
        className="h-full w-full object-contain p-8 transition-transform duration-150"
        style={{
          transform: `scale(${zoom}) rotateY(${normalizedRotation}deg)`,
        }}
      />
      <div className="absolute left-5 top-5 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-primary">
        360 View
      </div>
      <div className="absolute bottom-5 left-5 right-5">
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-primary" style={{ width: `${(normalizedRotation / 360) * 100}%` }} />
        </div>
        <p className="mt-2 text-xs text-gray-400">Drag or swipe to rotate. Use mouse wheel or controls to zoom.</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="glass-card rounded-3xl p-4">
        <div className="relative aspect-square">
          {viewer}
          <ViewerControls
            onReset={() => {
              setRotation(0);
              setZoom(1);
            }}
            onZoomIn={() => updateZoom(zoom + 0.15)}
            onZoomOut={() => updateZoom(zoom - 0.15)}
            onFullscreen={() => setIsFullscreen(true)}
          />
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black/95 p-6">
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute right-6 top-6 z-10 rounded-full border border-white/10 bg-white/10 p-3 text-white hover:bg-white/20"
            aria-label="Close fullscreen 360 viewer"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mx-auto h-full max-w-6xl">
            {viewer}
          </div>
        </div>
      )}
    </>
  );
}

function ViewerControls({
  onReset,
  onZoomIn,
  onZoomOut,
  onFullscreen,
}: {
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullscreen: () => void;
}) {
  return (
    <div className="absolute right-5 top-5 flex flex-col gap-2">
      <IconButton label="Reset 360 view" onClick={onReset} icon={RotateCcw} />
      <IconButton label="Zoom in" onClick={onZoomIn} icon={Plus} />
      <IconButton label="Zoom out" onClick={onZoomOut} icon={Minus} />
      <IconButton label="Fullscreen" onClick={onFullscreen} icon={Maximize} />
    </div>
  );
}

function IconButton({ label, onClick, icon: Icon }: { label: string; onClick: () => void; icon: typeof Maximize }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-white/10 bg-black/50 p-3 text-white backdrop-blur transition-colors hover:border-primary/50 hover:text-primary"
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
