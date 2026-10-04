import { Link } from "@tanstack/react-router";
import { Wordmark } from "./Logo";
import { contact } from "@/lib/contact";

const Social = ({ label, d, href }: { label: string; d: string; href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="opacity-70 transition-opacity hover:opacity-100">
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.25"><path d={d} /></svg>
  </a>
);

export function Footer() {
  return (
    <footer className="bg-ink text-primary-foreground">
      <div className="container-lux grid gap-14 py-20 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-6">
          <Wordmark />
          <p className="max-w-xs text-sm leading-relaxed opacity-60">
            Refined essentials for those who appreciate quality, simplicity and timeless expression.
          </p>
          <address className="space-y-1 text-sm not-italic opacity-60">
            <p>{contact.address}</p>
            <p><a href={`mailto:${contact.email}`} className="link-line">{contact.email}</a></p>
            <p><a href={`tel:${contact.phoneHref}`} className="link-line">{contact.phone}</a></p>
          </address>
        </div>
        <div className="space-y-4">
          <p className="eyebrow text-gold">Shop</p>
          <ul className="space-y-3 text-sm opacity-80">
            <li><Link to="/shop" className="link-line">The Collection</Link></li>
            <li><Link to="/shop" search={{ filter: "New Arrivals" }} className="link-line">New Arrivals</Link></li>
            <li><Link to="/edit" className="link-line">The ALOX Edit</Link></li>
            <li><Link to="/stylist" className="link-line">The ALOX Stylist</Link></li>
            <li><Link to="/cart" className="link-line">Your Bag</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <p className="eyebrow text-gold">House</p>
          <ul className="space-y-3 text-sm opacity-80">
            <li><Link to="/about" className="link-line">About</Link></li>
            <li><Link to="/story" className="link-line">Our Story</Link></li>
            <li><Link to="/contact" className="link-line">Contact</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <p className="eyebrow text-gold">Client Care</p>
          <ul className="space-y-3 text-sm opacity-80">
            <li><Link to="/contact" className="link-line">Shipping</Link></li>
            <li><Link to="/contact" className="link-line">Returns</Link></li>
            <li><Link to="/contact" className="link-line">Privacy</Link></li>
            <li><Link to="/contact" className="link-line">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-lux flex flex-col-reverse items-start justify-between gap-6 border-t border-primary-foreground/10 py-8 sm:flex-row sm:items-center">
        <p className="eyebrow opacity-50">© 2026 ALOX Atelier</p>
        <div className="flex gap-6">
          <Social href={contact.instagram.url} label="Instagram" d="M4 4h16v16H4z M12 8.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7 M17 7h.01" />
          <Social href={contact.pinterest.url} label="Pinterest" d="M12 3a9 9 0 0 0-3.3 17.4L11 12 M12 7.5a4.5 4.5 0 0 1 0 9" />
          <Social href={contact.x.url} label="X" d="M4 4l16 16 M20 4L4 20" />
        </div>
      </div>
    </footer>
  );
}
