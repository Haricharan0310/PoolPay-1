import { Html5Qrcode } from "html5-qrcode";

// Function to decode a QR code from an image data URL
const decodeQRCode = async (dataURL) => {
  const html5Qrcode = new Html5Qrcode();
  const qrCodeData = await html5Qrcode.scanFile(dataURL, true);

  if (qrCodeData) {
    return qrCodeData;
  } else {
    throw new Error("QR code not found or could not be decoded.");
  }
};

export { decodeQRCode };
