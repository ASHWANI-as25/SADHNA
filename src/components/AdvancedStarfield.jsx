import React, { useEffect, useRef, useState } from 'react';

/**
 * Advanced Starfield Component
 * Features:
 * - Canvas-based rendering for performance
 * - Depth-based parallax with 3 layers
 * - Infinite starfield animation
 * - Mouse movement reactivity
 * - Optimized for 60fps
 */

const AdvancedStarfield = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const starsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Initialize stars with 3 depth layers
    const initStars = () => {
      starsRef.current = [];
      const starCount = 300;

      for (let i = 0; i < starCount; i++) {
        const depth = Math.random() * 3; // 0-3, three layers
        const speed = 0.2 + depth * 0.3; // Deeper = faster parallax

        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: depth,
          size: 0.5 + depth * 0.8, // Larger stars for closer layers
          opacity: 0.3 + depth * 0.5, // Brighter as closer
          speed: speed,
          vx: 0,
          vy: 0,
          color: getStarColor(depth),
          twinkleSpeed: 0.02 + Math.random() * 0.03,
          twinkleValue: Math.random(),
        });
      }
    };

    const getStarColor = (depth) => {
      const colors = [
        'rgba(255, 255, 255, #opacity)',      // White
        'rgba(255, 180, 120, #opacity)',      // Peach
        'rgba(147, 112, 219, #opacity)',      // Purple
        'rgba(236, 72, 153, #opacity)',       // Pink
        'rgba(59, 130, 246, #opacity)',       // Blue
      ];
      return colors[Math.floor(depth) % colors.length];
    };

    initStars();

    // Track mouse movement
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / canvas.width) * 2 - 1;
      mouseRef.current.y = (e.clientY / canvas.height) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Main animation loop
    const animate = () => {
      // Smooth camera velocity based on mouse
      velocityRef.current.x += (mouseRef.current.x - velocityRef.current.x) * 0.05;
      velocityRef.current.y += (mouseRef.current.y - velocityRef.current.y) * 0.05;

      // Clear canvas with slight trail effect
      ctx.fillStyle = 'rgba(5, 7, 13, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      starsRef.current.forEach((star) => {
        // Update twinkling
        star.twinkleValue += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinkleValue) * 0.5 + 0.5;

        // Apply parallax effect based on mouse movement
        const parallaxX = velocityRef.current.x * star.z * 50;
        const parallaxY = velocityRef.current.y * star.z * 50;

        star.x = (star.x + parallaxX) % canvas.width;
        if (star.x < 0) star.x = canvas.width;

        star.y = (star.y + parallaxY) % canvas.height;
        if (star.y < 0) star.y = canvas.height;

        // Draw star
        const finalOpacity = (star.opacity + twinkle * 0.3);
        ctx.fillStyle = star.color.replace('#opacity', finalOpacity);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw subtle glow for brighter stars
        if (star.z > 1) {
          ctx.strokeStyle = star.color.replace('#opacity', finalOpacity * 0.3);
          ctx.lineWidth = star.size * 0.5;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size + 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, rgba(5, 7, 13, 0.8) 0%, rgba(2, 3, 7, 1) 100%)',
      }}
    />
  );
};

export default AdvancedStarfield;
