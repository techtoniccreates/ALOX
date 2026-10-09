import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { contact } from "@/lib/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Contact — ALOX" },
      { name: "description", content: "Get in touch with ALOX client care for orders, shipping, returns and private appointments." },
      { property: "og:title", content: "Contact — ALOX" },
      { property: "og:description", content: "Get in touch with ALOX client care." },
    ],
  }),
  component: Contact,
});

type F = { name: string; email: string; subject: string; message: string };

function Contact() {
  const [f, setF] = useState<F>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<F>>({});
  const [state, setState] = useState<"idle" | "busy" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Partial<F> = {};
    if (!f.name.trim()) er.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Please enter a valid email.";
    if (!f.subject.trim()) er.subject = "Please add a subject.";
    if (f.message.trim().length < 10) er.message = "Please write at least 10 characters.";
    setErrors(er);
    if (Object.keys(er).length) return;
    setState("busy");
    const { error } = await supabase.from("contact_messages").insert({
      name: f.name.trim().slice(0, 120), email: f.email.trim().slice(0, 255), subject: f.subject.trim().slice(0, 200), message: f.message.trim().slice(0, 5000),
    });
    setState(error ? "error" : "sent");
  };

  const field = (k: keyof F, label: string, multiline = false) => (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      {multiline ? (
        <textarea rows={5} maxLength={5000} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="field resize-none" aria-invalid={!!errors[k]} />
      ) : (
        <input value={f[k]} maxLength={k === "email" ? 255 : 200} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="field" aria-invalid={!!errors[k]} type={k === "email" ? "email" : "text"} />
      )}
      {errors[k] && <span className="mt-2 block text-xs text-destructive">{errors[k]}</span>}
    </label>
  );

  const details: [string, React.ReactNode][] = [
    ["Email", <a href={`mailto:${contact.email}`} className="link-line">{contact.email}</a>],
    ["Phone", <a href={`tel:${contact.phoneHref}`} className="link-line">{contact.phone}</a>],
    ["Atelier", contact.address],
    ["Hours", contact.hours],
    ["Social", <span className="flex flex-wrap gap-x-4"><a href={contact.instagram.url} target="_blank" rel="noopener noreferrer" className="link-line">Instagram {contact.instagram.handle}</a><a href={contact.pinterest.url} target="_blank" rel="noopener noreferrer" className="link-line">Pinterest</a><a href={contact.x.url} target="_blank" rel="noopener noreferrer" className="link-line">X</a></span>],
  ];

  return (
    <section className="container-lux grid gap-16 pb-24 pt-32 md:grid-cols-12 md:pb-36 md:pt-44">
      <div className="md:col-span-5">
        <p className="eyebrow text-gold">Contact</p>
        <h1 className="display animate-rise mt-6 text-5xl md:text-7xl">We'd love to hear from you.</h1>
        <dl className="mt-16 space-y-8 text-sm">
          {details.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[7rem_1fr] border-t pt-4">
              <dt className="eyebrow text-muted-foreground">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="md:col-span-6 md:col-start-7">
        {state === "sent" ? (
          <div className="animate-fade border-t pt-10">
            <p className="display text-4xl">Thank you, {f.name.split(" ")[0]}.</p>
            <p className="mt-4 text-muted-foreground">Your message has reached our client care team. We'll reply to {f.email} shortly.</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-10">
            <div className="grid gap-10 sm:grid-cols-2">{field("name", "Name")}{field("email", "Email")}</div>
            {field("subject", "Subject")}
            {field("message", "Message", true)}
            {state === "error" && <p className="text-sm text-destructive">Your message couldn't be sent. Please try again, or email us directly.</p>}
            <button disabled={state === "busy"} className="btn-solid w-full sm:w-auto">{state === "busy" ? "Sending…" : "Send Message"}</button>
          </form>
        )}
      </div>
    </section>
  );
}
