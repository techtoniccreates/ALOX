import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { StoreProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

function NotFoundComponent() {
  return (
    <div className="container-lux flex min-h-[70vh] flex-col items-start justify-center pt-24">
      <p className="eyebrow text-gold">404</p>
      <h1 className="display mt-4 text-6xl">This page has moved on.</h1>
      <Link to="/" className="btn-solid mt-10">Return home</Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="container-lux flex min-h-[70vh] flex-col items-start justify-center pt-24">
      <h1 className="display text-5xl">This page didn't load.</h1>
      <p className="mt-4 text-muted-foreground">Something went wrong on our end.</p>
      <div className="mt-8 flex gap-3">
        <button onClick={() => { router.invalidate(); reset(); }} className="btn-solid">Try again</button>
        <a href="/" className="btn-outline">Go home</a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ALOX — The Art of Modern Luxury" },
      { name: "description", content: "ALOX is a modern luxury lifestyle house of refined, timeless essentials." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <StoreProvider>
        <Header />
        <main key={path} className="animate-fade min-h-screen">
          <Outlet />
        </main>
        <Footer />
      </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
