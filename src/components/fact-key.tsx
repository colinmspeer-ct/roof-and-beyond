export function FactKey() {
  return (
    <aside className="rounded-2xl border border-line bg-paper p-5 text-sm leading-6 text-muted" aria-label="How to read the local figures">
      <h2 className="text-lg text-navy">How to read the local figures</h2>
      <p className="mt-2">
        Old share is the percent of housing units built in 1939 or earlier.
        Newer share is the percent built from 1990 onward. Detached share and
        attached share come from the same ACS 2024 5-year table. The year is
        the year the building went up, not the age of the roof.
      </p>
      <p className="mt-2">
        Hail, flood, and wind lines are from NOAA storm reports for 2004 through
        2025. Register match means a National Register historic district was
        matched to this place. It is not a local permit and not a homeowners
        association. No permit fee is guessed here.
      </p>
    </aside>
  );
}
