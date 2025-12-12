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

      // SOOTHING & OPTIMISTIC COMPOSITION
      // Lowered the octave for warmth (calm), kept Major 7th/9th intervals for optimism.
      // C3, G3, B3, E4, D4
      const frequencies = [
        130.81, // C3 - Warm root anchor
        196.00, // G3 - Stability
        246.94, // B3 - Major 7th (Hopeful/Dreamy)
        329.63, // E4 - Major 3rd (Optimism)
        293.66  // D4 - 9th (Gentle, uplifting extension)
      ]; 

      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        // Use Sine waves for pure, non-fatiguing, soothing texture
        osc.type = 'sine';
        osc.frequency.value = freq;

        // Very slow LFO for a "breathing" rhythm (Calm)
        lfo.type = 'sine';
        // 0.05Hz to 0.1Hz = 10 to 20 seconds per cycle
        lfo.frequency.value = 0.05 + (Math.random() * 0.05); 
        
        lfoGain.gain.value = 0.15; // Gentle volume swelling
        
        // Lower volume to create a background pad
        oscGain.gain.value = 0.08;

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
        masterGainRef.current.gain.setTargetAtTime(0.3, audioCtxRef.current!.currentTime, 3);
      }
    } else {
      // Fade out
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 1);
        setTimeout(() => {
            if (audioCtxRef.current?.state === 'running') {
                audioCtxRef.current.suspend();
            }
        }, 1100);
      }
    }

    return () => {
      // Cleanup happens on unmount
    };
  }, [enabled]);

  return null; // No UI
};