import type { Town } from "@/lib/areas";

export const countyCopy: Record<
  Town["county"],
  { h1: string; metaTitle: string; metaDescription: string; paragraphs: string[] }
> = {
  lancaster: {
    h1: "Lancaster County houses, from brick rows to farm ridges",
    metaTitle: "Exterior work in Lancaster County, Pennsylvania",
    metaDescription:
      "Get a written estimate for roofing, roof repair, siding, windows, gutters, or gutter guards in Lancaster County, PA.",
    paragraphs: [
      "Lancaster County in this service area runs from the Susquehanna boroughs of Columbia and Marietta, through the brick city, out to Lititz and Ephrata, and south toward Quarryville. The housing changes that fast. Row houses share gutters and party walls. Moravian and market towns keep short, cut-up roofs. Farm valleys along routes 340, 23, and 30 carry long dwelling planes next to barns.",
      "Winter ice collects on shaded borough eaves. Open township lots take more wind at the rakes. Creek streets in places such as Ephrata and Christiana stay damp longer than hill streets in Akron or Terre Hill. Those are reasons to read the community page, not reasons to treat the county as one roof.",
      "Manheim Township and the borough of Manheim are different municipalities, and both names are written in the list below. The same is true of a village such as Reamstown, which sits in East Cocalico Township, and a borough such as Denver next door.",
    ],
  },
  chester: {
    h1: "Chester County, from the Main Line to the mushroom hills",
    metaTitle: "Exterior work in Chester County, Pennsylvania",
    metaDescription:
      "House exteriors in Chester County, including older boroughs, Main Line slate, Brandywine towns, and newer suburban tracts.",
    paragraphs: [
      "Chester County here includes the Main Line communities of Berwyn and Paoli, the county seat at West Chester, the Brandywine boroughs of Downingtown and Coatesville, the Schuylkill towns of Phoenixville and Spring City, and the southern boroughs around Kennett Square. Stone and slate still appear on older Main Line houses. Exton, Lionville, and Thorndale are mostly later suburban stock.",
      "The East Branch Brandywine and French Creek have flooded in living memory, including during the remnants of Hurricane Ida in 2021. This page does not assign depths. It does say that a low street in Downingtown or Phoenixville is a different exterior problem from a ridge lot in Elverson or Chester Springs.",
      "A borough page and a nearby village page are not interchangeable. Malvern borough is small even though the mailing name covers a wider area. Honey Brook borough is not the whole of Honey Brook Township.",
    ],
  },
  delaware: {
    h1: "Western Delaware County, not the whole county",
    metaTitle: "Exterior work in western Delaware County, Pennsylvania",
    metaDescription:
      "Roofs, walls, windows, and gutters for nine Delaware County communities, from Media and Radnor to Chadds Ford and Garnet Valley.",
    paragraphs: [
      "This Delaware County slice is the western communities only. It includes Media and Radnor, Chadds Ford and Thornton, Glen Mills, Chester Heights, Newtown Square, Aston, and the Garnet Valley name. It is not Upper Darby, not the city of Chester, and not the rest of the county.",
      "Media is a dense county-seat borough. Radnor Township includes Wayne and the Villanova campus, with older stone houses that often still carry slate. Aston is a postwar township. Garnet Valley is a school-district name, not a borough. Those distinctions are the point of the separate pages.",
      "Chadds Ford Township is in Delaware County even though the village name also touches Chester County. The page says so, and it does not pretend the Brandywine stops at a county line.",
    ],
  },
  york: {
    h1: "York County, city grid through northern suburbs",
    metaTitle: "Exterior work in York County, Pennsylvania",
    metaDescription:
      "House exterior estimates in York County, from the city and its townships to Hanover, Red Lion, and the southern boroughs.",
    paragraphs: [
      "York County coverage includes the city, the large townships around it, and the boroughs people actually name: Hanover, Red Lion, Dallastown, West York, Spring Grove, Dillsburg, Wrightsville, Lewisberry, Wellsville, and the southern towns along Interstate 83.",
      "York city is not York Township. Manchester borough is not Manchester Township, and neither is East Manchester Township. Hallam and Hellam are spelled differently because they are different places. Dover borough sits inside Dover Township and has its own page. Mixing those names sends a homeowner to the wrong housing stock.",
      "Codorus Creek runs through the city, and the Susquehanna bounds Wrightsville. Low streets in those places have a flood history that a Leader Heights split-level does not. The community pages keep that difference in the first paragraph.",
    ],
  },
  dauphin: {
    h1: "Roofs and exterior drainage in Dauphin County",
    metaTitle: "Roofing and exterior work in Dauphin County, Pennsylvania",
    metaDescription: "Request a free roofing, siding, window, or gutter estimate in Dauphin County, PA, from Harrisburg and Hershey to Millersburg.",
    paragraphs: [
      "A storm inspection in Harrisburg might begin at a shared masonry wall. After the June 2024 Millersburg downburst, the exposed roof edge and nearby tree strikes are natural places to start. NOAA’s storm records describe particular events and locations. The community pages pair those records with practical inspection guidance.",
      "Dauphin County’s hazard plan records heavy snow in Hummelstown, Middletown, and Millersburg in February 2024. Tell us where snow collects against a lower roof or porch. Drainage and flashing in that spot can be part of a free written estimate.",
      "The Hershey page uses the Census community boundary. The Derry Township page covers the municipality and uses township-wide estimates. If a project changes framing or visible exterior materials, look up the parcel jurisdiction before contacting the building office.",
    ],
  },
  cumberland: {
    h1: "Cumberland Valley roofs, walls, and drainage",
    metaTitle: "Roofing and exterior work in Cumberland County, Pennsylvania",
    metaDescription:
      "Get a written estimate for roofing, roof repair, siding, windows, gutters, or gutter guards in Cumberland County, PA.",
    paragraphs: [
      "Cumberland County runs from the West Shore of the Susquehanna through Carlisle and west to Shippensburg. A porch roof on a compact West Shore lot can raise different access and drainage questions from a long eave facing open land. Look at where the water goes after it leaves the roof as well as what happens on the slope itself.",
      "On the South Mountain side, start your estimate with a view of the eaves and the grade around the house. In a borough, show where a wall, porch or downspout comes close to the next property. That gives the estimator a way to describe each transition or outlet in writing.",
      "The directory covers the county’s 33 municipalities and includes separate entries for Boiling Springs in South Middleton Township and Enola in East Pennsboro Township. The Shippensburg Borough entry covers the Cumberland County portion. Use the municipality for permit questions, since a mailing name can cover more than one local government.",
    ],
  },
};
