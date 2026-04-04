import { Outlet } from 'react-router-dom';
import SidebarNavigation from './SidebarNavigation';
import '../styles/layout.css';

const Layout = () => {
  return (
    <div className="app-layout">
      <SidebarNavigation />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
