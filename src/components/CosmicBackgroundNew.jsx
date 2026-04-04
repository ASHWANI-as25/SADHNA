import { useEffect, useRef, useState } from 'react';
import '../styles/cosmic.css';

const CosmicBackground = () => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const [stars, setStars] = useState([]);

  // Generate random stars
  useEffect(() => {
    const generateStars = (count = 300) => {
      const starsArray = [];
      for (let i = 0; i < count; i++) {
        starsArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 5,
          bright: Math.random() > 0.9,
          color: ['#FFFFFF', '#FFE5B4', '#E0AFFE', '#FBCFE8'][Math.floor(Math.random() * 4)],
          layer: Math.random() > 0.5 ? 'near' : Math.random() > 0.5 ? 'mid' : 'far'
        });
      }
      return starsArray;
    };

    setStars(generateStars());
  }, []);

  // Create shooting stars at intervals
  useEffect(() => {
    const createShootingStar = () => {
      const colors = ['white', 'pink', 'purple', 'orange'];
      const shootingStar = {
        id: Date.now() + Math.random(),
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 2 + 2,
        startX: Math.random() * 100,
        startY: Math.random() * 60
      };

      shootingStarsRef.current = [...shootingStarsRef.current, shootingStar];

      // Remove after animation
      const timeout = setTimeout(() => {
        shootingStarsRef.current = shootingStarsRef.current.filter(
          (s) => s.id !== shootingStar.id
        );
      }, shootingStar.duration * 1000 + 500);

      return () => clearTimeout(timeout);
    };

    // Create shooting star every 4-8 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.4) createShootingStar();
    }, Math.random() * 4000 + 4000);

    return () => clearInterval(interval);
  }, []);

  // Create floating particles on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Randomly create particles
      if (Math.random() > 0.95 && particlesRef.current.length < 20) {
        const particle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 2,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4 - 2,
          duration: 2,
          color: ['#8B5CF6', '#EC4899', '#F97316'][Math.floor(Math.random() * 3)]
        };

        particlesRef.current = [...particlesRef.current, particle];

        // Remove particle after animation
        const timeout = setTimeout(() => {
          particlesRef.current = particlesRef.current.filter((p) => p.id !== particle.id);
        }, particle.duration * 1000);

        return () => clearTimeout(timeout);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const layers = ['far', 'mid', 'near'];

  return (
    <div className="cosmic-background" ref={containerRef}>
      {/* Background gradients */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(ellipse 500px 500px at 20% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 600px 400px at 80% 80%, rgba(248, 113, 113, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse 400px 600px at 10% 10%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
          `,
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />

      {/* Parallax Star Layers */}
      {layers.map((layer) => (
        <div
          key={layer}
          className={`parallax-layer ${layer}`}
          style={{
            zIndex: layer === 'near' ? 1 : layer === 'mid' ? 0 : -1
          }}
        >
          <div className="stars-container">
            {stars
              .filter((star) => star.layer === layer)
              .map((star) => (
                <div
                  key={star.id}
                  className={`star ${star.bright ? 'bright' : ''} ${star.color !== '#FFFFFF' ? 'colored' : ''}`}
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    '--duration': `${star.duration}s`,
                    '--delay': `${star.delay}s`,
                    '--glow': star.bright ? '3px' : '1px',
                    '--star-color': star.color,
                    animation: `twinkle ${star.duration}s ${star.delay}s infinite ease-in-out`,
                    width: `${star.size}px`,
                    height: `${star.size}px`
                  }}
                />
              ))}
          </div>
        </div>
      ))}

      {/* Shooting Stars */}
      {shootingStarsRef.current.map((shootingStar) => (
        <div
          key={shootingStar.id}
          className={`shooting-star ${shootingStar.color}`}
          style={{
            left: `${shootingStar.startX}%`,
            top: `${shootingStar.startY}%`,
            '--duration': `${shootingStar.duration}s`,
            animation: `shoot-star ${shootingStar.duration}s linear forwards`,
            zIndex: 2
          }}
        />
      ))}

      {/* Floating Particles */}
      {particlesRef.current.map((particle) => (
        <div
          key={particle.id}
          className={`particle ${particle.size < 2 ? 'small' : particle.size < 4 ? 'medium' : 'large'}`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            background: particle.color,
            '--tx': `${particle.vx * 100}px`,
            '--ty': `${particle.vy * 100}px`,
            animation: `float-particle ${particle.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
            boxShadow: `0 0 ${particle.size}px ${particle.color}`,
            zIndex: 3
          }}
        />
      ))}
    </div>
  );
};

export default CosmicBackground;