export function FactKey({ countyWeather = false }: { countyWeather?: boolean }) {
  return (
    <aside className="rounded-2xl border border-line bg-paper p-5 text-sm leading-6 text-muted" aria-label="How to read the local figures">
      <h2 className="text-lg text-navy">How to read the local figures</h2>
      <p className="mt-2">
        The housing estimates come from the Census Bureau’s 2020–2024 American
        Community Survey. Construction years describe the buildings themselves.
      </p>
      <p className="mt-2">
        {countyWeather
          ? "Cumberland County’s hazard mitigation plan describes regional weather events."
          : "NOAA’s records describe individual storm events from 2004 through 2025."}{" "}
        Ask your municipality which permit or historic district requirements
        apply to your project.
      </p>
    </aside>
  );
}
