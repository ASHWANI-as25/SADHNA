import React from 'react';
import { Outlet } from 'react-router-dom';
import PremiumBackground from './PremiumBackground';
import PremiumSidebar from './PremiumSidebar';
import '../styles/premium-system.css';
import '../styles/premium-sidebar.css';

/**
 * Premium Layout
 * Main app container with:
 * - Subtle deep space background
 * - Minimal elegant sidebar
 * - Clean content area
 */

const PremiumLayout = () => {
  return (
    <div className="app-container">
      {/* Deep space background - subtle and elegant */}
      <PremiumBackground />

      {/* Minimal sidebar navigation */}
      <PremiumSidebar />

      {/* Main content area */}
      <main className="main-content fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default PremiumLayout;
