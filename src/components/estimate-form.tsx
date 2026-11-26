import Script from "next/script";

const FORM_ID = "KtuRLiuvWMHFDvbrpMrw";

/**
 * HighLevel "Roofing Services Registration" form, embedded inline.
 * This is the only form implementation on the site.
 */
export function EstimateForm({
  short = false,
  idPrefix = "estimate",
  contained = false,
  eager = false,
}: {
  short?: boolean;
  idPrefix?: string;
  /** Cap the visible height on desktop (hero card) and let the form scroll inside. */
  contained?: boolean;
  /** Above-the-fold copies load right away; lower copies stay lazy. */
  eager?: boolean;
}) {
  return (
    <div id={idPrefix} className="w-full">
      <div
        className={
          contained
            ? "relative min-h-[22rem] overflow-hidden rounded-lg border border-line bg-paper lg:max-h-[30rem] lg:overflow-y-auto"
            : "relative min-h-[22rem] overflow-hidden rounded-lg border border-line bg-paper"
        }
      >
      {/* Shown until HighLevel's embed script reveals the iframe. */}
      <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center text-sm leading-6 text-muted">
        Loading the estimate form…
        <br />
        If it does not appear, call{" "}
        <a className="font-bold text-navy underline" href="tel:+17178040990">
          (717) 804-0990
        </a>
        .
      </p>
      <iframe
        src={`https://api.leadconnectorhq.com/widget/form/${FORM_ID}`}
        style={{ width: "100%", height: short ? "1100px" : "1689px", border: "none", borderRadius: "8px" }}
        className="relative z-10 block bg-white"
        id={`inline-${FORM_ID}`}
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="Roofing Services Registration"
        data-height="1689"
        data-layout-iframe-id={`inline-${FORM_ID}`}
        data-form-id={FORM_ID}
        title="Roofing Services Registration"
        loading={eager ? "eager" : "lazy"}
      />
      </div>
      <p className="mt-3 text-xs leading-6 text-muted">
        Texts are opt-in through the optional checkboxes on the form. How often
        we text depends on your estimate. Message and data rates may apply.
        Text STOP to end messages or HELP for help. You do not have to agree to
        texts to get an estimate or buy anything. See our{" "}
        <a className="underline" href="/privacy/">
          Privacy
        </a>{" "}
        and{" "}
        <a className="underline" href="/terms/">
          Terms
        </a>
        .
      </p>
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
    </div>
  );
}
