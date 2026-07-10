import { Maximize, Minus, Plus, RotateCcw, X } from "lucide-react";
import { PointerEvent, WheelEvent, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { getRealProductModel } from "@/utils/product3dModels";

type Product360ViewerProps = {
  image: string;
  name: string;
};

type SceneState = {
  camera: THREE.PerspectiveCamera;
  frameId: number;
  group: THREE.Group;
  renderer: THREE.WebGLRenderer;
  resizeObserver: ResizeObserver;
  scene: THREE.Scene;
};

export default function Product360Viewer({ image, name }: Product360ViewerProps) {
  const realProductModel = getRealProductModel(name);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fullscreenRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<SceneState | null>(null);
  const dragStartX = useRef<number | null>(null);
  const dragStartRotation = useRef(0);
  const rotationRef = useRef(rotation);
  const zoomRef = useRef(zoom);
  const isDraggingRef = useRef(false);
  const normalizedRotation = useMemo(() => ((rotation % 360) + 360) % 360, [rotation]);

  useEffect(() => {
    rotationRef.current = rotation;
    if (sceneRef.current) {
      sceneRef.current.group.rotation.y = THREE.MathUtils.degToRad(rotation);
    }
  }, [rotation]);

  useEffect(() => {
    zoomRef.current = zoom;
    if (sceneRef.current) {
      sceneRef.current.camera.position.z = 5.2 / zoom;
    }
  }, [zoom]);

  useEffect(() => {
    if (realProductModel) return;
    return undefined;
  }, [image, name, isFullscreen, realProductModel]);

  const beginDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragStartX.current = event.clientX;
    dragStartRotation.current = rotationRef.current;
    isDraggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const delta = event.clientX - dragStartX.current;
    setRotation(dragStartRotation.current + delta * 0.6);
  };

  const endDrag = () => {
    dragStartX.current = null;
    isDraggingRef.current = false;
  };

  const updateZoom = (nextZoom: number) => {
    setZoom(Math.min(2.4, Math.max(0.7, Number(nextZoom.toFixed(2)))));
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    updateZoom(zoomRef.current + (event.deltaY > 0 ? -0.1 : 0.1));
  };

  const resetView = () => {
    setRotation(0);
    setZoom(1);
  };

  const viewer = (ref: typeof containerRef | typeof fullscreenRef) => {
    if (realProductModel) {
      return (
        <div className="relative h-full min-h-[18rem] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] sm:min-h-[24rem] sm:rounded-3xl lg:min-h-[30rem]">
          <iframe
            title={`${name} real 3D model`}
            src={realProductModel.embedUrl}
            className="h-full w-full"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
          <div className="absolute left-3 top-3 rounded-full border border-primary/30 bg-black/70 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-primary backdrop-blur sm:left-5 sm:top-5 sm:text-xs">
            Real 3D Model
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
            <p className="text-[11px] leading-relaxed text-gray-300 sm:text-xs">
              Interactive product model. Drag to rotate, scroll to zoom, and use fullscreen for presentation.
            </p>
            <p className="mt-1 line-clamp-1 text-[10px] text-gray-500 sm:text-[11px]">
              Model source: {realProductModel.source}. {realProductModel.matchType}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className="relative flex h-full min-h-[18rem] items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] sm:min-h-[24rem] sm:rounded-3xl lg:min-h-[30rem]"
        role="img"
        aria-label={`${name} product image`}
      >
        <img src={image} alt={name} className="h-full w-full object-contain p-5 sm:p-8" />
        <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white backdrop-blur sm:left-5 sm:top-5 sm:text-xs">
          Product Image
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
          <p className="text-[11px] leading-relaxed text-gray-300 sm:text-xs">
            Real product photo shown because no verified product-specific 3D model is available for this item.
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="glass-card rounded-3xl p-2 sm:p-4">
        <div className="relative aspect-[4/5] sm:aspect-[16/11] xl:aspect-square">
          {viewer(containerRef)}
          {realProductModel ? (
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="absolute right-3 top-3 rounded-xl border border-white/10 bg-black/60 p-2.5 text-white backdrop-blur transition-colors hover:border-primary/50 hover:text-primary sm:right-5 sm:top-5 sm:p-3"
              aria-label="Fullscreen real 3D model"
              title="Fullscreen"
            >
              <Maximize className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="absolute right-3 top-3 rounded-xl border border-white/10 bg-black/60 p-2.5 text-white backdrop-blur transition-colors hover:border-primary/50 hover:text-primary sm:right-5 sm:top-5 sm:p-3"
              aria-label="Fullscreen product image"
              title="Fullscreen"
            >
              <Maximize className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-black/95 p-3 sm:p-6">
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-white/10 p-3 text-white hover:bg-white/20 sm:right-6 sm:top-6"
            aria-label="Close fullscreen 3D viewer"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mx-auto h-full max-w-6xl">
            {viewer(fullscreenRef)}
          </div>
        </div>
      )}
    </>
  );
}

function mountScene(
  container: HTMLDivElement,
  productName: string,
  productImage: string,
  sceneRef: React.MutableRefObject<SceneState | null>,
  isDraggingRef: React.MutableRefObject<boolean>,
  rotationRef: React.MutableRefObject<number>,
  zoomRef: React.MutableRefObject<number>,
) {
  const cleanupPrevious = sceneRef.current;
  if (cleanupPrevious) {
    cancelAnimationFrame(cleanupPrevious.frameId);
    cleanupPrevious.resizeObserver.disconnect();
    cleanupPrevious.renderer.dispose();
    cleanupPrevious.renderer.domElement.remove();
    sceneRef.current = null;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111114);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 1.1, 5.2 / zoomRef.current);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = "absolute inset-0 h-full w-full";
  container.prepend(renderer.domElement);

  const group = createProductModel(productName, productImage);
  group.rotation.y = THREE.MathUtils.degToRad(rotationRef.current);
  scene.add(group);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x2f3640, 2.8));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
  keyLight.position.set(4, 5, 5);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x37b7ff, 4.2, 10);
  rimLight.position.set(-3.5, 2.2, 2.8);
  scene.add(rimLight);

  const base = createBase();
  scene.add(base);

  const resize = () => {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  const clock = new THREE.Clock();
  const animate = () => {
    const elapsed = clock.getElapsedTime();
    if (!isDraggingRef.current) {
      const nextRotation = rotationRef.current + 0.08;
      rotationRef.current = nextRotation;
      group.rotation.y = THREE.MathUtils.degToRad(nextRotation);
    }
    group.position.y = Math.sin(elapsed * 1.6) * 0.035;
    base.rotation.z = elapsed * 0.05;
    renderer.render(scene, camera);
    if (sceneRef.current) {
      sceneRef.current.frameId = requestAnimationFrame(animate);
    }
  };

  sceneRef.current = {
    camera,
    frameId: requestAnimationFrame(animate),
    group,
    renderer,
    resizeObserver,
    scene,
  };

  return () => {
    const currentScene = sceneRef.current;
    if (currentScene?.renderer === renderer) {
      cancelAnimationFrame(currentScene.frameId);
      resizeObserver.disconnect();
      disposeObject(scene);
      renderer.dispose();
      renderer.domElement.remove();
      sceneRef.current = null;
    }
  };
}

