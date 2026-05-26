import { useQuery } from '@tanstack/react-query';
import api, { vehicleService } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import { CATALOG_STALE_TIME } from '../../lib/queryClient';

/** Loyalty / perfil — vehículos del catálogo para favoritos */
export function useProfileVehiclesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.vehicles.list({ profile: true }),
    queryFn: () => vehicleService.getAll(),
    staleTime: CATALOG_STALE_TIME,
    enabled,
  });
}

/** Historial de peticiones del usuario */
export function useProfileRequestsQuery(userId, email, enabled = true) {
  return useQuery({
    queryKey: queryKeys.profile.requests(userId, email),
    queryFn: async () => {
      const [contactRes, tradeInRes] = await Promise.all([
        api.get('/requests'),
        api.get(`/sale_requests?userId=${userId}`),
      ]);

      const userEmail = (email || '').toLowerCase();
      const filteredContacts = contactRes.data.filter(
        (req) => (req.user_email || '').toLowerCase() === userEmail
      );

      const normalizedTradeIn = tradeInRes.data.map((item) => ({
        id: item.id,
        subject: `Trade-in: ${item.marca} ${item.modelo}`,
        message: item.descripcion || 'Sin descripción',
        status: item.estado || 'pending',
        date: item.date || new Date().toISOString(),
        reply: item.respuesta_admin || null,
        type: 'tradein',
      }));

      const normalizedContacts = filteredContacts.map((item) => ({
        ...item,
        type: 'contact',
        reply: item.reply || null,
      }));

      return [...normalizedContacts, ...normalizedTradeIn].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    },
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000,
    enabled: enabled && Boolean(userId || email),
  });
}
