import { QueryClient } from '@tanstack/react-query';

/** staleTime 5 min — catálogo y listados de lectura frecuente */
export const CATALOG_STALE_TIME = 5 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
