import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — ALOX" },
      { name: "description", content: "Choose a new password for your ALOX account." },
      { property: "og:title", content: "Set a new password — ALOX" },
      { property: "og:description", content: "Choose a new password for your ALOX account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Reset,
});

function Reset() {
  const [pw, setPw] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return setError("Password must be at least 8 characters.");
    setState("busy"); setError("");
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) { setError(error.message); setState("idle"); } else setState("done");
  };
  return (
    <section className="container-lux max-w-xl pb-36 pt-44">
      <h1 className="display text-5xl">Set a new password.</h1>
      {state === "done" ? (
        <div className="mt-10"><p>Your password has been updated.</p><Link to="/account" className="btn-solid mt-8">Go to your account</Link></div>
      ) : (
        <form onSubmit={submit} className="mt-10 space-y-8">
          <label className="block"><span className="eyebrow text-muted-foreground">New password</span>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" className="field" /></label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button disabled={state === "busy"} className="btn-solid">Update Password</button>
        </form>
      )}
    </section>
  );
}
