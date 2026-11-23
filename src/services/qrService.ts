import QRCode from "qrcode";

export interface QrCodeOptions {
  url?: string;
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

export const qrService = {
  /**
   * Returns the stable first-party download URL.
   * Never contains private guest data or temporary development URLs.
   */
  getStableAppUrl(): string {
    return process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL || "https://amberplains.co.ke/app";
  },

  /**
   * Generates a Data URL PNG representation of the QR code.
   */
  async generatePngDataUrl(options: QrCodeOptions = {}): Promise<string> {
    const targetUrl = options.url || this.getStableAppUrl();
    return QRCode.toDataURL(targetUrl, {
      width: options.width || 400,
      margin: options.margin ?? 2,
      color: {
        dark: options.darkColor || "#0B0E0C",
        light: options.lightColor || "#FAF7F2",
      },
      errorCorrectionLevel: "H", // High error correction allows physical print scuffs
    });
  },

  /**
   * Generates an SVG string representation of the QR code suitable for vector print.
   */
  async generateSvgString(options: QrCodeOptions = {}): Promise<string> {
    const targetUrl = options.url || this.getStableAppUrl();
    return QRCode.toString(targetUrl, {
      type: "svg",
      width: options.width || 400,
      margin: options.margin ?? 2,
      color: {
        dark: options.darkColor || "#0B0E0C",
        light: options.lightColor || "#FAF7F2",
      },
      errorCorrectionLevel: "H",
    });
  },
};
