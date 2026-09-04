"use client";

import { useEffect, useRef } from "react";

const GRADIENT_LUT_SIZE = 256;
const RESIZE_DEBOUNCE_MS = 150;

type RGB = readonly [number, number, number];
type ThemeMode = "light" | "dark";

type GradientStop = {
  offset: number;
  color: RGB;
};

type BackgroundPalette = {
  fill: string;
  baseOpacity: number;
  scanOpacity: number;
  hoverMaxOpacity: number;
  lightRadius: number;
  stops: readonly GradientStop[];
};

const palettes = {
  light: {
    fill: "#f8fafc",
    baseOpacity: 0.12,
    scanOpacity: 0.05,
    hoverMaxOpacity: 0.54,
    lightRadius: 118,
    stops: [
      { offset: 0, color: [29, 78, 216] },
      { offset: 0.34, color: [2, 132, 199] },
      { offset: 0.68, color: [79, 70, 229] },
      { offset: 1, color: [37, 99, 235] },
    ],
  },
  dark: {
    fill: "#111827",
    baseOpacity: 0.1,
    scanOpacity: 0.08,
    hoverMaxOpacity: 0.95,
    lightRadius: 130,
    stops: [
      { offset: 0, color: [37, 99, 235] },
      { offset: 0.34, color: [14, 165, 233] },
      { offset: 0.68, color: [99, 102, 241] },
      { offset: 1, color: [59, 130, 246] },
    ],
  },
} satisfies Record<ThemeMode, BackgroundPalette>;

type HexPoint = {
  x: number;
  y: number;
  t: number;
};