function createProductModel(productName: string, productImage: string) {
  const lower = productName.toLowerCase();
  if (matches(lower, ["laptop", "macbook", "aspire", "thinkpad", "surface", "predator", "swift", "xps", "inspiron"])) {
    return createLaptopModel(productName, productImage);
  }
  if (matches(lower, ["phone", "iphone", "galaxy", "pixel", "xiaomi", "oneplus"])) {
    return createPhoneModel(productName, productImage);
  }
  if (matches(lower, ["ipad", "tablet", "tab"])) {
    return createTabletModel(productName, productImage);
  }
  if (matches(lower, ["headphone", "airpods", "earbuds", "buds", "sony wh", "bose"])) {
    return createHeadphonesModel();
  }
  if (matches(lower, ["mouse", "mx master", "razer", "logitech"])) {
    return createMouseModel();
  }
  if (matches(lower, ["watch", "fitbit", "garmin", "charge"])) {
    return createWatchModel();
  }
  if (matches(lower, ["camera", "canon", "nikon", "sony alpha", "gopro"])) {
    return createCameraModel();
  }
  if (matches(lower, ["speaker", "echo", "homepod", "soundbar"])) {
    return createSpeakerModel();
  }
  return createGenericTechModel(productName, productImage);
}

function matches(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

function createLaptopModel(name: string, image: string) {
  const group = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: 0x22252d, metalness: 0.55, roughness: 0.28 });
  const edge = new THREE.MeshStandardMaterial({ color: 0x747b89, metalness: 0.8, roughness: 0.22 });
  const screen = imageMaterial(image, 0x20344a);

  const base = box(2.9, 0.12, 1.85, dark);
  base.position.set(0, -0.45, 0.38);
  base.castShadow = true;
  group.add(base);

  const hinge = cylinder(0.045, 2.55, edge);
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, -0.32, -0.55);
  group.add(hinge);

  const displayBack = box(2.7, 1.75, 0.1, dark);
  displayBack.position.set(0, 0.45, -0.68);
  displayBack.rotation.x = -0.22;
  displayBack.castShadow = true;
  group.add(displayBack);

  const display = plane(2.35, 1.35, screen);
  display.position.set(0, 0.47, -0.615);
  display.rotation.x = -0.22;
  group.add(display);

  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const key = box(0.2, 0.015, 0.09, edge);
      key.position.set(-0.9 + col * 0.225, -0.36, 0.15 + row * 0.15);
      group.add(key);
    }
  }

  const trackpad = box(0.7, 0.018, 0.34, new THREE.MeshStandardMaterial({ color: 0x15171c, roughness: 0.5 }));
  trackpad.position.set(0, -0.35, 0.84);
  group.add(trackpad);

  group.userData.label = name;
  return group;
}

