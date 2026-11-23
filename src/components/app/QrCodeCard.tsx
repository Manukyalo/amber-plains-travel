"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Copy, Check, QrCode as QrIcon, Smartphone, Share2 } from "lucide-react";
import { qrService } from "@/services/qrService";

interface QrCodeCardProps {
  className?: string;
  showDownloads?: boolean;
}

export const QrCodeCard: React.FC<QrCodeCardProps> = ({
  className = "",
  showDownloads = true,
}) => {
  const [pngUrl, setPngUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const stableUrl = qrService.getStableAppUrl();

  useEffect(() => {
    let isMounted = true;
    qrService
      .generatePngDataUrl({
        width: 320,
        margin: 2,
        darkColor: "#0B0E0C",
        lightColor: "#FAF7F2",
      })
      .then((url) => {
        if (isMounted) setPngUrl(url);
      })
      .catch((err) => console.error("Error generating QR code", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(stableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleDownloadPng = () => {
    if (!pngUrl) return;
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = "Amber-Plains-Guest-App-QR.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSvg = async () => {
    try {
      const svgString = await qrService.generateSvgString({
        width: 600,
        margin: 2,
        darkColor: "#0B0E0C",
        lightColor: "#FAF7F2",
      });
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Amber-Plains-Guest-App-QR.svg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading SVG", err);
    }
  };

  return (
    <div
      className={`bg-safari-card border border-safari-border rounded-lg p-6 sm:p-8 flex flex-col items-center text-center max-w-sm mx-auto shadow-luxury ${className}`}
    >
      <div className="flex items-center gap-2 text-gold-400 text-xs font-mono uppercase tracking-widest mb-3">
        <QrIcon className="w-4 h-4" />
        <span>Scan or Download QR</span>
      </div>

      <h4 className="font-serif text-xl sm:text-2xl text-white font-normal mb-1">
        Official Guest App Pass
      </h4>
      <p className="text-xs text-safari-sand/70 font-light mb-6">
        Encodes the permanent company gateway. Zero personal or booking data is encoded.
      </p>

      {/* QR Code Canvas Frame */}
      <div className="relative p-4 bg-safari-cream rounded-md border-2 border-gold-400/50 shadow-md">
        {pngUrl ? (
          <Image
            src={pngUrl}
            alt="Amber Plains Guest Companion App official download QR code"
            width={200}
            height={200}
            className="w-48 h-48 rounded"
            priority
          />
        ) : (
          <div className="w-48 h-48 flex items-center justify-center text-safari-stone text-xs font-mono">
            Generating Secure QR...
          </div>
        )}
      </div>

      {/* Stable URL preview with copy button */}
      <div className="mt-5 w-full">
        <div className="flex items-center justify-between px-3 py-2 bg-safari-night rounded border border-safari-border text-[11px] font-mono text-safari-sand/80">
          <span className="truncate max-w-[200px]">{stableUrl}</span>
          <button
            onClick={handleCopyUrl}
            aria-label="Copy stable app download URL"
            className="text-gold-400 hover:text-gold-300 p-1 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Download Action Buttons for Print & Digital Collateral */}
      {showDownloads && (
        <div className="mt-6 pt-5 border-t border-safari-border/70 w-full flex flex-col gap-2">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleDownloadPng}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-safari-night hover:bg-safari-dark border border-safari-border text-white text-[11px] font-mono uppercase tracking-wider transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-gold-400" /> PNG Format
            </button>
            <button
              onClick={handleDownloadSvg}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-safari-night hover:bg-safari-dark border border-safari-border text-white text-[11px] font-mono uppercase tracking-wider transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-gold-400" /> Vector SVG
            </button>
          </div>
          <span className="text-[10px] text-safari-sand/50 font-mono">
            High-resolution vector for lodge folders & vehicle tags
          </span>
        </div>
      )}
    </div>
  );
};
