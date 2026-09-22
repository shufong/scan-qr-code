# Third-party notices

This repository vendors the minimum runtime files needed for offline QR decoding:

| Component | Version | License | Source |
| --- | --- | --- | --- |
| jsQR | 1.4.0 | Apache-2.0 | <https://github.com/cozmo/jsQR> |
| pngjs | 7.0.0 | MIT | <https://github.com/pngjs/pngjs> |
| jpeg-js | 0.4.4 | BSD-3-Clause | <https://github.com/eugeneware/jpeg-js> |

The corresponding license texts are included beside each vendored component in `scripts/vendor/`.

The vendored `jpeg-js` decoder has one deliberate modification: its unused browser-only `XMLHttpRequest` loader was removed. Local in-memory JPEG decoding is unchanged.
