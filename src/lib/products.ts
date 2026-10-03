import bag from "@/assets/p-bag.jpg";
import watch from "@/assets/p-watch.jpg";
import fragrance from "@/assets/p-fragrance.jpg";
import wallet from "@/assets/p-wallet.jpg";
import travel from "@/assets/p-travel.jpg";
import belt from "@/assets/p-belt.jpg";
import cardholder from "@/assets/p-cardholder.jpg";
import sunglasses from "@/assets/p-sunglasses.jpg";
import ed1 from "@/assets/ed-1.jpg";
import ed2 from "@/assets/ed-2.jpg";
import craft from "@/assets/craft.jpg";

export type Category = "Accessories" | "Lifestyle" | "Leather Goods";

export type Product = {
  slug: string;
  name: string;
  descriptor: string;
  category: Category;
  price: number;
  images: string[];
  description: string;
  material: string;
  care: string;
  options: { label: string; values: string[] };
  featured?: boolean;
  isNew?: boolean;
  addedOrder: number;
};

export const products: Product[] = [
  {
    slug: "signature-bag",
    name: "ALOX Signature Bag",
    descriptor: "Structured top-handle, grained calfskin",
    category: "Leather Goods",
    price: 2450,
    images: [bag, ed1],
    description:
      "An architectural silhouette carried by a single sculpted handle. The Signature Bag is cut from full-grain calfskin and closed with a brushed-gold turn-lock — a quiet piece designed to be carried for decades.",
    material: "Full-grain Italian calfskin, brushed-brass hardware, suede lining.",
    care: "Store in the supplied dust bag. Keep away from direct sunlight and moisture. Condition twice yearly.",
    options: { label: "Colour", values: ["Noir", "Ivory", "Tobacco"] },
    featured: true,
    addedOrder: 3,
  },
  {
    slug: "axiom-watch",
    name: "Axiom Watch",
    descriptor: "38mm, matte black dial",
    category: "Accessories",
    price: 1890,
    images: [watch, ed2],
    description:
      "Time reduced to its essentials. A matte black dial with gilded baton indices, set in a slim brushed case on a hand-stitched leather strap.",
    material: "Brushed gold-tone steel case, sapphire crystal, vegetable-tanned leather strap.",
    care: "Water resistant to 3 ATM. Avoid prolonged contact with water to preserve the strap.",
    options: { label: "Case", values: ["38mm", "40mm"] },
    featured: true,
    isNew: true,
    addedOrder: 11,
  },
  {
    slug: "signature-fragrance",
    name: "Signature Fragrance",
    descriptor: "Eau de Parfum, 100ml",
    category: "Lifestyle",
    price: 285,
    images: [fragrance, craft],
    description:
      "Smoked vetiver, black amber and a trace of fig leaf. A warm, low-lit scent composed to linger close to the skin.",
    material: "Eau de Parfum. Hand-polished glass flacon with weighted cap.",
    care: "Store upright in a cool, dark place.",
    options: { label: "Size", values: ["50ml", "100ml"] },
    featured: true,
    addedOrder: 7,
  },
  {
    slug: "noir-travel-case",
    name: "Noir Travel Case",
    descriptor: "Weekender, pebbled leather",
    category: "Leather Goods",
    price: 2950,
    images: [travel, ed1],
    description:
      "A generous weekender with a softly structured body, rolled handles and a detachable shoulder strap. Designed for unhurried departures.",
    material: "Pebbled calfskin, brass zip, cotton-canvas lining.",
    care: "Wipe with a soft dry cloth. Condition when the leather begins to feel dry.",
    options: { label: "Colour", values: ["Noir", "Espresso"] },
    featured: true,
    isNew: true,
    addedOrder: 12,
  },
  {
    slug: "essential-leather-wallet",
    name: "Essential Leather Wallet",
    descriptor: "Bifold, eight card slots",
    category: "Leather Goods",
    price: 420,
    images: [wallet, cardholder],
    description:
      "A slim bifold with eight card slots and a full-length note compartment, finished with hand-painted edges.",
    material: "Grained calfskin, hand-painted edges.",
    care: "Avoid overfilling to preserve the shape.",
    options: { label: "Colour", values: ["Noir", "Tobacco"] },
    isNew: true,
    addedOrder: 10,
  },
  {
    slug: "minimal-card-holder",
    name: "Minimal Card Holder",
    descriptor: "Four slots, smooth calfskin",
    category: "Accessories",
    price: 240,
    images: [cardholder, wallet],
    description: "The essentials, and nothing more. Four card slots and a central pocket in smooth calfskin.",
    material: "Smooth calfskin, tonal stitching.",
    care: "Wipe gently with a dry cloth.",
    options: { label: "Colour", values: ["Noir", "Ivory"] },
    addedOrder: 5,
  },
  {
    slug: "classic-leather-belt",
    name: "Classic Leather Belt",
    descriptor: "30mm, brushed buckle",
    category: "Accessories",
    price: 360,
    images: [belt, ed1],
    description: "A 30mm belt in polished calfskin with a squared, brushed-brass buckle. Proportioned for tailoring and denim alike.",
    material: "Polished calfskin, solid brass buckle.",
    care: "Hang or roll loosely when not worn.",
    options: { label: "Size", values: ["80", "85", "90", "95", "100"] },
    isNew: true,
    addedOrder: 9,
  },
  {
    slug: "alox-noir-sunglasses",
    name: "ALOX Noir",
    descriptor: "Acetate sunglasses, gold temples",
    category: "Accessories",
    price: 520,
    images: [sunglasses, ed2],
    description: "A softened square frame in hand-polished acetate, with slender gold-tone temples and grey gradient lenses.",
    material: "Italian acetate, gold-tone metal, CR-39 lenses with UV400 protection.",
    care: "Clean with the supplied cloth. Store in the case.",
    options: { label: "Lens", values: ["Grey", "Brown"] },
    featured: false,
    addedOrder: 8,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

export const editorial = { ed1, ed2, craft };
