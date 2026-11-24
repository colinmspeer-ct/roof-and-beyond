"use client";

import { useState } from "react";
import { serviceOrder } from "@/content/brand";
import { servicePages } from "@/content/service-pages";
import { placeholders } from "@/content/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function EstimateForm() {
  const [note, setNote] = useState("");

  return (
    <form
      action={placeholders.formAction}
      method="post"
      data-form-placeholder="Replace this action with the HighLevel form embed or endpoint before launch."
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setNote(
          "Preview only. Nothing was sent. Replace the form action [HIGHLEVEL FORM EMBED] with the HighLevel embed before launch.",
        );
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" autoComplete="name" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            autoComplete="street-address"
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="service">Service</Label>
        <select
          id="service"
          name="service"
          required
          className="h-12 rounded-sm border border-line bg-white px-3 text-base text-ink focus-visible:ring-2 focus-visible:ring-orange"
          defaultValue=""
        >
          <option value="" disabled>
            Choose one
          </option>
          {serviceOrder.map((slug) => (
            <option key={slug} value={slug}>
              {servicePages[slug].label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required />
      </div>
      <p className="text-sm leading-6 text-muted">
        Preview form. The action is the placeholder {placeholders.formAction}.
        It will be replaced with a HighLevel form embed. Submitting here does
        not send your details anywhere.
      </p>
      <Button type="submit">Request my estimate</Button>
      {note ? (
        <p role="status" className="border border-orange bg-white p-3 text-sm text-navy">
          {note}
        </p>
      ) : null}
    </form>
  );
}
