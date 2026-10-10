import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ImageZoom({ open, onOpenChange, src, alt }: { open: boolean; onOpenChange: (o: boolean) => void; src: string; alt: string }) {
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); setZoom(false); }}>
      <DialogContent className="h-[100svh] max-w-none w-screen rounded-none border-0 bg-background p-0 sm:rounded-none [&>button]:hidden">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <button onClick={() => onOpenChange(false)} aria-label="Close" className="absolute right-6 top-6 z-10 p-2"><X className="h-5 w-5" strokeWidth={1.25} /></button>
        <p className="eyebrow absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-muted-foreground">{zoom ? "Click to zoom out" : "Click to zoom in"}</p>
        <div
          className={cn("h-full w-full overflow-hidden", zoom ? "cursor-zoom-out" : "cursor-zoom-in")}
          onClick={() => setZoom((z) => !z)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
          }}
        >
          <img src={src} alt={alt} style={{ transformOrigin: origin }}
            className={cn("h-full w-full object-contain transition-transform duration-500 ease-out", zoom && "scale-[2.2]")} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
