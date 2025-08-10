// src/app/voice/page.tsx
"use client";

import { useEffect, useRef, useCallback } from 'react';
import { Settings, X, Mic } from 'lucide-react';
import Link from 'next/link';

const NUM_PARTICLES = 7000;
const PARTICLE_SIZE = 1;
const GLOBE_RADIUS = 200;
const ROTATION_SPEED = 0.0005;

interface Particle {
  theta: number;
  phi: number;
  x: number;
  y: number;
  z: number;
  ox: number;
  oy: number;
  oz: number;
}

export default function VoiceTakingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rotation = useRef(0);
  const mouse = useRef({ x: 0, y: 0, isDown: false, ox: 0, oy: 0, px: 0, py: 0 });

  const onMouseDown = (e: MouseEvent | TouchEvent) => {
    mouse.current.isDown = true;
    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
    mouse.current.ox = clientX;
    mouse.current.oy = clientY;
  };

  const onMouseUp = () => {
    mouse.current.isDown = false;
  };

  const onMouseMove = (e: MouseEvent | TouchEvent) => {
    if (mouse.current.isDown) {
      const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
      const dx = clientX - mouse.current.ox;
      const dy = clientY - mouse.current.oy;
      mouse.current.px += dx;
      mouse.current.py += dy;
      mouse.current.ox = clientX;
      mouse.current.oy = clientY;
    }
  };

  const createParticles = useCallback(() => {
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
      const z = GLOBE_RADIUS * Math.cos(phi);
      particles.current.push({ theta, phi, x, y, z, ox: x, oy: y, oz: z });
    }
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const width = canvas.width;
    const height = canvas.height;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    context.clearRect(0, 0, width, height);

    const targetRotationX = mouse.current.py * 0.001;
    const targetRotationY = mouse.current.px * 0.001;

    rotation.current += ROTATION_SPEED;
    
    const sinX = Math.sin(targetRotationX);
    const cosX = Math.cos(targetRotationX);
    const sinY = Math.sin(targetRotationY + rotation.current);
    const cosY = Math.cos(targetRotationY + rotation.current);
    
    particles.current.forEach(p => {
        const ry1 = p.oy * cosX - p.oz * sinX;
        const rz1 = p.oy * sinX + p.oz * cosX;
        
        p.x = p.ox * cosY - rz1 * sinY;
        p.y = ry1;
        p.z = p.ox * sinY + rz1 * cosY;

        const scale = 1 + p.z / GLOBE_RADIUS * 0.5;
        const x2d = p.x * scale + halfWidth;
        const y2d = p.y * scale + halfHeight;
        const alpha = 0.5 + 0.5 * (p.z / GLOBE_RADIUS);

        if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
            const isCyan = p.theta > Math.PI;
            context.fillStyle = isCyan ? `rgba(0, 255, 255, ${alpha})` : `rgba(200, 200, 200, ${alpha})`;
            context.beginPath();
            context.arc(x2d, y2d, PARTICLE_SIZE * scale, 0, 2 * Math.PI);
            context.fill();
        }
    });

    requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    createParticles();
    render();

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchstart', onMouseDown);
    window.addEventListener('touchend', onMouseUp);
    window.addEventListener('touchmove', onMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onMouseDown);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('touchmove', onMouseMove);
    };
  }, [createParticles, render]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1C1C1E] text-white overflow-hidden">
      <Link href="#" className="absolute top-6 right-6 text-gray-400 hover:text-white">
        <Settings size={28} />
      </Link>
      
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="absolute bottom-10 flex w-full justify-between items-center px-10">
        <Link href="/">
           <button className="flex items-center justify-center h-16 w-16 bg-gray-800/70 rounded-full text-white hover:bg-gray-700/90 transition-colors">
            <X size={28} />
          </button>
        </Link>
        <button className="flex items-center justify-center h-16 w-16 bg-gray-800/70 rounded-full text-white hover:bg-gray-700/90 transition-colors">
          <Mic size={28} />
        </button>
      </div>
    </div>
  );
}
