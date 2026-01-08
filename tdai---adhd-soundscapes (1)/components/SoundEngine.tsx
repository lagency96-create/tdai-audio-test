
import React, { useEffect, useRef, useCallback } from 'react';
import { SoundState, SoundMode } from '../types';

interface SoundEngineProps {
  state: SoundState;
}

const SoundEngine: React.FC<SoundEngineProps> = ({ state }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const leftOscRef = useRef<OscillatorNode | null>(null);
  const rightOscRef = useRef<OscillatorNode | null>(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      mainGainRef.current = audioCtxRef.current.createGain();
      mainGainRef.current.connect(audioCtxRef.current.destination);
    }
  }, []);

  const createNoiseBuffer = (type: 'white' | 'brown' | 'pink') => {
    const ctx = audioCtxRef.current!;
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'brown') {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        let white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain adjustment
      }
    } else { // Pink
        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            let white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            output[i] *= 0.11;
            b6 = white * 0.115926;
        }
    }
    return buffer;
  };

  const startSound = useCallback(() => {
    if (!audioCtxRef.current || !mainGainRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Stop previous if exists
    if (noiseSourceRef.current) noiseSourceRef.current.stop();
    if (leftOscRef.current) leftOscRef.current.stop();
    if (rightOscRef.current) rightOscRef.current.stop();

    if (state.noiseType !== 'none') {
      noiseSourceRef.current = ctx.createBufferSource();
      noiseSourceRef.current.buffer = createNoiseBuffer(state.noiseType);
      noiseSourceRef.current.loop = true;
      noiseSourceRef.current.connect(mainGainRef.current);
      noiseSourceRef.current.start();
    }

    // Binaural Beats setup
    const baseFreq = 200;
    const beatFreq = state.binauralFreq;

    const leftMerger = ctx.createChannelMerger(2);
    const rightMerger = ctx.createChannelMerger(2);
    
    leftOscRef.current = ctx.createOscillator();
    leftOscRef.current.frequency.value = baseFreq;
    const leftGain = ctx.createGain();
    leftGain.gain.value = 0.1;
    leftOscRef.current.connect(leftGain);
    
    // Panning (approximate since we want isolated channels)
    const pannerL = ctx.createStereoPanner();
    pannerL.pan.value = -1;
    leftGain.connect(pannerL);
    pannerL.connect(mainGainRef.current);

    rightOscRef.current = ctx.createOscillator();
    rightOscRef.current.frequency.value = baseFreq + beatFreq;
    const rightGain = ctx.createGain();
    rightGain.gain.value = 0.1;
    rightOscRef.current.connect(rightGain);
    
    const pannerR = ctx.createStereoPanner();
    pannerR.pan.value = 1;
    rightGain.connect(pannerR);
    pannerR.connect(mainGainRef.current);

    leftOscRef.current.start();
    rightOscRef.current.start();

    ctx.resume();
  }, [state.noiseType, state.binauralFreq]);

  useEffect(() => {
    if (state.isPlaying) {
      initAudio();
      startSound();
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }
    }
  }, [state.isPlaying, startSound, initAudio]);

  useEffect(() => {
    if (mainGainRef.current) {
      mainGainRef.current.gain.setTargetAtTime(state.volume / 100, audioCtxRef.current!.currentTime, 0.1);
    }
  }, [state.volume]);

  return null; // Logic only component
};

export default SoundEngine;
