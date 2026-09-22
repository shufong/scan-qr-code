#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const jsQR = require("./vendor/jsqr/jsQR.js");
const { PNG } = require("./vendor/pngjs");
const jpeg = require("./vendor/jpeg-js");

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_PIXELS = 40_000_000;

function fail(message, code = 1) {
  process.stderr.write(`Error: ${message}\n`);
  process.exit(code);
}

function isPng(buffer) {
  return (
    buffer.length >= 24 &&
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  );
}

function isJpeg(buffer) {
  return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
}

function assertDimensions(width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    fail("Image dimensions are invalid.");
  }
  if (width * height > MAX_PIXELS) {
    fail("Image exceeds the 40-megapixel safety limit.");
  }
}

function decodeImage(buffer) {
  if (isPng(buffer)) {
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    assertDimensions(width, height);
    return PNG.sync.read(buffer);
  }

  if (isJpeg(buffer)) {
    const image = jpeg.decode(buffer, {
      useTArray: true,
      formatAsRGBA: true,
      tolerantDecoding: true,
      maxResolutionInMP: 40,
      maxMemoryUsageInMB: 256,
    });
    assertDimensions(image.width, image.height);
    return image;
  }

  fail("Unsupported image format. Use a PNG, JPG, or JPEG file.");
}

const inputPath = process.argv[2];
if (!inputPath) {
  fail("Usage: node scripts/scan_qr.js <image-path>");
}

const resolvedPath = path.resolve(inputPath);
let stats;
try {
  stats = fs.statSync(resolvedPath);
} catch {
  fail(`File not found at ${resolvedPath}`);
}

if (!stats.isFile()) {
  fail(`Path is not a file: ${resolvedPath}`);
}
if (stats.size > MAX_FILE_BYTES) {
  fail("Image exceeds the 25 MiB file-size limit.");
}

let image;
try {
  image = decodeImage(fs.readFileSync(resolvedPath));
} catch (error) {
  fail(`Could not decode image: ${error instanceof Error ? error.message : String(error)}`);
}

const pixels = new Uint8ClampedArray(
  image.data.buffer,
  image.data.byteOffset,
  image.data.byteLength
);
const result = jsQR(pixels, image.width, image.height, { inversionAttempts: "attemptBoth" });

if (!result || typeof result.data !== "string" || result.data.length === 0) {
  fail("No readable QR code found in the image.", 2);
}

process.stdout.write(`${result.data.trim()}\n`);
