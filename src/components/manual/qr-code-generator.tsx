"use client";
import QrCode from "qrcode";
import { useEffect, useRef } from "react";

export default function QrCodeGenerator({
  value,
  size = 90,
  textContent = "",
}: {
  value: string;
  size?: number;
  textContent?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const dpr = window.devicePixelRatio || 1;

    const canvasWithLabel = canvasRef.current;
    canvasWithLabel.style.width = `${size}px`;
    canvasWithLabel.style.height = `${size}px`;

    canvasWithLabel.width = size * dpr;
    canvasWithLabel.height = size * dpr;
    // Let's start the canvas retouch
    const ctx = canvasWithLabel.getContext("2d");

    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvasWithLabel.width, canvasWithLabel.width);
      ctx.textAlign = "center";
      ctx.font = "500 12px ui-sans-serif";
      ctx.fillStyle = "#09090b";
      ctx.fillText(textContent, canvasWithLabel.width / 2, canvasWithLabel.width - 10, canvasWithLabel.width);
    }

    // QrCode.toCanvas(canvasRef.current, value, { width }, (error) => {
    //   console.log(error);
    // });
  }, [value, canvasRef, size, textContent]);

  return (
    <canvas
      ref={canvasRef}
      width={90}
      height={90}
    ></canvas>
  );
}
