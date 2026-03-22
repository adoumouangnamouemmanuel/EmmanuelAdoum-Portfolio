import { readFileSync } from "fs";
import { ImageResponse } from "next/og";
import { join } from "path";

export const size = {
  width: 192,
  height: 192,
};

export const contentType = "image/png";

export default function Icon() {
  const imagePath = join(process.cwd(), "public/images/emma-head.png");
  const imageBuffer = readFileSync(imagePath);
  const imageBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <svg
        width="192"
        height="192"
        viewBox="0 0 192 192"
        style={{
          overflow: "hidden",
        }}
      >
        {/* Circular mask */}
        <defs>
          <clipPath id="circleClip">
            <circle cx="96" cy="96" r="96" />
          </clipPath>
        </defs>

        {/* Rounded image */}
        <image
          href={imageBase64}
          x="0"
          y="0"
          width="192"
          height="192"
          clipPath="url(#circleClip)"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Subtle ring border */}
        <circle
          cx="96"
          cy="96"
          r="94"
          fill="none"
          stroke="rgba(15, 23, 42, 0.2)"
          strokeWidth="2"
        />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
