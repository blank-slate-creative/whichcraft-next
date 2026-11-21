# Bricolage Grotesque (display face)

`BricolageGrotesque-latin-display.woff2` is the headline font for whichcraft.beer, loaded by
`app/layout.tsx` with `next/font/local`, so it is served from this site and no request goes to a font host.

- **Licence:** SIL Open Font License 1.1, in `OFL.txt` beside it. Copyright 2022 The Bricolage Grotesque Project
  Authors (https://github.com/ateliertriay/bricolage). The font is bundled with its licence and is not sold on its own.
- **Source:** the Latin variable file in the npm package `@fontsource-variable/bricolage-grotesque` 5.3.0
  (`files/bricolage-grotesque-latin-standard-normal.woff2`).
- **What was changed, to keep the page light (131 KB to 59 KB):** the width axis is pinned at 88% (the brand guide's
  "about 88% width"), the weight axis is limited to 700-800, and the optical-size axis is kept (limited to 14-96).
  Made with `fonttools varLib.instancer INPUT wdth=88 wght=700:800 opsz=14:96`, then saved as WOFF2.
- Body text is the system font and needs no file.
