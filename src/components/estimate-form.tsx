import Script from "next/script";

const FORM_ID = "KtuRLiuvWMHFDvbrpMrw";

/**
 * HighLevel "Roofing Services Registration" form, embedded inline.
 * This is the only form implementation on the site.
 */
export function EstimateForm({
  short = false,
  idPrefix = "estimate",
}: {
  short?: boolean;
  idPrefix?: string;
}) {
  return (
    <div id={idPrefix} className="w-full">
      <iframe
        src={`https://api.leadconnectorhq.com/widget/form/${FORM_ID}`}
        style={{ width: "100%", height: short ? "1100px" : "1689px", border: "none", borderRadius: "8px" }}
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
        loading="lazy"
      />
      <p className="mt-3 text-sm leading-7 text-slate-700">
        The optional checkboxes on the form are how you opt in to texts. Message
        frequency varies. Message and data rates may apply. Reply STOP to opt
        out, HELP for help. Consent is not a condition of purchase. See our{" "}
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
