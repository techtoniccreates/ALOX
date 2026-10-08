import { useEffect, useRef, type ReactNode } from "react";
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
      const offset = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
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
