import React, { useState } from "react";
import { CacheProvider } from "@emotion/react";
import { RemixBrowser } from "@remix-run/react";

import { ClientStyleContext } from "./context";
import createEmotionCache from "./createEmotionCache";
import { hydrate } from "react-dom";

interface ClientCacheProviderProps {
  children: React.ReactNode;
}

/**
 * It creates a new cache for each render, and then passes that cache to the `<CacheProvider>` component
 * @param {ClientCacheProviderProps}  - `createEmotionCache` is a function that creates a new cache object.
 */
function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = useState(createEmotionCache());

  function reset() {
    setCache(createEmotionCache());
  }

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

hydrate(
  <ClientCacheProvider>
    <RemixBrowser />
  </ClientCacheProvider>,
  document
);
