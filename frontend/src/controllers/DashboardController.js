import { mount } from '../utils/dom.js';
import { GerenteView } from '../views/dashboards/GerenteView.js';
import { OperadorView } from '../views/dashboards/OperadorView.js';
import { ClienteView } from '../views/dashboards/ClienteView.js';
import { AuthModel } from '../models/AuthModel.js';
import { ROUTES } from '../config.js';
export const DashboardController = {
  render(root) {
    const { token, user, profile } = AuthModel.getSession();
    if (!token || !user) { location.hash = ROUTES.LOGIN; return; }
    const role = (profile?.role) || user.role;
    const parts = (location.hash || '').split('/');
    const section = parts.length > 2 ? parts.slice(2).join('/') : '';
    if (role === 'gerente') mount(root, GerenteView({ user, profile, section }));
    else if (role === 'operador') mount(root, OperadorView({ user, profile, section }));
    else mount(root, ClienteView({ user, profile, section }));
  }
};
