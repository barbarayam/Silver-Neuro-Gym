import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ModeConfig, WordEntity, GameStats, InputMethod } from '../types';
import { CANVAS_PADDING, FONT_BASE_SIZE, ELDERLY_SCALE, WORD_IMAGES } from '../constants';

interface GameCanvasProps {
  mode: ModeConfig;
  category: string;
  onEndGame: (stats: GameStats) => void;
  inputMethod: InputMethod;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ mode, category, onEndGame, inputMethod }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestRef = useRef<number>(0);
  const [statusMessage, setStatusMessage] = useState(inputMethod === 'CAMERA' ? "Initializing Optical Sensors..." : "Touch Mode Active");
  const [roundInfo, setRoundInfo] = useState<{current: number, total: number}>({current: 1, total: 1});
  const audioCtxRef = useRef<AudioContext | null>(null);

  const gameStateRef = useRef({
    roundIndex: 0,
    targetWord: "",
    isImageLoaded: false,
    words: [] as WordEntity[],
    feedbackColor: "",
    feedbackTimer: 0
  });

  const imageRef = useRef<HTMLImageElement>(new Image());

  const handPosRef = useRef<{ x: number, y: number, isPinching: boolean, isVisible: boolean }>({ 
    x: 0, y: 0, isPinching: false, isVisible: false 
  });
  const prevPinchStateRef = useRef<boolean>(false);
  const mousePosRef = useRef<{ x: number, y: number, isDown: boolean }>({ x: 0, y: 0, isDown: false });

  const statsRef = useRef<{
    startTime: number;
    attempts: number;
    completedRounds: number;
    reactionData: number[];
  }>({ startTime: Date.now(), attempts: 0, completedRounds: 0, reactionData: [] });

  // Initialize Audio Context
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtxRef.current = new AudioContextClass();
    }
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playSound = useCallback((type: 'grab' | 'success' | 'error') => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    if (type === 'grab') {
      const osc = ctx.createOscillator();
      osc.connect(gain);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'success') {
      // C Major Chord
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        oscGain.gain.setValueAtTime(0.05, now + i * 0.05);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.6);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.6);
      });
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      osc.connect(gain);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  }, []);

  const getAllWords = useCallback(() => {
    return Object.values(mode.content.wordLists).flat();
  }, [mode]);

  const startRound = useCallback((index: number) => {
    const list = mode.content.wordLists[category];
    if (!list || index >= list.length) {
       onEndGame({
          reactionTimes: statsRef.current.reactionData,
          pinchAttempts: statsRef.current.attempts,
          successfulGrabs: statsRef.current.completedRounds,
          startTime: statsRef.current.startTime,
          endTime: Date.now(),
          category
        });
      return;
    }

    const target = list[index];
    gameStateRef.current.targetWord = target;
    gameStateRef.current.roundIndex = index;
    gameStateRef.current.isImageLoaded = false;
    gameStateRef.current.feedbackColor = "";
    setRoundInfo({ current: index + 1, total: list.length });

    // --- ROBUST IMAGE LOADING STRATEGY ---
    // 1. Try Curated Unsplash Image
    // 2. If fail, Try LoremFlickr (Dynamic)
    // 3. If fail, Use Text Placeholder
    
    const curatedImage = WORD_IMAGES[target];
    
    const loadFallback = () => {
        console.log(`Primary image failed for ${target}, trying fallback...`);
        imageRef.current.onerror = () => {
            console.log(`Fallback failed for ${target}, using placeholder.`);
            // Final fallback: High contrast placeholder with text
            imageRef.current.src = `https://placehold.co/600x600/000000/FFFFFF/png?text=${target}`;
        };
        // Use random lock to ensure a fresh attempt
        imageRef.current.src = `https://loremflickr.com/500/500/${target.toLowerCase()}?lock=${Date.now()}`;
    };

    imageRef.current.removeAttribute('crossOrigin'); // Ensure no CORS checks
    
    imageRef.current.onload = () => { 
        gameStateRef.current.isImageLoaded = true; 
    };
    
    if (curatedImage) {
        imageRef.current.onerror = loadFallback;
        imageRef.current.src = curatedImage;
    } else {
        loadFallback();
    }
    // -------------------------------------

    const allDistractors = getAllWords().filter(w => w !== target);
    
    // Use spawnCount from physics config, default to 4 (1 target + 3 distractors) if missing
    const totalWords = mode.physics.spawnCount || 4;
    const numDistractors = Math.max(0, totalWords - 1);

    const distractors: string[] = [];
    for (let i = 0; i < numDistractors; i++) {
        const r = Math.floor(Math.random() * allDistractors.length);
        distractors.push(allDistractors[r]);
    }

    const roundWords = [target, ...distractors];
    // Shuffle
    for (let i = roundWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roundWords[i], roundWords[j]] = [roundWords[j], roundWords[i]];
    }

    // Use scale from physics config
    const scale = mode.physics.scale || ELDERLY_SCALE;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;

    gameStateRef.current.words = roundWords.map((text, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = mode.physics.speed * 2;
      
      let spawnX, spawnY;
      
      if (isPortrait) {
        // In portrait, keep center area clear for image
        // Top 15% or Bottom 15%
        const isTop = Math.random() > 0.5;
        spawnY = isTop ? height * 0.15 : height * 0.85;
        // Keep away from absolute edges
        spawnX = width * 0.2 + (Math.random() * width * 0.6); 
      } else {
        // Landscape
        const isLeft = Math.random() > 0.5;
        spawnX = isLeft ? width * 0.15 : width * 0.85;
        spawnY = height * 0.2 + (Math.random() * height * 0.6); 
      }

      return {
        id: `word-${index}-${i}`,
        text,
        x: spawnX,
        y: spawnY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        width: 0,
        height: FONT_BASE_SIZE * scale,
        spawnTime: Date.now(),
        isGrabbed: false
      };
    });

  }, [category, mode, onEndGame, getAllWords]);

  useEffect(() => {
    statsRef.current = {
      startTime: Date.now(),
      attempts: 0,
      completedRounds: 0,
      reactionData: []
    };
    startRound(0);
  }, [startRound]);

  const handleExit = useCallback(() => {
      onEndGame({
        reactionTimes: statsRef.current.reactionData,
        pinchAttempts: statsRef.current.attempts,
        successfulGrabs: statsRef.current.completedRounds,
        startTime: statsRef.current.startTime,
        endTime: Date.now(),
        category
      });
  }, [onEndGame, category]);

  useEffect(() => {
    if (inputMethod === 'TOUCH') {
      setStatusMessage("");
      document.body.classList.add('using-mouse');
      return;
    }

    let camera: any = null;
    let hands: any = null;

    const onResults = (results: any) => {
      setStatusMessage("");
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const width = window.innerWidth;
        const height = window.innerHeight;
        const indexTip = landmarks[8];
        const thumbTip = landmarks[4];
        
        const x = (1 - ((indexTip.x + thumbTip.x) / 2)) * width;
        const y = ((indexTip.y + thumbTip.y) / 2) * height;

        const dx = (indexTip.x - thumbTip.x) * width;
        const dy = (indexTip.y - thumbTip.y) * height;
        const distance = Math.sqrt(dx * dx + dy * dy);

        handPosRef.current = {
          x,
          y,
          isPinching: distance < mode.physics.pinchThreshold,
          isVisible: true
        };
      } else {
        handPosRef.current.isVisible = false;
      }
    };

    if (window.Hands) {
      hands = new window.Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      hands.onResults(onResults);

      if (videoRef.current && window.Camera) {
        camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if(videoRef.current) await hands.send({ image: videoRef.current });
          },
          width: 640,
          height: 480
        });
        camera.start().catch((err: any) => {
           console.error("Camera denied", err);
           setStatusMessage("Camera Access Denied. Enabling Touch Mode.");
           document.body.classList.add('using-mouse');
        });
      }
    }
    return () => {
      if (camera) camera.stop();
      if (hands) hands.close();
    };
  }, [mode, inputMethod]);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      let cx, cy;
      if ('touches' in e) { cx = e.touches[0].clientX; cy = e.touches[0].clientY; }
      else { cx = (e as MouseEvent).clientX; cy = (e as MouseEvent).clientY; }
      mousePosRef.current.x = cx;
      mousePosRef.current.y = cy;
    };
    const handleDown = () => { mousePosRef.current.isDown = true; };
    const handleUp = () => { mousePosRef.current.isDown = false; };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchstart', handleDown, { passive: false });
    window.addEventListener('touchend', handleUp, { passive: false });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchstart', handleDown);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const isPortrait = height > width;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (inputMethod === 'TOUCH') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = mode.theme.background;
      ctx.fillRect(0, 0, width, height);
    }

    if (gameStateRef.current.feedbackTimer > 0) {
        ctx.fillStyle = gameStateRef.current.feedbackColor;
        ctx.globalAlpha = Math.min(0.3, gameStateRef.current.feedbackTimer / 20);
        ctx.fillRect(0,0,width,height);
        ctx.globalAlpha = 1.0;
        gameStateRef.current.feedbackTimer--;
    }

    // Responsive Image Size
    const baseSize = Math.min(width, height);
    // On mobile (<600), make image slightly larger relative to screen to ensure visibility
    const imgSize = baseSize * (width < 600 ? 0.65 : 0.45);
    const imgX = (width - imgSize) / 2;
    const imgY = (height - imgSize) / 2;
    
    ctx.strokeStyle = mode.theme.secondary;
    ctx.lineWidth = 4;
    ctx.strokeRect(imgX, imgY, imgSize, imgSize);

    if (gameStateRef.current.isImageLoaded) {
        // Draw image keeping aspect ratio 'cover' within the square
        const img = imageRef.current;
        const scale = Math.max(imgSize / img.width, imgSize / img.height);
        const x = (imgSize - img.width * scale) / 2;
        const y = (imgSize - img.height * scale) / 2;
        
        ctx.save();
        ctx.beginPath();
        ctx.rect(imgX, imgY, imgSize, imgSize);
        ctx.clip();
        ctx.drawImage(img, imgX + x, imgY + y, img.width * scale, img.height * scale);
        ctx.restore();
    } else {
        const time = Date.now() / 500;
        const alpha = 0.5 + Math.sin(time) * 0.4;
        ctx.fillStyle = mode.theme.primary;
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${Math.max(12, width/40)}px ${mode.theme.font}`;
        ctx.textAlign = 'center';
        ctx.fillText("ACQUIRING VISUAL...", width/2, height/2);
        ctx.globalAlpha = 1.0;
    }

    let cursorX = mousePosRef.current.x;
    let cursorY = mousePosRef.current.y;
    let isGrabbing = mousePosRef.current.isDown;
    let inputType = 'mouse';

    if (handPosRef.current.isVisible) {
      cursorX = handPosRef.current.x;
      cursorY = handPosRef.current.y;
      isGrabbing = handPosRef.current.isPinching;
      inputType = 'hand';
    }

    if (isGrabbing && !prevPinchStateRef.current) {
        statsRef.current.attempts++;
    }
    prevPinchStateRef.current = isGrabbing;

    // Use scale from physics config, tuned for mobile
    const scale = mode.physics.scale || ELDERLY_SCALE;
    // Limit font size to avoid overflow on very small screens, but keep it large enough for seniors
    const responsiveFont = Math.min(Math.max(20, FONT_BASE_SIZE * scale), width / 15);
    
    ctx.font = `bold ${responsiveFont}px ${mode.theme.font}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    gameStateRef.current.words.forEach(word => {
       if (!word.isGrabbed && !mode.physics.gravity) {
           word.x += word.vx;
           word.y += word.vy;
           
           if (word.x < CANVAS_PADDING) word.vx = Math.abs(word.vx);
           if (word.x > width - CANVAS_PADDING) word.vx = -Math.abs(word.vx);
           if (word.y < CANVAS_PADDING) word.vy = Math.abs(word.vy);
           if (word.y > height - CANVAS_PADDING) word.vy = -Math.abs(word.vy);
       }

       if (word.width === 0) {
           word.width = ctx.measureText(word.text).width;
       }

       const hitPadding = 40;
       const halfW = word.width / 2 + hitPadding;
       const halfH = responsiveFont / 2 + hitPadding;

       const isHovering = cursorX > word.x - halfW && cursorX < word.x + halfW && cursorY > word.y - halfH && cursorY < word.y + halfH;
       
       if (isGrabbing && isHovering && !gameStateRef.current.words.some(w => w !== word && w.isGrabbed)) {
           if (!word.isGrabbed) {
              word.isGrabbed = true;
              playSound('grab');
           }
       }
       
       if (!isGrabbing) {
           word.isGrabbed = false;
       }

       if (word.isGrabbed) {
           word.x = cursorX;
           word.y = cursorY;

           if (word.x > imgX && word.x < imgX + imgSize && word.y > imgY && word.y < imgY + imgSize) {
               if (word.text === gameStateRef.current.targetWord) {
                   playSound('success');
                   gameStateRef.current.feedbackColor = mode.theme.primary;
                   gameStateRef.current.feedbackTimer = 30;
                   statsRef.current.completedRounds++;
                   statsRef.current.reactionData.push(Date.now() - word.spawnTime);
                   startRound(gameStateRef.current.roundIndex + 1);
                   return;
               } else {
                   playSound('error');
                   gameStateRef.current.feedbackColor = "#FF0000";
                   gameStateRef.current.feedbackTimer = 10;
                   word.vx = (word.x - width/2) * 0.1;
                   word.vy = (word.y - height/2) * 0.1;
                   word.x = word.x < width/2 ? width * 0.1 : width * 0.9;
                   word.isGrabbed = false;
               }
           }
       }

       ctx.fillStyle = mode.theme.secondary;
       ctx.shadowColor = mode.theme.primary;
       ctx.shadowBlur = word.isGrabbed ? 20 : 10;
       ctx.fillText(word.text, word.x, word.y);
       ctx.shadowBlur = 0;

       if (isHovering || word.isGrabbed) {
           ctx.strokeStyle = mode.theme.primary;
           ctx.lineWidth = 1;
           ctx.strokeRect(word.x - word.width/2 - 10, word.y - responsiveFont/2 - 10, word.width + 20, responsiveFont + 20);
       }
    });

    ctx.beginPath();
    ctx.arc(cursorX, cursorY, 15, 0, Math.PI * 2);
    ctx.fillStyle = isGrabbing ? mode.theme.primary : 'transparent';
    ctx.strokeStyle = mode.theme.primary;
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    if (inputType === 'hand' && !isGrabbing) {
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, mode.physics.pinchThreshold, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
     }

    requestRef.current = requestAnimationFrame(animate);
  }, [mode, startRound, playSound, inputMethod]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [animate]);

  return (
    <>
      {inputMethod === 'CAMERA' && (
        <video 
          ref={videoRef} 
          className="fixed top-0 left-0 w-full h-full object-cover" 
          playsInline 
          muted
          style={{ transform: 'scaleX(-1)', zIndex: -2 }} 
        />
      )}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 touch-none" />
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-sm md:text-xl font-mono" style={{ color: mode.theme.primary }}>
          {category} | {roundInfo.current}/{roundInfo.total}
        </h3>
        {statusMessage && (
             <p className="text-xs md:text-sm text-red-400 mt-2 animate-pulse">{statusMessage}</p>
        )}
      </div>

      <button
        onClick={handleExit}
        className="absolute top-4 right-4 z-50 px-3 py-1 md:px-6 md:py-2 border rounded-full font-mono font-bold tracking-widest text-[10px] md:text-sm transition-all active:scale-95 hover:bg-white/10 uppercase"
        style={{ 
            borderColor: mode.theme.primary, 
            color: mode.theme.primary,
            backgroundColor: 'rgba(0,0,0,0.8)',
            boxShadow: `0 0 15px ${mode.theme.primary}33`
        }}
      >
        End
      </button>
    </>
  );
};