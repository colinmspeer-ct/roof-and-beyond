/**
 * PLACEHOLDERS — NEED COLIN'S INPUT.
 *
 * Each component below marks a spot the SEO rulebook or the layout calls for,
 * but which needs real business data we do not have. They render nothing so
 * no invented reviews, ratings, stats, videos, or map embeds reach production.
 * Fill in the data and replace `return null` with real markup.
 */

/** Google reviews with name, photo, date (rulebook: "Reviews on site"). Needs real reviews + permission. */
export function ReviewsPlaceholder(_props: { context?: string }) {
  // TODO(colin): supply real Google reviews (name, date, text) and the exact review link.
  return null;
}

/** Google Business Profile map embed for the footer (rulebook Local: "Embed your own GBP map"). */
export function GbpMapPlaceholder() {
  // TODO(colin): paste the GBP "Share > Embed a map" iframe src. Do not use a street address.
  return null;
}

/** Owner bio + on-the-job photo + Person schema (rulebook: "About page proves the owner"). */
export function OwnerBioPlaceholder() {
  // TODO(colin): owner name, licenses, training, memberships, sameAs profiles, real photo.
  return null;
}

/** On-page video with VideoObject schema and transcript (rulebook: "Video on page"). */
export function VideoPlaceholder(_props: { topic?: string }) {
  // TODO(colin): real job or explainer video URL + transcript.
  return null;
}

/** Social profile links (rulebook Local: "Link all social profiles from GBP and the site"). */
export function SocialLinksPlaceholder() {
  // TODO(colin): Facebook / Instagram / YouTube / GBP URLs.
  return null;
}

/** Insured/bonded status line for the footer (rulebook: "insured/bonded status in footer"). */
export function InsuranceStatusPlaceholder() {
  // TODO(colin): confirm insurance carrier/coverage wording before publishing anything.
  return null;
}
