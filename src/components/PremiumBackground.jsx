import React, { useEffect, useRef } from 'react';

/**
 * Premium Deep Space Background
 * Very subtle, elegant, minimal
 * - Millions of tiny stars with very low opacity
 * - Soft parallax movement (barely noticeable)
 * - Rare, elegant shooting stars
 * - No heavy textures or noise
 */

const PremiumBackground = () => {
  const containerRef = useRef(null);
  const starsRef = useRef([]);
  const shootingStarIntervalRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Generate stars with three density levels
    const generateStars = () => {
      const starsArray = [];
      
      // Distant stars (most) - very subtle
      for (let i = 0; i < 150; i++) {
        starsArray.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 0.3,
          opacity: 0.08,
          opacity_max: 0.12,
          duration: 2 + Math.random() * 3,
          delay: Math.random() * 5,
          className: 'star distant',
        });
      }
      
      // Mid stars
      for (let i = 0; i < 80; i++) {
        starsArray.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 0.5,
          opacity: 0.12,
          opacity_max: 0.18,
          duration: 2.5 + Math.random() * 3,
          delay: Math.random() * 5,
          className: 'star mid',
        });
      }
      
      // Bright stars (least) - still subtle
      for (let i = 0; i < 40; i++) {
        starsArray.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 0.8,
          opacity: 0.15,
          opacity_max: 0.25,
          duration: 3 + Math.random() * 4,
          delay: Math.random() * 5,
          className: 'star bright',
        });
      }
      
      return starsArray;
    };

    starsRef.current = generateStars();

    // Create star elements
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-field';
    
    starsRef.current.forEach((star) => {
      const starElement = document.createElement('div');
      starElement.className = star.className;
      starElement.style.left = star.x + '%';
      starElement.style.top = star.y + '%';
      starElement.style.setProperty('--duration', star.duration + 's');
      starElement.style.setProperty('--delay', star.delay + 's');
      starElement.style.setProperty('--opacity-min', star.opacity);
      starElement.style.setProperty('--opacity-max', star.opacity_max);
      starsContainer.appendChild(starElement);
    });
    
    container.appendChild(starsContainer);

    // Rarely spawn elegant shooting stars
    const spawnShootingStar = () => {
      // Random chance (very rare - only 1 in 30 seconds)
      if (Math.random() > 0.95) {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        
        const startX = Math.random() * 100;
        const startY = Math.random() * 60;
        
        shootingStar.style.left = startX + '%';
        shootingStar.style.top = startY + '%';
        
        starsContainer.appendChild(shootingStar);
        
        setTimeout(() => shootingStar.remove(), 2000);
      }
    };

    // Spawn shooting stars every few seconds
    shootingStarIntervalRef.current = setInterval(spawnShootingStar, 8000);

    return () => {
      if (shootingStarIntervalRef.current) {
        clearInterval(shootingStarIntervalRef.current);
      }
      starsContainer.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="space-background"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 20% 30%, rgba(124, 58, 237, 0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)
        `,
      }}
    />
  );
};

export default PremiumBackground;
