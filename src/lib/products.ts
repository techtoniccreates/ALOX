import blazer from "@/assets/c-blazer.jpg";
import shirt from "@/assets/c-shirt.jpg";
import trousers from "@/assets/c-trousers.jpg";
import derby from "@/assets/c-derby.jpg";
import knit from "@/assets/c-knit.jpg";
import beige from "@/assets/c-beige.jpg";
import loafers from "@/assets/c-loafers.jpg";
import overshirt from "@/assets/c-overshirt.jpg";
import sneakers from "@/assets/c-sneakers.jpg";
import travelJacket from "@/assets/c-travel-jacket.jpg";
import look1 from "@/assets/look-1.jpg";
import look2 from "@/assets/look-2.jpg";
import look3 from "@/assets/look-3.jpg";
import look4 from "@/assets/look-4.jpg";
import look5 from "@/assets/look-5.jpg";
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

export type Category = "Accessories" | "Lifestyle" | "Leather Goods" | "Clothing" | "Footwear";

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
  {
    slug: "structured-black-blazer",
    name: "Structured Black Blazer",
    descriptor: "Single-breasted, virgin wool",
    category: "Clothing",
    price: 1450,
    images: [blazer, look1],
    description: "A sharply cut single-breasted blazer with a softly defined waist and peak of shoulder. The anchor of a considered wardrobe.",
    material: "Virgin wool, Bemberg cupro lining, horn buttons.",
    care: "Dry clean only. Rest on a shaped hanger between wears.",
    options: { label: "Size", values: ["XS", "S", "M", "L", "XL"] },
    isNew: true,featured: true,
    addedOrder: 14,
  },
  {
    slug: "ivory-essential-shirt",
    name: "Ivory Essential Shirt",
    descriptor: "Cotton poplin, classic collar",
    category: "Clothing",
    price: 320,
    images: [shirt, look1],
    description: "A crisp poplin shirt in a warm ivory, cut with a clean placket and a collar that sits well under tailoring.",
    material: "Two-fold Egyptian cotton poplin, mother-of-pearl buttons.",
    care: "Machine wash at 30°C. Iron while slightly damp.",
    options: { label: "Size", values: ["XS", "S", "M", "L", "XL"] },
    
    addedOrder: 6,
  },
  {
    slug: "tailored-black-trousers",
    name: "Tailored Black Trousers",
    descriptor: "Straight leg, pressed crease",
    category: "Clothing",
    price: 540,
    images: [trousers, look3],
    description: "Straight-leg trousers with a permanent pressed crease and an extended waistband. Equally at home with a blazer or a knit.",
    material: "Tropical wool, cotton waistband lining.",
    care: "Dry clean. Steam to refresh the crease.",
    options: { label: "Waist", values: ["28", "30", "32", "34", "36"] },
    
    addedOrder: 4,
  },
  {
    slug: "black-leather-derby",
    name: "Black Leather Derby",
    descriptor: "Goodyear-welted calfskin",
    category: "Footwear",
    price: 690,
    images: [derby, look3],
    description: "A plain-toe derby in polished calfskin, built on a Goodyear welt so it can be resoled for years.",
    material: "Box calf upper, leather lining, leather sole.",
    care: "Polish with neutral cream. Use cedar shoe trees.",
    options: { label: "Size (EU)", values: ["39", "40", "41", "42", "43", "44", "45"] },
    
    addedOrder: 3,
  },
  {
    slug: "cream-cashmere-knit",
    name: "Cream Cashmere Knit",
    descriptor: "Crewneck, 12-gauge cashmere",
    category: "Clothing",
    price: 780,
    images: [knit, look2],
    description: "A relaxed crewneck in pure cashmere, knitted fine enough to layer and soft enough to wear alone.",
    material: "100% Mongolian cashmere.",
    care: "Hand wash cold and dry flat.",
    options: { label: "Size", values: ["XS", "S", "M", "L", "XL"] },
    isNew: true,
    addedOrder: 15,
  },
  {
    slug: "beige-pleated-trousers",
    name: "Beige Pleated Trousers",
    descriptor: "Double pleat, wool flannel",
    category: "Clothing",
    price: 560,
    images: [beige, look2],
    description: "High-rise trousers with a double forward pleat and a fluid wide leg, in a warm beige wool flannel.",
    material: "Wool flannel, cotton pocketing.",
    care: "Dry clean only.",
    options: { label: "Waist", values: ["28", "30", "32", "34", "36"] },
    isNew: true,
    addedOrder: 13,
  },
  {
    slug: "brown-suede-loafers",
    name: "Brown Suede Loafers",
    descriptor: "Penny loafer, unlined suede",
    category: "Footwear",
    price: 620,
    images: [loafers, look2],
    description: "A softly structured penny loafer in chocolate suede — the quiet finishing note to tailoring and knitwear.",
    material: "Calf suede upper, leather sole.",
    care: "Brush with a suede brush. Treat with protector spray.",
    options: { label: "Size (EU)", values: ["39", "40", "41", "42", "43", "44", "45"] },
    
    addedOrder: 2,
  },
  {
    slug: "stone-overshirt",
    name: "Stone Overshirt",
    descriptor: "Heavy cotton twill, patch pockets",
    category: "Clothing",
    price: 480,
    images: [overshirt, look4],
    description: "A weekend overshirt in garment-dyed cotton twill with two patch pockets, worn open over a tee or closed as a shirt.",
    material: "Garment-dyed cotton twill, corozo buttons.",
    care: "Machine wash at 30°C inside out.",
    options: { label: "Size", values: ["XS", "S", "M", "L", "XL"] },
    isNew: true,
    addedOrder: 16,
  },
  {
    slug: "minimal-leather-sneaker",
    name: "Minimal Leather Sneaker",
    descriptor: "Low-top, Italian calfskin",
    category: "Footwear",
    price: 420,
    images: [sneakers, look4],
    description: "A low-top sneaker reduced to its essentials: smooth white calfskin on a margom rubber cupsole.",
    material: "Nappa calfskin, leather lining, rubber cupsole.",
    care: "Wipe clean with a damp cloth.",
    options: { label: "Size (EU)", values: ["39", "40", "41", "42", "43", "44", "45"] },
    
    addedOrder: 1,
  },
  {
    slug: "charcoal-travel-jacket",
    name: "Charcoal Travel Jacket",
    descriptor: "Lightweight, water-repellent",
    category: "Clothing",
    price: 890,
    images: [travelJacket, look5],
    description: "A packable zip jacket in a matte, water-repellent technical weave — tailored enough for arrivals, light enough for the journey.",
    material: "Recycled technical nylon with water-repellent finish.",
    care: "Machine wash cold. Do not tumble dry.",
    options: { label: "Size", values: ["XS", "S", "M", "L", "XL"] },
    isNew: true,
    addedOrder: 17,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

export const editorial = { ed1, ed2, craft };

export type Look = {
  slug: string;
  number: string;
  name: string;
  description: string;
  occasions: string[];
  image: string;
  items: string[];
};

export const looks: Look[] = [
  { slug: "the-modern-minimalist", number: "01", name: "The Modern Minimalist", description: "Clean lines, understated tones and considered details for effortless everyday luxury.", occasions: ["Everyday", "Work", "Evening"], image: look1, items: ["structured-black-blazer", "ivory-essential-shirt", "tailored-black-trousers", "black-leather-derby", "signature-bag", "axiom-watch"] },
  { slug: "the-quiet-luxury-edit", number: "02", name: "The Quiet Luxury Edit", description: "Soft cashmere, warm neutrals and suede — luxury that is felt rather than announced.", occasions: ["Weekend", "Everyday"], image: look2, items: ["cream-cashmere-knit", "beige-pleated-trousers", "brown-suede-loafers", "classic-leather-belt", "minimal-card-holder"] },
  { slug: "the-evening-edit", number: "03", name: "The Evening Edit", description: "Tonal black from collar to sole, finished with a single sharp accessory.", occasions: ["Evening", "Special occasion"], image: look3, items: ["structured-black-blazer", "tailored-black-trousers", "black-leather-derby", "alox-noir-sunglasses", "signature-fragrance"] },
  { slug: "the-weekend-edit", number: "04", name: "The Weekend Edit", description: "Relaxed layers in stone and cream for unhurried days in the city.", occasions: ["Weekend", "Everyday"], image: look4, items: ["stone-overshirt", "beige-pleated-trousers", "minimal-leather-sneaker", "essential-leather-wallet"] },
  { slug: "the-travel-edit", number: "05", name: "The Travel Edit", description: "Light, composed and ready for arrivals — the considered way to travel.", occasions: ["Travel", "Work"], image: look5, items: ["charcoal-travel-jacket", "ivory-essential-shirt", "tailored-black-trousers", "minimal-leather-sneaker", "noir-travel-case", "axiom-watch"] },
];

export const getLook = (slug: string) => looks.find((l) => l.slug === slug);
export const lookProducts = (l: Look) => l.items.map((s) => getProduct(s)).filter((p): p is Product => !!p);
export const lookFor = (slug: string) => looks.find((l) => l.items.includes(slug));
