import { useEffect, useRef, useState } from 'react';

const CosmicBackground = () => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create OPTIMIZED star field (reduced for better performance)
    const stars = [];
    const starCount = 800; // Optimized from 2000
    const useGPU = window.innerWidth > 1920; // Only complex effects on larger screens

    for (let i = 0; i < starCount; i++) {
      const depth = Math.random(); // 0-1 for parallax depth
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 0.8 + 0.1,
        opacity: Math.random() * 0.7 + 0.3,
        color: ['255, 255, 255', '200, 220, 255', '150, 200, 255'][Math.floor(Math.random() * 3)],
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        originalOpacity: Math.random() * 0.7 + 0.3,
        depth: depth, // For parallax
        vx: (Math.random() - 0.5) * 0.02 * (1 - depth), // Slower for far stars
        vy: (Math.random() - 0.5) * 0.02 * (1 - depth),
      });
    }

    // Create multiple nebula layers (reduced for performance)
    const nebulas = [];
    const nebulasCount = useGPU ? 8 : 4; // Reduce nebulas on smaller screens
    for (let i = 0; i < nebulasCount; i++) {
      nebulas.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 300 + 150,
        opacity: 0.01 + Math.random() * 0.04,
        color: [
          { r: 30, g: 58, b: 138 },   // Deep blue
          { r: 75, g: 0, b: 130 },    // Indigo
          { r: 25, g: 25, b: 112 },   // Midnight blue
          { r: 50, g: 30, b: 100 },   // Cosmic purple
        ][Math.floor(Math.random() * 4)],
        vx: (Math.random() - 0.5) * 0.01,
        vy: (Math.random() - 0.5) * 0.01,
      });
    }

    // Create particle effects (optimized)
    const particles = [];
    const particleCount = useGPU ? 200 : 100; // Reduce particles on smaller screens
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 0.3,
        opacity: Math.random() * 0.3,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        life: Math.random() * 200 + 100,
        maxLife: Math.random() * 200 + 100,
      });
    }

    const animate = () => {
      // Clear with deep space black
      ctx.fillStyle = '#001a33';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw layered nebulas with soft gradients
      nebulas.forEach((nebula) => {
        const gradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius);
        
        // Create gradient layers for depth
        gradient.addColorStop(0, `rgba(${nebula.color.r}, ${nebula.color.g}, ${nebula.color.b}, ${nebula.opacity * 1.5})`);
        gradient.addColorStop(0.4, `rgba(${nebula.color.r}, ${nebula.color.g}, ${nebula.color.b}, ${nebula.opacity})`);
        gradient.addColorStop(1, `rgba(${nebula.color.r}, ${nebula.color.g}, ${nebula.color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(nebula.x - nebula.radius, nebula.y - nebula.radius, nebula.radius * 2, nebula.radius * 2);

        // Animate nebula slowly
        nebula.x += nebula.vx;
        nebula.y += nebula.vy;

        // Wrap around
        if (nebula.x > canvas.width + 300) nebula.x = -300;
        if (nebula.x < -300) nebula.x = canvas.width + 300;
        if (nebula.y > canvas.height + 300) nebula.y = -300;
        if (nebula.y < -300) nebula.y = canvas.height + 300;
      });

      // Draw stars with depth effect (parallax)
      stars.forEach((star) => {
        // Twinkling animation (skip on low-end devices for performance)
        if (useGPU) {
          star.twinklePhase += star.twinkleSpeed;
          star.opacity = star.originalOpacity + Math.sin(star.twinklePhase) * 0.3;
        }

        // Draw star (skip glow on small screens)
        ctx.fillStyle = `rgba(${star.color}, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * (1 + star.depth * 0.5), 0, Math.PI * 2);
        ctx.fill();

        // Add glow halo only on larger screens
        if (useGPU) {
          const glowIntensity = star.opacity * (1 + star.depth);
          ctx.fillStyle = `rgba(${star.color}, ${glowIntensity * 0.4})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * (2 + star.depth * 3), 0, Math.PI * 2);
          ctx.fill();
        }

        // Movement (slower parallax for far stars)
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around
        if (star.x > canvas.width) star.x = 0;
        if (star.x < 0) star.x = canvas.width;
        if (star.y > canvas.height) star.y = 0;
        if (star.y < 0) star.y = canvas.height;
      });

      // Draw floating particles (skip on smaller screens for performance)
      if (useGPU) {
        particles.forEach((particle, idx) => {
          particle.life--;
          if (particle.life <= 0) {
            // Respawn
            particles[idx] = {
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              radius: Math.random() * 0.3,
              opacity: Math.random() * 0.3,
              vx: (Math.random() - 0.5) * 0.1,
              vy: (Math.random() - 0.5) * 0.1,
              life: Math.random() * 200 + 100,
              maxLife: Math.random() * 200 + 100,
            };
            return;
          }

          const lifePercent = particle.life / particle.maxLife;
          ctx.fillStyle = `rgba(150, 200, 255, ${particle.opacity * lifePercent})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();

          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += 0.01; // Slight gravity effect
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Mouse tracking for future parallax effects
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 pointer-events-none"
      style={{ background: 'linear-gradient(180deg, #001a33 0%, #0a0f22 50%, #001a33 100%)' }}
    />
  );
};

export default CosmicBackground;
