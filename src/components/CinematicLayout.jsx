import React from 'react';
import { Outlet } from 'react-router-dom';
import CinematicStarfield from './CinematicStarfield';
import PremiumSidebar from './PremiumSidebar';
import '../styles/cinematic-system.css';
import '../styles/premium-sidebar.css';

/**
 * Cinematic Layout
 * Ultra-premium immersive space experience with:
 * - 3D moving starfield (stars flowing toward camera)
 * - Mouse parallax tracking
 * - Glassmorphic UI floating above stars
 * - Apple minimalism + SpaceX futurism
 */

const CinematicLayout = () => {
  return (
    <div className="app-container">
      {/* 3D Starfield - Ultra-immersive background */}
      <CinematicStarfield />

      {/* Minimal sidebar navigation */}
      <PremiumSidebar />

      {/* Main content area - floats above starfield with glassmorphism */}
      <main className="main-content fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default CinematicLayout;
