import { LogOut, ShieldCheck } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

export function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="brand-inline">
          <ShieldCheck size={24} />
          <span>SETA Rafael Admin</span>
        </div>
        <button className="icon-button" onClick={handleLogout} title="Sair" aria-label="Sair">
          <LogOut size={20} />
        </button>
      </header>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
