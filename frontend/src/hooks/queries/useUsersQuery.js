import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import { CATALOG_STALE_TIME } from '../../lib/queryClient';

async function fetchUsers() {
  const res = await api.get('/users');
  return res.data;
}

/** CRM — gestión de usuarios */
export function useUsersQuery() {
  return useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: fetchUsers,
    staleTime: CATALOG_STALE_TIME,
  });
}

/** Tracking de importaciones (admin) */
export function useTrackingUsersQuery() {
  return useQuery({
    queryKey: queryKeys.users.tracking(),
    queryFn: async () => {
      const data = await fetchUsers();
      return data.filter((u) => u.rol === 'Cliente' || u.tracking);
    },
    staleTime: CATALOG_STALE_TIME,
  });
}

export function useInvalidateUsers() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
  };
}
