import Link from "next/link";
import { brand, serviceOrder } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Launch form posts to FormSubmit. Swap this component for the HighLevel embed
 * when that form is ready. Do not add a second form implementation beside it.
 */
export function EstimateForm({
  short = false,
  idPrefix = "estimate",
}: {
  short?: boolean;
  idPrefix?: string;
}) {
  const field = (name: string) => `${idPrefix}-${name}`;

  return (
    <form
      id={idPrefix}
      action={`https://formsubmit.co/${brand.email}`}
      method="POST"
      className="grid gap-4"
    >
      <input type="hidden" name="_subject" value="Estimate request from roofnbeyond.com" />
      <input type="hidden" name="_next" value={`${brand.url}/thank-you/`} />
      <input type="hidden" name="_captcha" value="true" />
      <input type="hidden" name="_template" value="table" />
      <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className={short ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="grid gap-2">
          <Label htmlFor={field("name")}>Name</Label>
          <Input id={field("name")} name="name" autoComplete="name" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={field("phone")}>Phone</Label>
          <Input id={field("phone")} name="phone" type="tel" autoComplete="tel" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={field("email")}>Email</Label>
          <Input id={field("email")} name="email" type="email" autoComplete="email" required />
        </div>
        {short ? null : (
          <div className="grid gap-2">
            <Label htmlFor={field("address")}>Property address</Label>
            <Input id={field("address")} name="address" autoComplete="street-address" required />
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor={field("service")}>Service</Label>
        <select
          id={field("service")}
          name="service"
          required
          className="h-12 rounded-sm border border-line bg-white px-3 text-base text-ink focus-visible:ring-2 focus-visible:ring-orange"
          defaultValue=""
        >
          <option value="" disabled>
            Choose one
          </option>
          {serviceOrder.map((slug) => (
            <option key={slug} value={servicePages[slug].label}>
              {servicePages[slug].label}
            </option>
          ))}
        </select>
      </div>
      {short ? null : (
        <div className="grid gap-2">
          <Label htmlFor={field("message")}>Message</Label>
          <Textarea id={field("message")} name="message" required />
        </div>
      )}
      <div className="flex items-start gap-3">
        <input
          id={field("sms")}
          name="sms_consent"
          type="checkbox"
          value="yes"
          className="mt-1 size-4 accent-[#021F4D]"
        />
        <label htmlFor={field("sms")} className="text-sm leading-6 text-muted">
          By checking this box, you agree to receive text messages from Roof &
          Beyond Home Solutions about your inquiry. Message and data rates may
          apply. Message frequency varies. Reply STOP to opt out, HELP for help.
          Consent is not a condition of purchase. See the{" "}
          <Link href="/privacy/" className="underline">
            privacy
          </Link>{" "}
          and{" "}
          <Link href="/terms/" className="underline">
            terms
          </Link>
          .
        </label>
      </div>
      <p className="text-sm leading-6 text-muted">Ask about financing options.</p>
      <Button type="submit">Request my estimate</Button>
    </form>
  );
}
