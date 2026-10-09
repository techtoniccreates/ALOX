import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "rise" | "fade" | "pan" | "mask" | "line";

/** Scroll reveal. Variants follow the ALOX motion system (rise default; mask = image reveal). */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "rise",
}: {
  children?: ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-variant={variant} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>
      {variant === "mask" ? <div className="reveal-mask" style={{ transitionDelay: `${delay}ms` }}>{children}</div> : children}
    </div>
  );
}

/** Subtle scroll parallax: moves children at `speed` relative to scroll (small values only). */
export function Parallax({ children, className, speed = 0.08 }: { children: ReactNode; className?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.parentElement?.getBoundingClientRect();
      if (!r) return;
      const offset = Math.max(-r.height * 0.04, Math.min(r.height * 0.04, (r.top + r.height / 2 - window.innerHeight / 2) * -speed));
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.1)`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [speed]);
  return <div ref={ref} data-parallax className={cn("will-change-transform", className)}>{children}</div>;
}

/** Campaign-only shutter reveal and scroll-driven composition; never used on forms. */
export function CampaignDrop({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - rect.top - rect.height / 2) / window.innerHeight));
      el.style.setProperty("--campaign-shift", `${progress * 32}px`);
      el.style.setProperty("--campaign-counter", `${progress * -20}px`);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { el.classList.add("is-in"); observer.disconnect(); }
    }, { threshold: 0.08 });
    observer.observe(el); update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { observer.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);
  return <div ref={ref} className={cn("campaign-drop", className)}>{children}</div>;
}

/** Slow editorial marquee. */
export function Marquee({ text, className }: { text: string; className?: string }) {
  const items = Array.from({ length: 8 }, () => text);
  return (
    <div className={cn("overflow-hidden", className)} aria-hidden>
      <div className="marquee-track">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10 pr-10">
            <span>{t}</span><span className="h-1 w-1 bg-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Types text out letter by letter once it scrolls into view. Space is reserved so the layout never jumps. */
export function TypeOnView({ text, className, speed = 28, delay = 300 }: { text: string; className?: string; speed?: number; delay?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(text.length); return; }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      let i = 0;
      const tick = () => { i += 1; setShown(i); if (i < text.length) timer = setTimeout(tick, speed); };
      timer = setTimeout(tick, delay);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); if (timer) clearTimeout(timer); };
  }, [text, speed, delay]);
  const done = shown >= text.length;
  return (
    <p ref={ref} className={cn("relative", className)} aria-label={text}>
      <span className="invisible" aria-hidden>{text}</span>
      <span className="absolute inset-0" aria-hidden>
        {text.slice(0, shown)}
        <span className={cn("ml-px inline-block h-[1em] w-px translate-y-[0.15em] bg-current", done ? "animate-[fade_.6s_ease_1.2s_reverse_both]" : "")} />
      </span>
    </p>
  );
}
