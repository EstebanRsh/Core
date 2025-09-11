import { apiFetch } from '../utils/http.js';
export const PagoModel = {
  async search({ page=1, limit=20, cliente_id, metodo, estado, fecha_desde, fecha_hasta, monto_min, monto_max, ordenar_por='fecha', orden='desc' }={}) {
    return apiFetch('/pagos/search', { method: 'POST', body: { page, limit, cliente_id, metodo, estado, fecha_desde, fecha_hasta, monto_min, monto_max, ordenar_por, orden }});
  },
  async efectivo({ cliente_id, monto, periodo_year, periodo_month, es_adelantado=false, concepto, descripcion }) {
    return apiFetch('/pagos/efectivo', { method: 'POST', body: { cliente_id, monto, periodo_year, periodo_month, es_adelantado, concepto, descripcion }});
  },
  async transferenciaForm(formData) { return apiFetch('/pagos/transferencia', { method: 'POST', body: formData, isForm: true }); },
  async confirmar(id) { return apiFetch(`/pagos/${id}/confirmar`, { method: 'PUT' }); },
  async detalle(id) { return apiFetch(`/pagos/${id}`, { method: 'GET' }); },
  async anular(id, motivo) { return apiFetch(`/pagos/${id}`, { method: 'DELETE', body: { motivo } }); },
  async reciboPdf(id) { return apiFetch(`/pagos/${id}/recibo.pdf`, { method: 'GET' }); },
};
