import type { ServiceSlug } from "@/content/brand";

export type ServicePage = {
  slug: ServiceSlug;
  label: string;
  nav: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lede: string;
  paragraphs: string[];
  faqs: { q: string; a: string }[];
  image: { src: string; alt: string; width: number; height: number };
};

export const servicePages: Record<ServiceSlug, ServicePage> = {
  roofing: {
    slug: "roofing",
    label: "Roofing",
    nav: "Roofing",
    metaTitle: "House roofing in Lancaster, Chester, Delaware, York, and Cumberland counties",
    metaDescription:
      "Full roof replacements for houses across five Pennsylvania counties, with ventilation, decking, and edge metal called out in the written estimate.",
    h1: "A new roof starts with the roof that is already there",
    lede: "Roofing, on this site, means a full covering: the field, the edges, the penetrations, and the way the attic breathes. It is a different conversation from a leak repair.",
    paragraphs: [
      "Houses in these five counties do not share one roof. Lancaster city rows, Main Line slate, York split-levels, and farmhouses on open ground each shed water differently. A replacement is priced from the slope in front of the crew, including whether the deck is boards or panels and whether the soffit can feed a ridge vent.",
      "Asphalt is the common covering on later houses. Metal shows up on farmhouses and some porches. Older slate still sits on parts of the Main Line and on some borough streets. Those are different materials. The estimate names the covering proposed for that house.",
      "Edge metal, chimney flashing, and pipe boots are part of a roof, not extras discovered after tear-off, when they are visible at the visit. If a valley has been coated over and over, the deck under it is inspected before the new field goes down. Closed soffits are not paired with a vented ridge that has no intake.",
      "Storm photos can document what a slope looks like after wind or hail. They do not decide whether an insurer pays a claim. This page does not state a warranty.",
    ],
    faqs: [
      {
        q: "Is a full roof the same visit as a leak repair?",
        a: "No. Roofing here means replacing the covering on the slopes that are in the scope. Roof repair is the localized page for flashing, boots, and a few courses. The estimate says which one it is.",
      },
      {
        q: "Do you publish a shingle brand on this page?",
        a: "No. The written estimate names the covering proposed for that house. This page does not list brands.",
      },
      {
        q: "Does this page state a roof warranty?",
        a: "No. Any warranty that applies would be written on that house's estimate, not advertised here.",
      },
    ],
    image: {
      src: "/images/shingles.webp",
      alt: "Close view of gray architectural asphalt shingles.",
      width: 960,
      height: 640,
    },
  },
  "roof-repair": {
    slug: "roof-repair",
    label: "Roof repair",
    nav: "Roof repair",
    metaTitle: "Roof leak repair for houses in five Pennsylvania counties",
    metaDescription:
      "Localized roof repairs for flashing, pipe boots, and damaged courses, with a clear line between a patch and a full replacement.",
    h1: "A leak has an address on the roof, not just a stain on the ceiling",
    lede: "Roof repair is for a joint, a boot, a few courses, or an edge that wind opened. It is not a smaller word for a full replacement.",
    paragraphs: [
      "Ceiling stains usually start at a transition: a chimney shoulder, a sidewall, a valley, a skylight curb, or a rubber boot that has split. The field around that spot can still be flexible. In that case the work is the metal and the courses that have to come up to reset it.",
      "Tear-off becomes the honest scope when the deck is soft, the surface is bald across the plane, or the same slope has been patched until the laps no longer shed. One dripping corner does not, by itself, condemn the other slopes. The visit should say which condition was found.",
      "Row houses and twins share party walls, so a repair on one side can meet a neighbor's flashing. Farm porches dump onto a main wall. Split-level garages create valleys that a simple ranch does not have. Those details change the repair. They are written per house, on the community pages, rather than as one regional slogan.",
      "Active leaks can be photographed for the homeowner. That record is not an insurance decision. This page does not advertise a lifetime repair claim.",
    ],
    faqs: [
      {
        q: "When is a patch the wrong scope?",
        a: "When the sheathing gives underfoot, the granules are gone across the plane, or the laps no longer shed water. A single flashing leak on a sound field is a different job.",
      },
      {
        q: "Can you document storm damage?",
        a: "A visit can photograph and describe what is on the roof and can produce a written estimate. It does not decide whether a carrier pays a claim.",
      },
      {
        q: "Do repairs include the gutter?",
        a: "Only if the estimate says so. Water that overshoots a gutter can look like a roof leak. The two are priced as the assemblies they are.",
      },
    ],
    image: {
      src: "/images/shingles.webp",
      alt: "Gray asphalt shingles with a few pine needles in the laps.",
      width: 960,
      height: 640,
    },
  },
  siding: {
    slug: "siding",
    label: "Siding",
    nav: "Siding",
    metaTitle: "House siding repair and replacement in five Pennsylvania counties",
    metaDescription:
      "Siding work for vinyl, wood, and fiber cement, with masonry left as masonry unless the estimate says otherwise.",
    h1: "Wall cladding only works if the water in front of it is solved",
    lede: "Siding is the skin of the wall. It is not a wrap for every material, and it is not a substitute for a gutter that misses the wall.",
    paragraphs: [
      "Vinyl, wood, fiber cement, and older aluminum all show up in this region. Brick and stone are a different assembly. Covering sound masonry because a neighboring frame wall needs paint is the wrong scope. The estimate names the material on each elevation.",
      "Vinyl that buckles was often pinned too tight or butted into a receiver with no room to move in summer. Fiber cement that stains at the first course is often splash from a short downspout or soil piled against the wall. Wood that is soft gets opened and dried before a new layer goes over it. A new layer on wet boards traps the problem.",
      "Where a roof meets a wall, kickout flashing is what keeps water from running behind the cladding. Replacing the siding and leaving that joint open recreates the stain. Row-house party walls and farmhouse brick gables stay out of a vinyl count unless the scope explicitly includes a different repair there.",
      "The estimate names the cladding material for each elevation. This page does not list product brands.",
    ],
    faqs: [
      {
        q: "Will you cover brick with vinyl?",
        a: "Not as a default. Sound brick and stone stay masonry. A frame wall that is rotten is a different repair from a brick front on the same house.",
      },
      {
        q: "Does new siding fix a leak at a window?",
        a: "Only if the head flashing and the sill are part of the scope. New panels over a failed window joint hide the water.",
      },
      {
        q: "Are barns and stores included?",
        a: "A house estimate covers the dwelling walls that were measured. Barns, storefronts, and apartment panels are separate assemblies.",
      },
    ],
    image: {
      src: "/images/row-houses.webp",
      alt: "A row of light-colored clapboard houses along a city street.",
      width: 900,
      height: 967,
    },
  },
  windows: {
    slug: "windows",
    label: "Windows",
    nav: "Windows",
    metaTitle: "Replacement windows for Pennsylvania houses",
    metaDescription:
      "Window repair and replacement that lists each opening, separates inserts from full frames, and does not promise an energy-savings percentage.",
    h1: "Each opening is its own line, not a whole-house guess",
    lede: "Windows on these houses are a mix of wood sash, vinyl inserts, and later full-frame units. The useful estimate says which openings are in the work.",
    paragraphs: [
      "A pocket insert is a fair product when the frame and the sill are solid. It is the wrong product when the sill is soft, because the new sash then sits on rot. A full frame is a different opening, a different flashing detail, and often a different look from the sidewalk. Street-facing sash on a narrow borough lot changes the front more than a rear bath window.",
      "Fog between panes is a failed seal in that insulated unit. It is not proof that every window on the elevation has failed. Storm sash that still latches can stay. Balances, locks, and weatherstripping are smaller repairs when the frame is sound.",
      "This page does not state a percentage of heating or cooling savings. That number depends on the house, the unit, and the install, and it is not known in the abstract. If a borough or township requires a permit for a frame change, that step is part of planning the job.",
      "Historic-looking streets in Lititz, West Chester, Marietta, Media, and similar boroughs care about what faces the sidewalk. The estimate can leave a sound street sash in place and replace a failed rear unit.",
    ],
    faqs: [
      {
        q: "Do you quote every window by default?",
        a: "No. The openings that are failing, or that the owner asked to change, are the ones on the list.",
      },
      {
        q: "What does fogged glass mean?",
        a: "The seal in that insulated pane has failed. It is a glass condition, not automatically a full-frame replacement.",
      },
      {
        q: "Will new windows cut the heating bill by a set amount?",
        a: "No percentage is published here. A savings claim would be a guess, and this site does not guess.",
      },
    ],
    image: {
      src: "/images/window-detail.webp",
      alt: "A close view of a light-colored window frame, muntin, and screen.",
      width: 1000,
      height: 750,
    },
  },
  gutters: {
    slug: "gutters",
    label: "Gutters",
    nav: "Gutters",
    metaTitle: "Gutters and downspouts for houses in five Pennsylvania counties",
    metaDescription:
      "Gutter replacement and repair focused on pitch, outlets, and where the downspout actually discharges.",
    h1: "A gutter is doing its job only if the water leaves the foundation",
    lede: "Troughs, hangers, and downspouts are one assembly. A clean gutter that dumps at the wall is still a problem.",
    paragraphs: [
      "K-style troughs are common on later houses. Half-round still appears on some older eaves. The profile on the house is what gets priced. A long ranch eave moves a lot of water to two outlets. A short borough gable fails first at the inside corner. Those are different layouts.",
      "Pitch that was never set lets the high end stay dry while the low end overflows. Hangers pull out of fascia that has softened. The quote calls out the fascia board when it will not hold a fastener. Downspout extensions matter on narrow side yards, sloped driveways, and creek-side streets where the grade already runs toward the basement.",
      "Gutters also protect the wall and the first course of siding. Overflow that sheets behind the cladding shows up as a wall stain that looks like a siding failure. Fixing only the panels leaves the water where it was.",
      "Gutter guards are a separate service. A new trough does not include a cover unless the estimate says so.",
    ],
    faqs: [
      {
        q: "Is cleaning the same as a gutter replacement?",
        a: "No. Cleaning removes debris. Replacement or repair addresses pitch, hangers, outlets, fascia, and where the leader discharges.",
      },
      {
        q: "Do downspouts get included?",
        a: "They are part of the assembly when they are on the estimate. An outlet that ends at the foundation is called out, not ignored.",
      },
      {
        q: "Are gutter covers included automatically?",
        a: "No. Covers are scoped on the gutter-guard page and only when they fit the debris and the profile.",
      },
    ],
    image: {
      src: "/images/gutter-rain.webp",
      alt: "Rain running into a white gutter during a storm.",
      width: 1000,
      height: 750,
    },
  },
  "gutter-guards": {
    slug: "gutter-guards",
    label: "Gutter guards",
    nav: "Gutter guards",
    metaTitle: "Gutter guards matched to local trees and gutter profiles",
    metaDescription:
      "Gutter covers chosen for the debris on that eave. They change maintenance. They do not end it.",
    h1: "A gutter cover has to pass the debris that actually falls here",
    lede: "Guards are not a promise that a trough will never be touched again. They change what gets in, and they fail when the mesh and the trees do not match.",
    paragraphs: [
      "Maple seeds, oak leaves, pine needles, sycamore pods, and open-field dust each clog a different product. A fine screen under a sycamore can mat and send water over the lip. A cover meant for a woods lot can be a poor fit on a windy hill where the load is grit. The estimate names the trees and the gutter profile on that house.",
      "Barn eaves, half-round on an older porch, and a K-style run on a ranch are not interchangeable. A residential cover is not assumed on a low commercial roof or a metal barn. Outlets can still plug after a cover is installed. Someone still looks at them after leaf drop.",
      "This page will not say a guard is maintenance-free, lifetime, or clog-proof. It also does not list cover brands.",
      "If the existing trough is pitched wrong or the fascia is soft, a cover on top of that failure does not fix it. The gutter itself is repaired or replaced first, then a cover is added only where it fits.",
    ],
    faqs: [
      {
        q: "Will guards mean the gutters never need attention?",
        a: "No. They reduce what enters. Outlets, corners, and heavy seed years still need a look.",
      },
      {
        q: "Can every gutter take the same cover?",
        a: "No. Profile, pitch, and the debris from the trees on that lot decide whether a cover belongs there.",
      },
      {
        q: "Which cover brands does this page list?",
        a: "None. The estimate, if a cover is included, names what is being proposed for that gutter.",
      },
    ],
    image: {
      src: "/images/gutter-rain.webp",
      alt: "An open white gutter collecting rain, with no cover installed.",
      width: 1000,
      height: 750,
    },
  },
};