function createPhoneModel(name: string, image: string) {
  const group = new THREE.Group();
  const frame = new THREE.MeshStandardMaterial({ color: 0x0f1117, metalness: 0.75, roughness: 0.18 });
  const screen = imageMaterial(image, 0x20344a);
  const body = box(1.2, 2.35, 0.16, frame);
  body.castShadow = true;
  group.add(body);

  const display = plane(1.02, 2.02, screen);
  display.position.set(0, 0, 0.086);
  group.add(display);

  const camera = cylinder(0.12, 0.035, new THREE.MeshStandardMaterial({ color: 0x0a0a0d, metalness: 0.8 }));
  camera.rotation.x = Math.PI / 2;
  camera.position.set(0.32, 0.82, 0.12);
  group.add(camera);

  group.userData.label = name;
  return group;
}

function createTabletModel(name: string, image: string) {
  const group = createPhoneModel(name, image);
  group.scale.set(1.45, 1.25, 1);
  return group;
}

function createHeadphonesModel() {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0x171a22, metalness: 0.45, roughness: 0.25 });
  const accent = new THREE.MeshStandardMaterial({ color: 0x2f9bff, emissive: 0x0b4d81, emissiveIntensity: 0.35 });

  const band = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.055, 16, 96, Math.PI), material);
  band.rotation.z = Math.PI;
  band.position.y = 0.35;
  band.castShadow = true;
  group.add(band);

  [-0.82, 0.82].forEach((x) => {
    const cup = cylinder(0.34, 0.32, material);
    cup.rotation.z = Math.PI / 2;
    cup.position.set(x, -0.25, 0);
    cup.castShadow = true;
    group.add(cup);

    const glow = cylinder(0.2, 0.34, accent);
    glow.rotation.z = Math.PI / 2;
    glow.position.set(x * 1.01, -0.25, 0);
    group.add(glow);
  });

  return group;
}

function createMouseModel() {
  const group = new THREE.Group();
  const shell = new THREE.MeshStandardMaterial({ color: 0x191d24, metalness: 0.35, roughness: 0.24 });
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.8, 48, 24), shell);
  top.scale.set(0.85, 0.34, 1.25);
  top.position.y = -0.15;
  top.castShadow = true;
  group.add(top);

  const wheel = cylinder(0.075, 0.28, new THREE.MeshStandardMaterial({ color: 0x2f9bff, emissive: 0x093c64 }));
  wheel.rotation.x = Math.PI / 2;
  wheel.position.set(0, 0.16, 0.28);
  group.add(wheel);

  const split = box(0.035, 0.02, 0.62, new THREE.MeshStandardMaterial({ color: 0x08090d }));
  split.position.set(0, 0.18, 0.15);
  group.add(split);
  return group;
}

