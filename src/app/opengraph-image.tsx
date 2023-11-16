import { ImageResponse } from "next/og";
import Image from 'next/image'

export const runtime = "edge";
export const alt = "HackType - A tool that will help you identify the type of attacks, their risks and how to prevent them!";
export const contentType = "image/png";

export default async function OG() {
  const sfPro = await fetch(
    new URL("./fonts/SF-Pro-Display-Medium.otf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          backgroundImage:
            "linear-gradient(to bottom right, #E0E7FF 25%, #ffffff 50%, #CFFAFE 75%)",
        }}
      >
        <Image
          src={`https://hacktype.za16.co/logo.png`}
          alt="Logo"
          tw="w-100 h-100 mb-4 opacity-95"
          width={100}
          height={100}
        />
        <h1
          style={{
            fontSize: "100px",
            fontFamily: "SF Pro",
            background:
              "linear-gradient(to bottom right, #000000 21.66%, #78716c 86.47%)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: "7rem",
            letterSpacing: "-0.02em",
          }}
        >
          HackType
        </h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "SF Pro",
          data: sfPro,
        },
      ],
    },
  );
}