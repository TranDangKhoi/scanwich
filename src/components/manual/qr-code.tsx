"use client";
import QrCode from "qrcode";
import { useEffect, useRef } from "react";

export default function QrCodeGenerator({ value }: { value: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;

    QrCode.toCanvas(canvasRef.current, value, { width: 90 }, (error) => {
      console.log(error);
    });
  }, [value, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      width={90}
      height={90}
    ></canvas>
  );
}
