import { apiFetch } from '../utils/http.js';
export const ClienteModel = {
  async getById(id) { return apiFetch(`/clientes/${id}`); },
  async searchPaginated({ page = 1, limit = 20, query = '' } = {}) {
    return apiFetch('/clientes/paginated', { method: 'POST', body: { page, limit, query } });
  },
};
