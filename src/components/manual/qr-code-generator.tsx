"use client";
import QrCode from "qrcode";
import { useEffect, useRef } from "react";

const LABEL_HEIGHT = 16;

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
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    const draw = async () => {
      const dpr = window.devicePixelRatio || 1;

      const totalHeight = size + LABEL_HEIGHT;

      canvas.style.width = `${size}px`;
      canvas.style.height = `${totalHeight}px`;
      canvas.width = size * dpr;
      canvas.height = totalHeight * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx || cancelled) return;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, size, totalHeight);

      const url = await QrCode.toDataURL(value, { width: size, margin: 1 });
      if (cancelled) return;

      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        ctx.drawImage(img, 0, 0, size, size);
        ctx.textAlign = "center";
        ctx.font = "500 10px ui-sans-serif";
        ctx.fillStyle = "#09090b";
        ctx.fillText(textContent, size / 2, size + LABEL_HEIGHT / 2 + 4, size);
      };
      img.src = url;
    };

    draw();
    window.addEventListener("resize", draw);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", draw);
    };
  }, [value, size, textContent]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size + LABEL_HEIGHT}
    />
  );
}
