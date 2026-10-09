import React, { useRef, useEffect } from 'react';

interface ThreeDVisualizerProps {
  className?: string;
}

export const ThreeDVisualizer: React.FC<ThreeDVisualizerProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - rect.width / 2) * 0.002;
      mouseY = (e.clientY - rect.top - rect.height / 2) * 0.002;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 3D Orbit Nodes
    const nodes = Array.from({ length: 42 }, (_, i) => {
      const theta = (i / 42) * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 110 + Math.random() * 40;
      return {
        baseX: radius * Math.sin(phi) * Math.cos(theta),
        baseY: radius * Math.sin(phi) * Math.sin(theta),
        baseZ: radius * Math.cos(phi),
        size: 1.5 + Math.random() * 2.5,
        color: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#3b82f6' : '#a855f7',
      };
    });

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      angle += 0.012;
      const rotY = angle + mouseX;
      const rotX = mouseY * 1.5;

      // Draw background ambient glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 160);
      glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
      glowGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.08)');
      glowGrad.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 180, 0, Math.PI * 2);
      ctx.fill();

      // Draw concentric orbital rings with 3D tilt
      const rings = [70, 115, 150];
      rings.forEach((r, idx) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(1, 0.38 + idx * 0.08);
        ctx.rotate(angle * (idx % 2 === 0 ? 0.4 : -0.3));

        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 1 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(59, 130, 246, 0.2)';
        ctx.lineWidth = idx === 1 ? 1.5 : 1;
        ctx.stroke();
        ctx.restore();
      });

      // Project & sort 3D nodes
      const projected = nodes.map((node) => {
        // Rotate around Y
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = node.baseX * cosY - node.baseZ * sinY;
        const z1 = node.baseX * sinY + node.baseZ * cosY;

        // Rotate around X
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = node.baseY * cosX - z1 * sinX;
        const z2 = node.baseY * sinX + z1 * cosX;

        // Perspective projection
        const focal = 320;
        const scale = focal / (focal + z2);
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;
        const alpha = Math.max(0.15, Math.min(1, (z2 + 150) / 300));

        return {
          px,
          py,
          size: node.size * scale,
          z: z2,
          color: node.color,
          alpha,
        };
      });

      projected.sort((a, b) => b.z - a.z);

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 45) {
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 * (1 - dist / 45)})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      projected.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
