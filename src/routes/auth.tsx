import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { safeRedirect, useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import look1 from "@/assets/look-1.jpg";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string | undefined; mode?: "signin" | "signup" | undefined } => ({
    redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined,
    mode: s["mode"] === "signup" ? "signup" : s["mode"] === "signin" ? "signin" : undefined,
  }),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Sign in — ALOX" },
      { name: "description", content: "Sign in or create your ALOX account to check out, track orders and save your wishlist." },
      { property: "og:title", content: "Sign in — ALOX" },
      { property: "og:description", content: "Sign in or create your ALOX account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const REDIRECT_KEY = "alox-post-auth";

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(search.mode ?? "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const target = safeRedirect(search.redirect);

  // Once a session exists (password, Google return, or confirmation link), continue to the destination.
  useEffect(() => {
    if (!ready || !user) return;
    const stored = sessionStorage.getItem(REDIRECT_KEY);
    sessionStorage.removeItem(REDIRECT_KEY);
    navigate({ to: safeRedirect(search.redirect ?? stored ?? undefined), replace: true });
  }, [user, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setNotice("");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email address.");
    if (mode !== "forgot" && password.length < 8) return setError("Password must be at least 8 characters.");
    if (mode === "signup" && !name.trim()) return setError("Please enter your name.");
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message === "Invalid login credentials" ? "Email or password is incorrect." : error.message);
      } else if (mode === "signup") {
        sessionStorage.setItem(REDIRECT_KEY, target);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth?redirect=${encodeURIComponent(target)}`, data: { full_name: name.trim() } },
        });
        if (error) setError(error.message);
        else if (!data.session) setNotice(`We've sent a confirmation link to ${email}. Open it to activate your account.`);
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) setError(error.message);
        else setNotice(`If an account exists for ${email}, a reset link is on its way.`);
      }
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError("");
    sessionStorage.setItem(REDIRECT_KEY, target);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth` });
    if (result.error) setError("Google sign-in didn't complete. Please try again.");
  };

  return (
    <section className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden md:block">
        <img src={look1} alt="ALOX — The Modern Minimalist" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex items-center px-6 pb-20 pt-28 md:px-16 lg:px-24">
        <div className="w-full max-w-md">
          {search.redirect === "/checkout" && <p className="eyebrow mb-6 text-gold">Sign in to complete your purchase</p>}
          <h1 className="display text-5xl md:text-6xl">
            {mode === "signin" ? "Welcome back." : mode === "signup" ? "Join ALOX." : "Reset password."}
          </h1>

          {mode !== "forgot" && (
            <div className="mt-10 grid grid-cols-2 border-b">
              {(["signin", "signup"] as const).map((m) => (
                <button key={m} type="button" onClick={() => { setMode(m); setError(""); setNotice(""); }}
                  className={cn("eyebrow -mb-px border-b pb-4 text-left transition-colors", mode === m ? "border-ink" : "border-transparent text-muted-foreground")}>
                  {m === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>
          )}

          {notice ? (
            <p className="animate-fade mt-10 border-l-2 border-gold pl-4">{notice}</p>
          ) : (
            <form onSubmit={submit} noValidate className="mt-10 space-y-8">
              {mode === "signup" && (
                <label className="block"><span className="eyebrow text-muted-foreground">Full name</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="field" /></label>
              )}
              <label className="block"><span className="eyebrow text-muted-foreground">Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="field" /></label>
              {mode !== "forgot" && (
                <label className="block"><span className="eyebrow text-muted-foreground">Password</span>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signin" ? "current-password" : "new-password"} className="field" /></label>
              )}
              {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
              <button disabled={busy} className="btn-solid w-full">
                {busy ? "Please wait…" : mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
              </button>
              {mode === "signin" && <button type="button" onClick={() => setMode("forgot")} className="eyebrow link-line text-muted-foreground">Forgot password?</button>}
              {mode === "forgot" && <button type="button" onClick={() => setMode("signin")} className="eyebrow link-line text-muted-foreground">Back to sign in</button>}
            </form>
          )}

          {mode !== "forgot" && !notice && (
            <>
              <div className="my-8 flex items-center gap-4"><span className="h-px flex-1 bg-border" /><span className="eyebrow text-muted-foreground">or</span><span className="h-px flex-1 bg-border" /></div>
              <button type="button" onClick={google} className="btn-outline w-full">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path fill="currentColor" d="M21.35 11.1H12v3.2h5.35c-.5 2.4-2.6 3.7-5.35 3.7a6 6 0 1 1 0-12c1.5 0 2.85.55 3.9 1.45l2.4-2.4A9.4 9.4 0 0 0 12 2.6a9.4 9.4 0 1 0 0 18.8c5.4 0 9-3.8 9-9.1 0-.4 0-.8-.1-1.2Z" /></svg>
                Continue with Google
              </button>
            </>
          )}
          <p className="mt-10 text-xs text-muted-foreground">
            By continuing you agree to our terms. <Link to="/shop" className="link-line">Continue browsing</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
