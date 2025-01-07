// src/utils/cropImage.ts

import { Area } from "react-easy-crop";

/**
 * Loads an image from a URL and returns an HTMLImageElement.
 * @param url - The image URL.
 * @returns A promise that resolves with the loaded image.
 */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // To avoid CORS issues
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.src = url;
  });

/**
 * Crops an image based on the specified area.
 * @param imageSrc - The source URL of the image.
 * @param crop - The area to crop.
 * @returns A promise that resolves with the cropped image as a Blob.
 */
export default async function getCroppedImg(
  imageSrc: string,
  crop: Area
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Canvas is empty"));
      }
    }, "image/png");
  });
}