function createWatchModel() {
  const group = new THREE.Group();
  const bandMaterial = new THREE.MeshStandardMaterial({ color: 0x14161c, roughness: 0.45 });
  const faceMaterial = new THREE.MeshStandardMaterial({ color: 0x05070a, metalness: 0.55, roughness: 0.18 });
  const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x2f9bff, emissive: 0x0a3f6c, emissiveIntensity: 0.45 });

  const face = box(0.9, 0.9, 0.16, faceMaterial);
  face.castShadow = true;
  group.add(face);

  const screen = plane(0.68, 0.68, screenMaterial);
  screen.position.z = 0.085;
  group.add(screen);

  const topBand = box(0.42, 1.0, 0.08, bandMaterial);
  topBand.position.y = 0.92;
  group.add(topBand);

  const bottomBand = box(0.42, 1.0, 0.08, bandMaterial);
  bottomBand.position.y = -0.92;
  group.add(bottomBand);
  return group;
}

function createCameraModel() {
  const group = new THREE.Group();
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x181b22, metalness: 0.45, roughness: 0.28 });
  const glassMaterial = new THREE.MeshStandardMaterial({ color: 0x06131f, metalness: 0.2, roughness: 0.04, transparent: true, opacity: 0.82 });

  const body = box(1.65, 1.0, 0.62, bodyMaterial);
  body.castShadow = true;
  group.add(body);

  const grip = box(0.32, 0.92, 0.72, bodyMaterial);
  grip.position.x = -0.82;
  group.add(grip);

  const lens = cylinder(0.42, 0.55, bodyMaterial);
  lens.rotation.x = Math.PI / 2;
  lens.position.z = 0.58;
  group.add(lens);

  const glass = cylinder(0.28, 0.04, glassMaterial);
  glass.rotation.x = Math.PI / 2;
  glass.position.z = 0.88;
  group.add(glass);
  return group;
}

function createSpeakerModel() {
  const group = new THREE.Group();
  const body = box(1.2, 2.0, 0.8, new THREE.MeshStandardMaterial({ color: 0x151820, roughness: 0.38 }));
  body.castShadow = true;
  group.add(body);

  [-0.45, 0.25].forEach((y) => {
    const cone = cylinder(0.34, 0.05, new THREE.MeshStandardMaterial({ color: 0x0a0c12, metalness: 0.2 }));
    cone.rotation.x = Math.PI / 2;
    cone.position.set(0, y, 0.43);
    group.add(cone);
  });
  return group;
}

function createGenericTechModel(name: string, image: string) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0x20242d, metalness: 0.55, roughness: 0.22 });
  const body = box(1.65, 1.2, 0.7, material);
  body.castShadow = true;
  group.add(body);

  const front = plane(1.2, 0.78, imageMaterial(image, 0x111923));
  front.position.z = 0.36;
  group.add(front);

  const label = box(0.85, 0.08, 0.04, new THREE.MeshStandardMaterial({ color: 0x2f9bff, emissive: 0x0b4d81 }));
  label.position.set(0, -0.48, 0.4);
  group.add(label);
  group.userData.label = name;
  return group;
}

function createBase() {
  const group = new THREE.Group();
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x2f9bff,
    emissive: 0x0a3554,
    emissiveIntensity: 0.35,
    metalness: 0.4,
    roughness: 0.35,
    transparent: true,
    opacity: 0.7,
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.012, 8, 120), ringMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -1.18;
  group.add(ring);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.55, 80),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -1.22;
  group.add(shadow);
  return group;
}

function imageMaterial(image: string, fallbackColor: number) {
  const material = new THREE.MeshStandardMaterial({
    color: fallbackColor,
    emissive: fallbackColor,
    emissiveIntensity: 0.08,
    roughness: 0.18,
    metalness: 0.05,
  });

  if (image) {
    const loader = new THREE.TextureLoader();
    loader.load(
      image,
      (texture: THREE.Texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        material.map = texture;
        material.needsUpdate = true;
      },
      undefined,
      () => {
        material.color = new THREE.Color(fallbackColor);
      },
    );
  }

  return material;
}

function box(width: number, height: number, depth: number, material: THREE.Material) {
  return new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
}

function cylinder(radius: number, depth: number, material: THREE.Material) {
  return new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, 48), material);
}

function plane(width: number, height: number, material: THREE.Material) {
  return new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material: THREE.Material) => {
      Object.values(material as unknown as Record<string, unknown>).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose();
      });
      material.dispose();
    });
  });
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
      <IconButton label="Reset 3D view" onClick={onReset} icon={RotateCcw} />
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
