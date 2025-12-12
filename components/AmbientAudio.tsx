import React, { useEffect, useRef } from 'react';

interface AmbientAudioProps {
  enabled: boolean;
}

export const AmbientAudio: React.FC<AmbientAudioProps> = ({ enabled }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    const initAudio = () => {
      if (audioCtxRef.current) return;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.value = 0; // Start silent
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Solfeggio 174 Hz (Pain relief/Safety) based chord
      const frequencies = [174, 174 * 1.5, 174 * 2, 174 * 0.5]; // Root, Fifth, Octave, Sub-Octave

      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        // Use Sine waves for pure, soothing tone
        osc.type = 'sine';
        osc.frequency.value = freq;

        // LFO creates a "breathing" effect by modulating volume
        lfo.type = 'sine';
        lfo.frequency.value = 0.05 + (Math.random() * 0.1); // Slow breathing (10-20s cycles)
        
        lfoGain.gain.value = 0.15; // Modulation depth
        
        // Base volume for this oscillator
        oscGain.gain.value = 0.1;

        // Connections: LFO -> LFO Gain -> Osc Gain -> Master Gain
        lfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain);
        
        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start();
        lfo.start();
        
        oscillatorsRef.current.push(osc, lfo);
      });
    };

    if (enabled) {
      if (!audioCtxRef.current) {
        initAudio();
      }
      // Fade in
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (masterGainRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0.3, audioCtxRef.current!.currentTime, 2);
      }
    } else {
      // Fade out
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
        setTimeout(() => {
            if (audioCtxRef.current?.state === 'running') {
                audioCtxRef.current.suspend();
            }
        }, 600);
      }
    }

    return () => {
      // Cleanup happens on unmount
    };
  }, [enabled]);

  return null; // No UI
};