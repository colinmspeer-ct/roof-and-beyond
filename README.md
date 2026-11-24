# Roof & Beyond Home Solutions

Preview marketing site for **Roof & Beyond Home Solutions**, the DBA of **Pro Tech Brands LLC**. The domain roofnbeyond.com is not live. This project does not deploy the site and does not change DNS.

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

## Placeholders the owner must fill

- `[PHONE]`
- `[EMAIL]`
- `[BUSINESS ADDRESS]`
- `[BUSINESS HOURS]`
- `[PA HIC #]`
- `[FEATURED MANUFACTURERS]`
- `[WARRANTY TERMS]`
- `[SMS CONSENT LANGUAGE]` on the privacy and terms pages
- `[HIGHLEVEL FORM EMBED]` as the estimate form action

Do not publish ratings, years in business, awards, or warranty language until those facts exist.

## Scope

Six services: roofing, roof repair, siding, windows, gutters, and gutter guards.

Communities: the Lancaster, Chester, and Delaware lists (61 places) plus 33 York County municipalities. URLs live under `/where-we-work/`, not under a `/service-areas/` pattern.
