
"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import { Settings, X, Mic } from 'lucide-react';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { voiceConversationAction } from '@/app/actions';
import { cn } from '@/lib/utils';

const NUM_PARTICLES = 5000;
const PARTICLE_SIZE = 0.3;
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
  const globeRadius = useRef(200);
  const repulsion = useRef({ x: 0, y: 0, strength: 0 });
  
  const [state, formAction] = useFormState(voiceConversationAction, { audio: null, error: null });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formAction(formData);
        setIsListening(false);
      };
      mediaRecorderRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please ensure permissions are granted.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const onMicMouseDown = () => {
    startRecording();
  };

  const onMicMouseUp = () => {
    stopRecording();
  };
  
  useEffect(() => {
    if (state.audio && audioRef.current) {
      audioRef.current.src = state.audio;
      audioRef.current.play();
      setIsSpeaking(true);
      audioRef.current.onended = () => {
        setIsSpeaking(false);
      };
    }
    if(state.error) {
        alert(`Error: ${state.error}`);
        setIsListening(false);
        setIsSpeaking(false);
    }
  }, [state]);

  const onMouseDown = (e: MouseEvent | TouchEvent) => {
    mouse.current.isDown = true;
    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
    mouse.current.ox = clientX;
    mouse.current.oy = clientY;
    
    repulsion.current.x = clientX;
    repulsion.current.y = clientY;
    repulsion.current.strength = 100;
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
    particles.current = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const x = globeRadius.current * Math.sin(phi) * Math.cos(theta);
      const y = globeRadius.current * Math.sin(phi) * Math.sin(theta);
      const z = globeRadius.current * Math.cos(phi);
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
    
    if (repulsion.current.strength > 0) {
        repulsion.current.strength *= 0.95;
    }

    const sinX = Math.sin(targetRotationX);
    const cosX = Math.cos(targetRotationX);
    const sinY = Math.sin(targetRotationY + rotation.current);
    const cosY = Math.cos(targetRotationY + rotation.current);
    
    particles.current.forEach(p => {
        const ry1 = p.oy * cosX - p.oz * sinX;
        const rz1 = p.oy * sinX + p.oz * cosX;
        
        const rx1 = p.ox * cosY - rz1 * sinY;
        const rz2 = p.ox * sinY + rz1 * cosY;

        const scale = 1 + rz2 / globeRadius.current * 0.5;
        let x2d = rx1 * scale + halfWidth;
        let y2d = ry1 * scale + halfHeight;
        
        if (repulsion.current.strength > 0.1) {
            const dx = x2d - repulsion.current.x;
            const dy = y2d - repulsion.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                const force = (100 - dist) * 0.01 * repulsion.current.strength;
                x2d += (dx / dist) * force;
                y2d += (dy / dist) * force;
            }
        }

        const alpha = 0.5 + 0.5 * (rz2 / globeRadius.current);

        if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
            let color = `rgba(200, 200, 200, ${alpha})`;
            if (isListening) {
                 color = `rgba(0, 255, 0, ${alpha})`;
            } else if (isSpeaking) {
                 color = `rgba(0, 255, 255, ${alpha})`;
            }
            context.fillStyle = color;
            context.beginPath();
            context.arc(x2d, y2d, PARTICLE_SIZE * scale, 0, 2 * Math.PI);
            context.fill();
        }
    });

    requestAnimationFrame(render);
  }, [isListening, isSpeaking]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      canvas.width = newWidth;
      canvas.height = newHeight;
      globeRadius.current = Math.min(200, newWidth * 0.3, newHeight * 0.3);
      createParticles();
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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
      <audio ref={audioRef} className="hidden" />

      <div className="absolute bottom-10 flex w-full justify-center items-center px-10">
        <Link href="/">
           <button className="absolute left-10 flex items-center justify-center h-16 w-16 bg-gray-800/70 rounded-full text-white hover:bg-gray-700/90 transition-colors">
            <X size={28} />
          </button>
        </Link>
        <button 
          onMouseDown={onMicMouseDown}
          onMouseUp={onMicMouseUp}
          onTouchStart={onMicMouseDown}
          onTouchEnd={onMicMouseUp}
          className={cn(
            "flex items-center justify-center h-24 w-24 bg-gray-800/70 rounded-full text-white hover:bg-gray-700/90 transition-all duration-300 transform active:scale-110",
            isListening && "bg-green-500/80 scale-110",
            isSpeaking && "bg-cyan-500/80 scale-110"
            )}>
          <Mic size={40} />
        </button>
      </div>
    </div>
  );
}
