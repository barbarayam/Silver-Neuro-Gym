import React, { useState } from 'react';
import { ModeConfig, DifficultyLevel, InputMethod } from '../types';
import { GAME_DATA } from '../constants';

interface StartScreenProps {
  mode: ModeConfig;
  onSelectCategory: (category: string, difficulty: DifficultyLevel, inputMethod: InputMethod) => void;
  musicEnabled: boolean;
  onToggleMusic: (enabled: boolean) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ mode, onSelectCategory, musicEnabled, onToggleMusic }) => {
  const { theme, content } = mode;
  const categories = Object.keys(content.wordLists);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM');
  const [inputMethod, setInputMethod] = useState<InputMethod>('CAMERA');

  const difficulties: DifficultyLevel[] = ['EASY', 'MEDIUM', 'HARD'];

  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-4 md:p-6 relative z-10 overflow-y-auto no-scrollbar bg-black">
      
      <div className="text-center mt-6 md:mt-16 shrink-0 w-full max-w-4xl">
        <h1 
          className="text-4xl sm:text-5xl md:text-8xl font-bold mb-2 md:mb-4 tracking-tighter"
          style={{ color: theme.primary }}
        >
          {content.title}
        </h1>
        <p className="text-[10px] sm:text-xs md:text-2xl uppercase tracking-[0.2em] md:tracking-[0.3em] font-mono font-medium text-gray-300 mb-6 md:mb-8">
          {content.subtitle}
        </p>

        <button 
            onClick={() => setIsHowToPlayOpen(!isHowToPlayOpen)}
            className="flex items-center gap-2 mx-auto px-4 py-2 border rounded-full transition-all hover:bg-white/10 mb-4"
            style={{ borderColor: theme.primary, color: theme.primary }}
        >
            <span className="font-mono font-bold tracking-widest uppercase text-xs md:text-base">How to Play</span>
            <span className="text-lg">{isHowToPlayOpen ? '−' : '+'}</span>
        </button>
      </div>

      <div className={`w-full max-w-5xl shrink-0 transition-all duration-500 ease-in-out overflow-hidden ${isHowToPlayOpen ? 'max-h-[800px] opacity-100 my-4 md:my-8' : 'max-h-0 opacity-0 my-0'}`}>
        
        <div className="text-center max-w-2xl mx-auto mb-6 md:mb-10 px-4">
            <p className="text-gray-300 font-mono text-xs md:text-base leading-relaxed tracking-wide">
              Identify the word that matches the image. <span style={{color: theme.primary}} className="font-bold">PINCH</span> your fingers to grab the floating word and <span style={{color: theme.primary}} className="font-bold">DRAG</span> it into the box.
            </p>
        </div>

        <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gray-800 -translate-y-6 -z-10" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 px-4 md:px-16">
                
                <div className="flex flex-col items-center bg-black px-2 md:px-6">
                    <div className="mb-2 md:mb-6">
                        <svg className="w-10 h-10 md:w-16 md:h-16" fill="none" stroke={theme.primary} viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 15.75l-1.5-1.501a1.575 1.575 0 00-2.25 2.25l4.5 4.5H18.75l2.25-9-2.25 6" />
                        </svg>
                    </div>
                    <span className="text-[10px] md:text-sm font-mono uppercase tracking-widest font-bold text-gray-200">1. Raise Hand</span>
                </div>
                
                <div className="flex flex-col items-center bg-black px-2 md:px-6">
                     <div className="mb-2 md:mb-6">
                         <svg className="w-10 h-10 md:w-16 md:h-16" fill="none" stroke={theme.primary} viewBox="0 0 24 24" strokeWidth={1.5}>
                             <circle cx="12" cy="12" r="9" />
                             <circle cx="12" cy="12" r="3" fill={theme.primary} />
                         </svg>
                     </div>
                     <span className="text-[10px] md:text-sm font-mono uppercase tracking-widest font-bold text-gray-200">2. Grab Word</span>
                </div>

                <div className="relative flex flex-col items-center bg-black px-2 md:px-6">
                     
                     <div className="mb-2 md:mb-6">
                        <svg className="w-10 h-10 md:w-16 md:h-16" fill="none" stroke={theme.primary} viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                     </div>
                     <span className="text-[10px] md:text-sm font-mono uppercase tracking-widest font-bold text-gray-200">3. Drag to Image</span>
                </div>
            </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-5xl shrink-0 mb-8 items-center justify-center">
        
        <div className="flex flex-col items-center w-full md:w-auto">
            <h3 className="text-gray-400 font-mono text-[10px] md:text-sm tracking-widest mb-2 md:mb-4">SELECT DIFFICULTY</h3>
            <div className="flex gap-2 md:gap-4">
            {difficulties.map((level) => (
                <div key={level} className="flex flex-col items-center gap-1 md:gap-2">
                    <button
                        onClick={() => setDifficulty(level)}
                        className={`px-3 py-2 md:px-6 md:py-2 rounded-lg font-mono tracking-wider transition-all border text-[10px] md:text-base ${
                            difficulty === level 
                            ? 'bg-opacity-20 text-white shadow-[0_0_10px_rgba(0,255,0,0.3)]' 
                            : 'bg-transparent text-gray-500 hover:text-gray-300'
                        }`}
                        style={{
                            borderColor: difficulty === level ? theme.primary : 'rgba(255,255,255,0.2)',
                            backgroundColor: difficulty === level ? `${theme.primary}33` : 'transparent',
                            color: difficulty === level ? theme.primary : undefined
                        }}
                    >
                        {level}
                    </button>
                    {difficulty === level && (
                        <span className="text-[8px] md:text-[10px] font-mono tracking-widest uppercase text-gray-400 animate-fadeIn">
                            {GAME_DATA.DIFFICULTY[level].label}
                        </span>
                    )}
                </div>
            ))}
            </div>
        </div>

        <div className="flex flex-col items-center w-full md:w-auto">
            <h3 className="text-gray-400 font-mono text-[10px] md:text-sm tracking-widest mb-2 md:mb-4">INPUT METHOD</h3>
            <div className="flex gap-2 md:gap-4">
                <button
                    onClick={() => setInputMethod('CAMERA')}
                    className={`px-3 py-2 md:px-6 md:py-2 rounded-lg font-mono tracking-wider transition-all border text-[10px] md:text-base ${
                        inputMethod === 'CAMERA'
                        ? 'bg-opacity-20 shadow-[0_0_10px_rgba(0,255,0,0.3)]' 
                        : 'bg-transparent text-gray-500 hover:text-gray-300'
                    }`}
                    style={{
                        borderColor: inputMethod === 'CAMERA' ? theme.primary : 'rgba(255,255,255,0.2)',
                        color: inputMethod === 'CAMERA' ? theme.primary : undefined,
                        backgroundColor: inputMethod === 'CAMERA' ? `${theme.primary}33` : 'transparent'
                    }}
                >
                    MOTION
                </button>
                <button
                    onClick={() => setInputMethod('TOUCH')}
                    className={`px-3 py-2 md:px-6 md:py-2 rounded-lg font-mono tracking-wider transition-all border text-[10px] md:text-base ${
                        inputMethod === 'TOUCH'
                        ? 'bg-opacity-20 shadow-[0_0_10px_rgba(0,255,0,0.3)]' 
                        : 'bg-transparent text-gray-500 hover:text-gray-300'
                    }`}
                    style={{
                        borderColor: inputMethod === 'TOUCH' ? theme.primary : 'rgba(255,255,255,0.2)',
                        color: inputMethod === 'TOUCH' ? theme.primary : undefined,
                        backgroundColor: inputMethod === 'TOUCH' ? `${theme.primary}33` : 'transparent'
                    }}
                >
                    TOUCH
                </button>
            </div>
        </div>

        <div className="flex flex-col items-center w-full md:w-auto">
            <h3 className="text-gray-400 font-mono text-[10px] md:text-sm tracking-widest mb-2 md:mb-4">MUSIC</h3>
            <div className="flex gap-2 md:gap-4">
                <button
                    onClick={() => onToggleMusic(true)}
                    className={`px-3 py-2 md:px-6 md:py-2 rounded-lg font-mono tracking-wider transition-all border text-[10px] md:text-base ${
                        musicEnabled
                        ? 'bg-opacity-20 shadow-[0_0_10px_rgba(0,255,0,0.3)]' 
                        : 'bg-transparent text-gray-500 hover:text-gray-300'
                    }`}
                    style={{
                        borderColor: musicEnabled ? theme.primary : 'rgba(255,255,255,0.2)',
                        color: musicEnabled ? theme.primary : undefined,
                        backgroundColor: musicEnabled ? `${theme.primary}33` : 'transparent'
                    }}
                >
                    ON
                </button>
                <button
                    onClick={() => onToggleMusic(false)}
                    className={`px-3 py-2 md:px-6 md:py-2 rounded-lg font-mono tracking-wider transition-all border text-[10px] md:text-base ${
                        !musicEnabled
                        ? 'bg-opacity-20 shadow-[0_0_10px_rgba(0,255,0,0.3)]' 
                        : 'bg-transparent text-gray-500 hover:text-gray-300'
                    }`}
                    style={{
                        borderColor: !musicEnabled ? theme.primary : 'rgba(255,255,255,0.2)',
                        color: !musicEnabled ? theme.primary : undefined,
                        backgroundColor: !musicEnabled ? `${theme.primary}33` : 'transparent'
                    }}
                >
                    OFF
                </button>
            </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-6xl shrink-0 pb-6 md:pb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat, difficulty, inputMethod)}
            className="flex flex-col items-center justify-center p-4 md:p-8 border-2 rounded-xl transition-all duration-300 hover:bg-white/10 active:scale-95 group bg-black w-full"
            style={{ 
              borderColor: theme.primary,
              boxShadow: `0 0 15px ${theme.primary}11`
            }}
          >
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider mb-2 md:mb-3 text-white group-hover:scale-105 transition-transform text-center w-full break-words">{cat}</span>
            <span className="text-[9px] md:text-xs opacity-60 font-mono tracking-[0.2em] text-gray-400 text-center">START SESSION</span>
          </button>
        ))}
      </div>
    </div>
  );
};