
import React, { useState, useEffect } from 'react';
import { SoundMode, SoundState } from './types';
import Visualizer from './components/Visualizer';
import SoundEngine from './components/SoundEngine';
import { getFocusRecommendation } from './services/geminiService';

const App: React.FC = () => {
  const [soundState, setSoundState] = useState<SoundState>({
    mode: SoundMode.FOCUS,
    isPlaying: false,
    volume: 50,
    noiseType: 'brown',
    binauralFreq: 12,
  });

  const [taskInput, setTaskInput] = useState('');
  const [recommendation, setRecommendation] = useState<{understanding: string, mantra: string, strategy: string} | null>(null);
  const [isLoadingRec, setIsLoadingRec] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    let freq = 12;
    let noise: 'white' | 'brown' | 'pink' | 'none' = 'brown';

    switch (soundState.mode) {
      case SoundMode.FOCUS: freq = 14; noise = 'brown'; break;
      case SoundMode.RELAX: freq = 8; noise = 'pink'; break;
      case SoundMode.SLEEP: freq = 3; noise = 'pink'; break;
      case SoundMode.MOVE: freq = 22; noise = 'white'; break;
    }

    setSoundState(prev => ({ ...prev, binauralFreq: freq, noiseType: noise }));
  }, [soundState.mode]);

  const togglePlayback = () => {
    setSoundState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleModeChange = (mode: SoundMode) => {
    setSoundState(prev => ({ ...prev, mode }));
  };

  const handleAIAssist = async () => {
    if (!taskInput.trim()) return;
    setIsLoadingRec(true);
    const rec = await getFocusRecommendation(taskInput);
    setRecommendation(rec);
    handleModeChange(rec.mode as SoundMode);
    setIsLoadingRec(false);
    setSoundState(prev => ({ ...prev, isPlaying: true }));
    setTimeLeft(25 * 60); 
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const LogoIcon = ({ className = "w-10 h-10" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="46" stroke="url(#logo_grad)" strokeWidth="2.5" />
      <g style={{ filter: 'drop-shadow(0 0 3px rgba(0, 210, 255, 0.4))' }}>
        <circle cx="38" cy="38" r="4.5" fill="url(#logo_grad)" />
        <circle cx="62" cy="45" r="4.5" fill="url(#logo_grad)" />
        <circle cx="50" cy="65" r="4.5" fill="url(#logo_grad)" />
        <circle cx="35" cy="58" r="3.5" fill="url(#logo_grad)" />
        <circle cx="65" cy="62" r="3.5" fill="url(#logo_grad)" />
        <line x1="38" y1="38" x2="62" y2="45" stroke="url(#logo_grad)" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="38" y1="38" x2="35" y2="58" stroke="url(#logo_grad)" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="35" y1="58" x2="50" y2="65" stroke="url(#logo_grad)" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="50" y1="65" x2="62" y2="45" stroke="url(#logo_grad)" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="62" y1="45" x2="65" y2="62" stroke="url(#logo_grad)" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="50" y1="65" x2="65" y2="62" stroke="url(#logo_grad)" strokeWidth="1" strokeOpacity="0.5" />
      </g>
      <defs>
        <linearGradient id="logo_grad" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#00d2ff" />
          <stop offset="100%" stopColor="#9d50bb" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-between p-6 md:p-10 overflow-hidden">
      {/* Visualizer en Z-0 (le fond d'écran) */}
      <Visualizer mode={soundState.mode} isPlaying={soundState.isPlaying} />
      <SoundEngine state={soundState} />

      {/* Contenu en Z-20 pour être au-dessus du visualiseur */}
      <header className="w-full max-w-6xl flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <LogoIcon className="w-8 h-8" />
          <h1 className="text-xl font-outfit font-bold tracking-[0.2em] brand-gradient-text uppercase">TDAI</h1>
        </div>
        
        <div className="hidden md:flex glass px-6 py-2.5 rounded-2xl items-center gap-6 border-white/5">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Bio-Sync</span>
            <span className="text-xs font-mono text-blue-300">{soundState.binauralFreq}Hz</span>
          </div>
          <div className="w-px h-6 bg-white/5" />
          <div className="flex flex-col items-start">
            <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Resonance</span>
            <span className="text-xs font-mono text-purple-300 capitalize">{soundState.noiseType}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center gap-12 z-20">
        <div className="text-center space-y-6 w-full relative">
          {timeLeft !== null && (
            <div className="text-[10rem] md:text-[14rem] font-outfit font-extralight tracking-tighter tabular-nums text-white/5 absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              {formatTime(timeLeft)}
            </div>
          )}
          
          <div className="flex flex-col items-center gap-6 px-4 relative z-20">
            <h2 className="text-2xl md:text-4xl font-outfit text-white/90 font-light max-w-xl leading-snug tracking-tight">
              {recommendation ? (
                <span className="animate-in fade-in slide-in-from-top-4 block italic">
                  "{recommendation.understanding}"
                </span>
              ) : (
                "Quelle est votre intention ?"
              )}
            </h2>
            
            {recommendation && (
              <div className="space-y-4 animate-in fade-in zoom-in duration-700 w-full max-w-lg">
                <div className="glass px-10 py-8 rounded-[2.5rem] border-white/5 shadow-xl">
                   <p className="text-2xl brand-gradient-text font-bold mb-3">
                    {recommendation.mantra}
                  </p>
                  <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-[0.3em] leading-relaxed">
                    Stratégie : {recommendation.strategy}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {!recommendation && (
          <div className="w-full max-w-lg px-4 animate-in fade-in duration-700">
            <div className="relative">
              <textarea 
                rows={2}
                placeholder="Exprimez votre besoin..."
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAIAssist(); } }}
                className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] px-8 py-7 text-xl focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-neutral-700 backdrop-blur-2xl resize-none text-white/80"
              />
              <button 
                onClick={handleAIAssist}
                disabled={isLoadingRec || !taskInput.trim()}
                className="absolute right-5 bottom-5 brand-gradient-bg text-white px-8 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-20 shadow-lg"
              >
                {isLoadingRec ? 'Calcul...' : 'Synchroniser'}
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-10">
          <button 
             onClick={() => setSoundState(p => ({...p, volume: Math.max(0, p.volume - 5)}))}
             className="w-12 h-12 rounded-full glass flex items-center justify-center text-neutral-400 hover:text-white transition-all border-white/5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.536 8.464a5 5 0 010 7.072M12 6v12l-4-4H4V10h4l4-4z" /></svg>
          </button>

          <button 
            onClick={togglePlayback}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700 relative group shadow-2xl ${
              soundState.isPlaying 
              ? 'bg-white text-black' 
              : 'brand-gradient-bg text-white'
            }`}
          >
            {soundState.isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-8 h-8 translate-x-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          <button 
             onClick={() => setSoundState(p => ({...p, volume: Math.min(100, p.volume + 5)}))}
             className="w-12 h-12 rounded-full glass flex items-center justify-center text-neutral-400 hover:text-white transition-all border-white/5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 6v12l-4-4H4V10h4l4-4z" /></svg>
          </button>
        </div>
      </main>

      <footer className="w-full max-w-4xl z-20 flex flex-col items-center gap-8 mt-auto pb-4">
        <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
          {(Object.keys(SoundMode) as Array<keyof typeof SoundMode>).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(SoundMode[mode])}
              className={`px-8 py-3 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
                soundState.mode === SoundMode[mode]
                ? 'bg-white text-black shadow-lg'
                : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6 text-[8px] text-neutral-700 font-bold uppercase tracking-[0.4em]">
          <button className="hover:text-blue-500 transition-colors" onClick={() => { setRecommendation(null); setTimeLeft(null); }}>Reset</button>
          <span className="w-1 h-1 rounded-full bg-neutral-900" />
          <span>Core v4.2</span>
          <span className="w-1 h-1 rounded-full bg-neutral-900" />
          <button className="hover:text-purple-500 transition-colors">Système</button>
        </div>
      </footer>
    </div>
  );
};

export default App;