function buildGradientLookup(stops: readonly GradientStop[]) {
  const gradientLUT: RGB[] = new Array(GRADIENT_LUT_SIZE);

  for (let i = 0; i < GRADIENT_LUT_SIZE; i += 1) {
    const t = i / (GRADIENT_LUT_SIZE - 1);
    let startStop: GradientStop | undefined;
    let endStop: GradientStop | undefined;

    for (let j = 0; j < stops.length - 1; j += 1) {
      if (t >= stops[j].offset && t <= stops[j + 1].offset) {
        startStop = stops[j];
        endStop = stops[j + 1];
        break;
      }
    }

    if (!startStop || !endStop) {
      gradientLUT[i] = stops[stops.length - 1].color;
      continue;
    }

    const range = endStop.offset - startStop.offset;
    const localT = range === 0 ? 0 : (t - startStop.offset) / range;

    gradientLUT[i] = [
      Math.round(
        startStop.color[0] +
          localT * (endStop.color[0] - startStop.color[0]),
      ),
      Math.round(
        startStop.color[1] +
          localT * (endStop.color[1] - startStop.color[1]),
      ),
      Math.round(
        startStop.color[2] +
          localT * (endStop.color[2] - startStop.color[2]),
      ),
    ];
  }

  return gradientLUT;
}

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const pendingMouse = useRef<{ x: number; y: number } | null>(null);
  const breathingProgress = useRef(0);
  const direction = useRef(1);
  const gridPointsRef = useRef<HexPoint[]>([]);
  const isTabVisible = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrameId = 0;
    let resizeTimeoutId: ReturnType<typeof setTimeout> | undefined;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let hexSize = 42;
    let palette = palettes.dark;
    let gradientLUT = buildGradientLookup(palette.stops);

    const breathingSpeed = 0.0035;

    const resolveThemeMode = (): ThemeMode =>
      document.documentElement.classList.contains("dark") ? "dark" : "light";

    const syncPaletteWithTheme = () => {
      const nextPalette = palettes[resolveThemeMode()];
      if (nextPalette === palette) return;

      palette = nextPalette;
      gradientLUT = buildGradientLookup(nextPalette.stops);
    };

    const getGradientColor = (t: number, opacity: number) => {
      const clampedT = Math.min(Math.max(t, 0), 1);
      const index = Math.floor(clampedT * (GRADIENT_LUT_SIZE - 1));
      const color = gradientLUT[index] ?? gradientLUT[GRADIENT_LUT_SIZE - 1];
      return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
    };

    const computeGridPoints = () => {
      const points: HexPoint[] = [];
      const cols = Math.ceil(width / (hexSize * 1.5)) + 2;
      const rows = Math.ceil(height / (hexSize * Math.sqrt(3))) + 2;
      const denominator = Math.max(width * width + height * height, 1);

      for (let row = -1; row <= rows; row += 1) {
        for (let col = -1; col <= cols; col += 1) {
          const x = col * hexSize * 1.5;
          const y =
            row * hexSize * Math.sqrt(3) +
            (col % 2 === 0 ? 0 : (hexSize * Math.sqrt(3)) / 2);
          const t = (x * width + y * height) / denominator;
          points.push({ x, y, t });
        }
      }

      gridPointsRef.current = points;
    };

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      hexSize = width < 640 ? 58 : width < 1024 ? 48 : 42;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      computeGridPoints();
    };

    const debouncedResize = () => {
      if (resizeTimeoutId) clearTimeout(resizeTimeoutId);
      resizeTimeoutId = setTimeout(resizeCanvas, RESIZE_DEBOUNCE_MS);
    };

    const drawHexagon = (
      hexagonPath: Path2D,
      x: number,
      y: number,
      t: number,
      opacity: number,
    ) => {
      context.save();
      context.translate(x, y);
      context.strokeStyle = getGradientColor(t, opacity);
      context.lineWidth = opacity > palette.baseOpacity + 0.2 ? 2 : 1;
      context.stroke(hexagonPath);
      context.restore();
    };

    const render = () => {
      syncPaletteWithTheme();

      if (pendingMouse.current) {
        mouse.current = pendingMouse.current;
        pendingMouse.current = null;
      }

      if (isTabVisible.current) {
        const hexagonPath = new Path2D();
        for (let i = 0; i < 6; i += 1) {
          const angle = (Math.PI / 3) * i;
          const xOffset = hexSize * Math.cos(angle);
          const yOffset = hexSize * Math.sin(angle);

          if (i === 0) hexagonPath.moveTo(xOffset, yOffset);
          else hexagonPath.lineTo(xOffset, yOffset);
        }
        hexagonPath.closePath();

        context.fillStyle = palette.fill;
        context.fillRect(0, 0, width, height);

        gridPointsRef.current.forEach(({ x, y, t }) => {
          const dx = x - mouse.current.x;
          const dy = y - mouse.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          let opacity =
            distance <= palette.lightRadius
              ? palette.baseOpacity +
                (1 - distance / palette.lightRadius) *
                  (palette.hoverMaxOpacity - palette.baseOpacity)
              : palette.baseOpacity;
          const animationLine = height * breathingProgress.current;

          if (y <= animationLine) opacity += palette.scanOpacity;
          opacity = Math.min(Math.max(opacity, 0), palette.hoverMaxOpacity);

          drawHexagon(hexagonPath, x, y, t, opacity);
        });

        breathingProgress.current += breathingSpeed * direction.current;

        if (
          breathingProgress.current >= 1 ||
          breathingProgress.current <= 0
        ) {
          direction.current *= -1;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (event: MouseEvent) => {
      pendingMouse.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handleVisibilityChange = () => {
      isTabVisible.current = document.visibilityState === "visible";
    };

    const observer = new MutationObserver(syncPaletteWithTheme);

    isTabVisible.current = document.visibilityState === "visible";
    syncPaletteWithTheme();
    resizeCanvas();
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", debouncedResize);
    window.addEventListener("mousemove", handleMouseMove);
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeTimeoutId) clearTimeout(resizeTimeoutId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-50 [contain:paint] [transform:translateZ(0)] dark:bg-slate-900"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
