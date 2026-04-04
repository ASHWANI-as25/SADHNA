import React, { useEffect, useRef, useState } from 'react';

/**
 * CinematicStarfield
 * Ultra-premium 3D space experience with:
 * - Multi-layer depth system (far/mid/near)
 * - Stars moving toward camera continuously
 * - Perspective scaling and motion blur
 * - Mouse parallax tracking
 * - 60fps optimized performance
 * 
 * Philosophy: Calm but powerful. Feels like meditation in space.
 */

class Star {
  constructor(canvas, layer) {
    this.canvas = canvas;
    this.layer = layer; // 0 (far), 1 (mid), 2 (near)
    
    // Depth ranges for layers
    const depthRanges = [
      { min: 100, max: 500, opacity: [0.1, 0.2], speed: 0.3 },    // Far
      { min: 50, max: 100, opacity: [0.3, 0.6], speed: 0.8 },     // Mid
      { min: 5, max: 50, opacity: [0.5, 1.0], speed: 2.0 }        // Near
    ];
    
    const range = depthRanges[layer];
    
    this.z = Math.random() * (range.max - range.min) + range.min;
    this.x = Math.random() * canvas.width - canvas.width / 2;
    this.y = Math.random() * canvas.height - canvas.height / 2;
    this.baseOpacity = Math.random() * (range.opacity[1] - range.opacity[0]) + range.opacity[0];
    this.speedMultiplier = range.speed;
    this.size = this.calculateSize();
    this.twinklePhase = Math.random() * Math.PI * 2;
    this.twinkleSpeed = Math.random() * 0.005 + 0.002; // Slower twinkling
    
    // Color variation: white with blue/purple tint
    this.hue = Math.random() * 60 + 200; // 200-260 (blue to purple)
    this.saturation = Math.random() * 30 + 10; // 10-40%
  }

  update(cameraOffsetX = 0, cameraOffsetY = 0) {
    // Move star toward camera (increase z)
    this.z -= this.speedMultiplier;
    
    // Reset z when star reaches near plane
    if (this.z <= 0) {
      this.z = 500;
      this.x = Math.random() * this.canvas.width - this.canvas.width / 2;
      this.y = Math.random() * this.canvas.height - this.canvas.height / 2;
      this.baseOpacity = Math.random() * 0.4 + 0.1;
    }

    // Apply camera/mouse offset for parallax (stronger for closer stars)
    const parallaxStrength = 1 - this.z / 500; // Closer stars affected more
    this.screenX = (this.x + cameraOffsetX * parallaxStrength) * (500 / this.z);
    this.screenY = (this.y + cameraOffsetY * parallaxStrength) * (500 / this.z);

    // Update twinkling
    this.twinklePhase += this.twinkleSpeed;
    this.currentOpacity = this.baseOpacity * (0.7 + 0.3 * Math.sin(this.twinklePhase));

    // Update size based on depth (perspective scaling)
    this.size = this.calculateSize();
  }

  calculateSize() {
    // Exponential scale: distant stars tiny, close stars larger
    const maxSize = this.layer === 2 ? 3 : this.layer === 1 ? 1.5 : 0.5;
    return (1 - this.z / 500) * maxSize;
  }

  draw(ctx) {
    const x = this.canvas.width / 2 + this.screenX;
    const y = this.canvas.height / 2 + this.screenY;

    // Skip if off-screen
    if (x < -50 || x > this.canvas.width + 50 || y < -50 || y > this.canvas.height + 50) {
      return;
    }

    // Motion blur for near stars
    if (this.layer === 2 && this.size > 1) {
      ctx.strokeStyle = `hsla(${this.hue}, ${this.saturation}%, 70%, ${this.currentOpacity * 0.3})`;
      ctx.lineWidth = this.size * 0.5;
      ctx.beginPath();
      ctx.moveTo(x + this.speedMultiplier * 2, y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Main star glow
    const glowSize = this.size * (1.5 + 0.5 * Math.sin(this.twinklePhase));
    
    // Core
    ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, 90%, ${this.currentOpacity})`;
    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Subtle glow
    ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, 70%, ${this.currentOpacity * 0.4})`;
    ctx.beginPath();
    ctx.arc(x, y, glowSize, 0, Math.PI * 2);
    ctx.fill();
  }
}

class ShootingStar {
  constructor(canvas) {
    this.canvas = canvas;
    this.startX = Math.random() * canvas.width;
    this.startY = Math.random() * canvas.height * 0.3; // Top portion
    this.endX = this.startX + Math.random() * 400 - 200;
    this.endY = this.startY + Math.random() * 300 + 100;
    this.duration = 1500 + Math.random() * 500; // 1.5-2s
    this.elapsedTime = 0;
    this.length = 150; // Longer trail
  }

  update(deltaTime) {
    this.elapsedTime += deltaTime;
    return this.elapsedTime < this.duration;
  }

  draw(ctx) {
    if (this.elapsedTime >= this.duration) return;

    const progress = this.elapsedTime / this.duration;
    const easeProgress = progress < 0.5 
      ? 2 * progress * progress 
      : -1 + (4 - 2 * progress) * progress; // Ease in-out

    const x = this.startX + (this.endX - this.startX) * easeProgress;
    const y = this.startY + (this.endY - this.startY) * easeProgress;

    // Fade out toward end
    const opacity = Math.max(0, 1 - progress * 1.2);

    // Trail
    const trailX = x - (this.endX - this.startX) * 0.3;
    const trailY = y - (this.endY - this.startY) * 0.3;

    ctx.strokeStyle = `rgba(255, 220, 150, ${opacity * 0.6})`;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(trailX, trailY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Bright core
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

const CinematicStarfield = () => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const starsRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const cameraOffsetRef = useRef({ x: 0, y: 0 });
  const lastShootingStarRef = useRef(0);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  // Initialize starfield
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Create stars
    const stars = [];
    // Far layer: 200 stars
    for (let i = 0; i < 200; i++) {
      stars.push(new Star(canvas, 0));
    }
    // Mid layer: 150 stars
    for (let i = 0; i < 150; i++) {
      stars.push(new Star(canvas, 1));
    }
    // Near layer: 100 stars
    for (let i = 0; i < 100; i++) {
      stars.push(new Star(canvas, 2));
    }
    starsRef.current = stars;

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener('resize', handleResize);

    // Handle mouse move
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Calculate camera offset (parallax effect)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxOffset = 100;
      
      cameraOffsetRef.current.x = ((e.clientX - centerX) / centerX) * maxOffset;
      cameraOffsetRef.current.y = ((e.clientY - centerY) / centerY) * maxOffset;
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Clear canvas with space background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle ambient glow
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      gradient.addColorStop(0, 'rgba(70, 20, 150, 0.01)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      starsRef.current.forEach(star => {
        star.update(cameraOffsetRef.current.x, cameraOffsetRef.current.y);
        star.draw(ctx);
      });

      // Update shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter(star => star.update(deltaTime));
      shootingStarsRef.current.forEach(star => star.draw(ctx));

      // Spawn new shooting star frequently
      if (now - lastShootingStarRef.current > 3000 + Math.random() * 2000) {
        shootingStarsRef.current.push(new ShootingStar(canvas));
        lastShootingStarRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
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
        display: 'block',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default CinematicStarfield;
