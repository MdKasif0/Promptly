
"use client";

import { useEffect, useRef, useCallback, useState, useTransition } from 'react';
import { useActionState } from 'react';
import { Settings, X, Mic, MicOff } from 'lucide-react';
import Link from 'next/link';
import { voiceConversationAction } from '@/app/actions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

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
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rotation = useRef(0);
  const mouse = useRef({ x: 0, y: 0, isDown: false, ox: 0, oy: 0, px: 0, py: 0 });
  const globeRadius = useRef(200);
  const repulsion = useRef({ x: 0, y: 0, strength: 0 });
  
  const [state, formAction] = useActionState(voiceConversationAction, { audio: null, error: null });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const greetingSentRef = useRef(false);

  const startRecording = useCallback(async () => {
    if (isMuted || !streamRef.current || mediaRecorderRef.current?.state === 'recording') return;
    
    try {
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if(event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstart = () => {
        setIsListening(true);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      };

      mediaRecorderRef.current.onstop = () => {
        setIsListening(false);
        if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');
            startTransition(() => {
                formAction(formData);
            });
        }
      };

      mediaRecorderRef.current.start();
      
      if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          analyserRef.current = audioContextRef.current.createAnalyser();
          const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
          source.connect(analyserRef.current);
          analyserRef.current.fftSize = 512;
      }
      
      const bufferLength = analyserRef.current!.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let silenceStart = Date.now();
      
      const detectSilence = () => {
        if (mediaRecorderRef.current?.state !== 'recording') return;

        analyserRef.current?.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const avg = sum / bufferLength;

        if (avg < 5) { // Threshold for silence
          if (Date.now() - silenceStart > 1000) { // 1 second of silence
            if (mediaRecorderRef.current?.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
          }
        } else {
          silenceStart = Date.now();
        }
        requestAnimationFrame(detectSilence);
      };

      detectSilence();

    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
          variant: "destructive",
          title: "Recording Error",
          description: "Could not start recording. Please check microphone permissions.",
      });
    }
  }, [isMuted, formAction, toast, startTransition]);
  
  useEffect(() => {
    const getMicAndSendGreeting = async () => {
        if (greetingSentRef.current) return;
        greetingSentRef.current = true;
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Send a silent audio blob to trigger the agent's greeting
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const buffer = audioContext.createBuffer(1, 2, audioContext.sampleRate);
            const silentBlob = new Blob([new DataView(new ArrayBuffer(0))], { type: 'audio/webm' });
            
            const formData = new FormData();
            formData.append('audio', silentBlob, 'greeting.webm');
            startTransition(() => {
                formAction(formData);
            });
            
        } catch (error) {
            console.error("Error accessing microphone:", error);
            toast({
                variant: "destructive",
                title: "Microphone Access Denied",
                description: "Please enable microphone permissions in your browser settings to use voice chat.",
            });
        }
    };
    getMicAndSendGreeting();
    
    return () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
    }
  }, [toast, formAction, startTransition]);
  
  useEffect(() => {
    if (state.audio && audioRef.current) {
      setIsSpeaking(true);
      audioRef.current.src = state.audio;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      audioRef.current.onended = () => {
        setIsSpeaking(false);
      };
    }
    if (state.error) {
        toast({
            variant: "destructive",
            title: "Voice Error",
            description: state.error
        })
        setIsListening(false);
        setIsSpeaking(false);
    }
  }, [state, toast]);

  useEffect(() => {
    // When not speaking, and not muted, start listening
    if (!isSpeaking && !isMuted && mediaRecorderRef.current?.state !== 'recording') {
      startRecording();
    }
    // When we are speaking, stop listening
    if (isSpeaking && mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
  }, [isSpeaking, isMuted, startRecording]);
  
  const handleClose = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    router.push('/');
  };

  const toggleMute = () => {
    setIsMuted(prev => {
        const newMutedState = !prev;
        if (newMutedState && mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsListening(false);
        }
        return newMutedState;
    });
  }

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
            if (isListening && !isMuted) {
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
  }, [isListening, isSpeaking, isMuted]);

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
        <button 
          onClick={handleClose}
          className="absolute left-10 flex items-center justify-center h-16 w-16 bg-gray-800/70 rounded-full text-white hover:bg-gray-700/90 transition-colors">
          <X size={28} />
        </button>
        <button 
          onClick={toggleMute}
          disabled={isPending && !isSpeaking} // Disable mute toggle during initial greeting load
          className={cn(
            "flex items-center justify-center h-24 w-24 bg-gray-800/70 rounded-full text-white hover:bg-gray-700/90 transition-all duration-300 transform active:scale-110 disabled:opacity-50",
            isListening && !isMuted && "bg-green-500/80 scale-110",
            isSpeaking && "bg-cyan-500/80 scale-110",
            isMuted && "bg-red-500/80"
            )}>
          {isMuted ? <MicOff size={40}/> : <Mic size={40} />}
        </button>
      </div>
    </div>
  );
}
