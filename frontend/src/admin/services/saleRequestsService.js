import { adminClient, unwrap } from './client';

/** Solicitudes trade-in / venta de autos por clientes */
export const saleRequestsService = {
  // v1
  getAll: async () => unwrap(await adminClient.get('/trade-in')),

  getById: async (id) => unwrap(await adminClient.get(`/trade-in/${id}`)),

  update: async (id, payload) => unwrap(await adminClient.put(`/trade-in/${id}`, payload)),

  patch: async (id, payload) => unwrap(await adminClient.patch(`/trade-in/${id}`, payload)),

  remove: async (id) => unwrap(await adminClient.delete(`/trade-in/${id}`)),

  updateStatus: async (id, estado, respuesta_admin = '') =>
    saleRequestsService.patch(id, { estado, respuesta_admin }),
};
