import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import { CATALOG_STALE_TIME } from '../../lib/queryClient';

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: async () => {
      const [vRes, uRes, reqRes, revRes, sreqRes, setsRes] = await Promise.allSettled([
        api.get('/vehicles'),
        api.get('/users'),
        api.get('/requests'),
        api.get('/reviews'),
        api.get('/sale_requests'),
        api.get('/settings').catch(() => ({ data: {} })),
      ]);

      const vRaw = vRes.status === 'fulfilled' ? vRes.value.data : [];
      const vehicles = Array.isArray(vRaw) ? vRaw : vRaw.data || [];

      return {
        vehicles,
        vRaw,
        users: uRes.status === 'fulfilled' ? uRes.value.data : [],
        requests: reqRes.status === 'fulfilled' ? reqRes.value.data : [],
        reviews: revRes.status === 'fulfilled' ? revRes.value.data : [],
        tradeIn: sreqRes.status === 'fulfilled' ? sreqRes.value.data : [],
        settings: setsRes.status === 'fulfilled' ? setsRes.value.data : {},
      };
    },
    staleTime: CATALOG_STALE_TIME,
    refetchInterval: 30 * 1000,
  });
}
