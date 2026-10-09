<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Cart and wishlist live in a React context persisted to localStorage (src/lib/store.tsx) — portfolio demo, no backend needed.
- Product catalogue is static data in src/lib/products.ts — single source for shop, product pages and cart.
- Brand styles (buttons, fields, eyebrow labels) are Tailwind @utility classes in src/styles.css — keeps components token-only.
- AI stylist: createServerFn in src/lib/stylist.functions.ts lazily imports stylist.server.ts (gateway call + catalogue prompt) — keeps key and prompt server-side; returned slugs are validated against the catalogue.

- Motion system: keyframes/utilities in src/styles.css plus Reveal/Parallax/Marquee in src/components/site/Reveal.tsx — one shared, reduced-motion-aware vocabulary instead of an animation library.
- CampaignDrop is used only in campaign photography; gallery parallax is bounded to image overscan so scroll motion cannot expose empty edges.
- Sizing references live in src/lib/sizing.ts; size-bearing individual and complete-look purchases require an explicit selection so the cart preserves shopper intent.
- Outfit reviews use validated browser-local storage in src/lib/reviews.ts and disclose their demo scope; no fabricated ratings or public customer-review claims.
