# Roof & Beyond Home Solutions

Marketing site for **Roof & Beyond Home Solutions**, the DBA of **Pro Tech Brands LLC**. Phone (717) 804-0990, email colin@roofnbeyond.com, hours 9 AM to 8 PM every day, location Media, PA 19063. PA HIC #PA240642 is held by Pro Tech Brands LLC. This repository does not change DNS.

## Launch build

`launch.json` sets `includeTownPages` to `false`. The static export then keeps the home page, six service pages, about, contact, privacy, terms, and one page per county. Town names are plain text on the county pages. Town page source stays in the repo. Set the flag to `true` and rebuild to publish those pages again.

GitHub Pages: `npm run build` writes `out/` with `CNAME` (`roofnbeyond.com`) and `.nojekyll`. There is no `basePath`. `.github/workflows/pages.yml` deploys that folder when `main` is pushed.

## Preview locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:4177](http://127.0.0.1:4177).

A static export is written to `out/` by:

```bash
npm run build
```

## Checks

```bash
npm run build
npm run check:duplicates
npm run check:remedi
npm run check:links
```

`check:remedi` compares every built page with the visible text of remedipestcontrol.com (cached under `scripts/.cache/`, not committed). It fails if any page shares an 8-word sentence or an 8-word shingle with that site, and it prints the maximum overlap score.

`check:duplicates` compares the unique article text of our own pages and fails on a repeated 12-word sequence or a 6-word Jaccard score above 0.20.

## Publish

`npm run build` writes `out/` with `CNAME` and `.nojekyll`. GitHub Actions (`.github/workflows/pages.yml`) uploads that folder to GitHub Pages. There is no `basePath`. DNS is not changed by this repository.

The estimate form posts to FormSubmit at `colin@roofnbeyond.com`. The first submission asks that inbox to confirm the address. Swap `src/components/estimate-form.tsx` for a HighLevel embed later.

## Scope

Six services: roofing, roof repair, siding, windows, gutters, and gutter guards.

Communities: the Lancaster, Chester, and Delaware lists (61 places) plus 33 York County municipalities. URLs live under `/where-we-work/`, not under a `/service-areas/` pattern.
