import { mount } from '../utils/dom.js';
import { GerenteView } from '../views/dashboards/GerenteView.js';
import { OperadorView } from '../views/dashboards/OperadorView.js';
import { ClienteView } from '../views/dashboards/ClienteView.js';
import { AuthModel } from '../models/AuthModel.js';
import { ROUTES } from '../config.js';
export const DashboardController = {
  render(root) {
    const { token, user, profile } = AuthModel.getSession();
    if (!token || !user) {
      location.hash = ROUTES.LOGIN;
      return;
    }
    const role = (profile?.role) || user.role;
    if (role === 'gerente') {
      mount(root, GerenteView({ user, profile }));
    } else if (role === 'operador') {
      mount(root, OperadorView({ user, profile }));
    } else {
      mount(root, ClienteView({ user, profile }));
    }
  }
};
