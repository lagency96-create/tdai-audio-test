
import React, { useMemo } from 'react';
import { SoundMode } from '../types';

interface VisualizerProps {
  mode: SoundMode;
  isPlaying: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ mode, isPlaying }) => {
  const theme = useMemo(() => {
    switch (mode) {
      case SoundMode.FOCUS: 
        return {
          c1: '#00f2fe', c2: '#4facfe', c3: '#00d2ff',
          speed: '12s', opacity: 1.0, scale: 'scale(1.1)'
        };
      case SoundMode.RELAX:
        return {
          c1: '#a18cd1', c2: '#fbc2eb', c3: '#8e2de2',
          speed: '22s', opacity: 0.8, scale: 'scale(1)'
        };
      case SoundMode.SLEEP:
        return {
          c1: '#1e3c72', c2: '#2a5298', c3: '#000046',
          speed: '40s', opacity: 0.6, scale: 'scale(1.3)'
        };
      case SoundMode.MOVE:
        return {
          c1: '#ff00cc', c2: '#333399', c3: '#00dbde',
          speed: '8s', opacity: 1.0, scale: 'scale(1.2)'
        };
      default:
        return {
          c1: '#00d2ff', c2: '#9d50bb', c3: '#4facfe',
          speed: '15s', opacity: 0.8, scale: 'scale(1)'
        };
    }
  }, [mode]);

  return (
    <div className="fixed inset-0 z-0 bg-[#020617] overflow-hidden">
      {/* Conteneur Gooey (L'effet de fusion se passe ici) */}
      <div 
        className="absolute inset-0 flex items-center justify-center transition-all duration-[3000ms]"
        style={{ 
          filter: 'blur(60px) contrast(180%)', 
          backgroundColor: '#020617',
          opacity: isPlaying ? theme.opacity : 0.3,
          transform: theme.scale
        }}
      >
        {/* Orbe 1 */}
        <div 
          className="absolute w-[50vw] h-[50vw] rounded-full animate-blob-1"
          style={{ 
            background: theme.c1,
            animationDuration: theme.speed,
            animationPlayState: isPlaying ? 'running' : 'paused'
          }}
        />
        
        {/* Orbe 2 */}
        <div 
          className="absolute w-[45vw] h-[45vw] rounded-full animate-blob-2"
          style={{ 
            background: theme.c2,
            animationDuration: `calc(${theme.speed} * 1.4)`,
            animationPlayState: isPlaying ? 'running' : 'paused',
            animationDelay: '-2s'
          }}
        />

        {/* Orbe 3 */}
        <div 
          className="absolute w-[40vw] h-[40vw] rounded-full animate-blob-3"
          style={{ 
            background: theme.c3,
            animationDuration: `calc(${theme.speed} * 0.8)`,
            animationPlayState: isPlaying ? 'running' : 'paused',
            animationDelay: '-4s'
          }}
        />
      </div>

      {/* Superposition pour adoucir et donner du grain */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-radial from-transparent via-[#020617]/40 to-[#020617]" />
      <div className="absolute inset-0 z-1 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob-1 {
          0%, 100% { transform: translate(-20%, -20%) scale(1); }
          33% { transform: translate(20%, 10%) scale(1.1); }
          66% { transform: translate(-10%, 20%) scale(0.9); }
        }
        @keyframes blob-2 {
          0%, 100% { transform: translate(20%, 20%) scale(1); }
          33% { transform: translate(-20%, -10%) scale(1.2); }
          66% { transform: translate(10%, -20%) scale(0.8); }
        }
        @keyframes blob-3 {
          0%, 100% { transform: translate(0%, 0%) scale(1.1); }
          50% { transform: translate(-30%, 30%) scale(0.8); }
        }
        .animate-blob-1 { animation: blob-1 infinite ease-in-out; }
        .animate-blob-2 { animation: blob-2 infinite ease-in-out; }
        .animate-blob-3 { animation: blob-3 infinite ease-in-out; }
      `}} />
    </div>
  );
};

export default Visualizer;
