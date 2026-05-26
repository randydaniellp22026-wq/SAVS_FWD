import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '../../services/api';
import { queryKeys } from '../../lib/queryKeys';
import { CATALOG_STALE_TIME } from '../../lib/queryClient';

export function useVehiclesCatalogQuery(params) {
  return useQuery({
    queryKey: queryKeys.vehicles.list(params),
    queryFn: () => vehicleService.getAll(params),
    staleTime: CATALOG_STALE_TIME,
    placeholderData: (prev) => prev,
  });
}

export function useVehiclesAdminQuery() {
  return useQuery({
    queryKey: queryKeys.vehicles.adminList(),
    queryFn: () => vehicleService.getAll({ limit: 100 }),
    staleTime: CATALOG_STALE_TIME,
  });
}

export function useVehicleMutation() {
  const queryClient = useQueryClient();

  const invalidateVehicles = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
  };

  const createMutation = useMutation({
    mutationFn: (data) => vehicleService.create(data),
    onMutate: async (newVehicle) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.vehicles.adminList() });
      const previous = queryClient.getQueryData(queryKeys.vehicles.adminList());
      const optimistic = {
        id: `temp-${Date.now()}`,
        ...newVehicle,
        _optimistic: true,
      };
      queryClient.setQueryData(queryKeys.vehicles.adminList(), (old) => ({
        ...old,
        data: [optimistic, ...(old?.data || [])],
      }));
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.vehicles.adminList(), context.previous);
      }
    },
    onSettled: invalidateVehicles,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => vehicleService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.vehicles.adminList() });
      const previous = queryClient.getQueryData(queryKeys.vehicles.adminList());
      queryClient.setQueryData(queryKeys.vehicles.adminList(), (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((v) =>
            String(v.id) === String(id) ? { ...v, ...data, _optimistic: true } : v
          ),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.vehicles.adminList(), context.previous);
      }
    },
    onSettled: invalidateVehicles,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => vehicleService.delete(id),
    onSettled: invalidateVehicles,
  });

  return { createMutation, updateMutation, deleteMutation, invalidateVehicles };
}
