import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
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
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Partial<F> = {};
    if (!f.name.trim()) er.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Please enter a valid email.";
    if (!f.subject.trim()) er.subject = "Please add a subject.";
    if (f.message.trim().length < 10) er.message = "Please write at least 10 characters.";
    setErrors(er);
    if (!Object.keys(er).length) setSent(true);
  };

  const field = (k: keyof F, label: string, multiline = false) => (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      {multiline ? (
        <textarea rows={5} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="field resize-none" aria-invalid={!!errors[k]} />
      ) : (
        <input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="field" aria-invalid={!!errors[k]} type={k === "email" ? "email" : "text"} />
      )}
      {errors[k] && <span className="mt-2 block text-xs text-destructive">{errors[k]}</span>}
    </label>
  );

  return (
    <section className="container-lux grid gap-16 pb-24 pt-32 md:grid-cols-12 md:pb-36 md:pt-44">
      <div className="md:col-span-5">
        <p className="eyebrow text-gold">Contact</p>
        <h1 className="display animate-rise mt-6 text-5xl md:text-7xl">We'd love to hear from you.</h1>
        <dl className="mt-16 space-y-8 text-sm">
          {[
            ["Email", "clientcare@alox.example"],
            ["Phone", "+44 20 0000 0000"],
            ["Location", "Atelier ALOX, Marylebone, London"],
            ["Social", "Instagram · Pinterest · X"],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[7rem_1fr] border-t pt-4">
              <dt className="eyebrow text-muted-foreground">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="md:col-span-6 md:col-start-7">
        {sent ? (
          <div className="animate-fade border-t pt-10">
            <p className="display text-4xl">Thank you, {f.name.split(" ")[0]}.</p>
            <p className="mt-4 text-muted-foreground">Your message has been received. This is a portfolio demo, so no email was actually sent.</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-10">
            <div className="grid gap-10 sm:grid-cols-2">{field("name", "Name")}{field("email", "Email")}</div>
            {field("subject", "Subject")}
            {field("message", "Message", true)}
            <button className="btn-solid w-full sm:w-auto">Send Message</button>
          </form>
        )}
      </div>
    </section>
  );
}
