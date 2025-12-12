import React, { useState, useEffect } from 'react';
import { StartScreen } from './components/StartScreen';
import { GameCanvas } from './components/GameCanvas';
import { SessionReport } from './components/SessionReport';
import { AmbientAudio } from './components/AmbientAudio';
import { CURRENT_MODE, GAME_DATA } from './constants';
import { GameStats, DifficultyLevel, ModeConfig, InputMethod } from './types';

const GlobalStyles = ({ theme }: { theme: any }) => (
  <style>{`
    :root {
      --theme-bg: ${theme.background};
      --theme-primary: ${theme.primary};
      --theme-secondary: ${theme.secondary};
      --theme-font: ${theme.font};
    }
    body {
      background-color: var(--theme-bg);
      font-family: var(--theme-font);
      color: var(--theme-secondary);
    }
    ::-webkit-scrollbar { display: none; }
  `}</style>
);

const Footer = () => (
  <div className="fixed bottom-4 right-4 text-xs font-mono opacity-40 z-50 pointer-events-none text-white text-right">
    SYSTEM ARCHITECT: BARBARA YAM
  </div>
);

type AppState = 'START' | 'PLAYING' | 'REPORT';

function App() {
  const [appState, setAppState] = useState<AppState>('START');
  const [selectedCategory, setSelectedCategory] = useState<string>('ESSENTIALS');
  const [sessionStats, setSessionStats] = useState<GameStats | null>(null);
  const [activeMode, setActiveMode] = useState<ModeConfig>(CURRENT_MODE);
  const [inputMethod, setInputMethod] = useState<InputMethod>('CAMERA');
  const [musicEnabled, setMusicEnabled] = useState<boolean>(false);

  const handleStart = (category: string, difficulty: DifficultyLevel, input: InputMethod) => {
    setSelectedCategory(category);
    setInputMethod(input);
    
    // Deep clone the current mode to avoid mutating the constant
    const newMode: ModeConfig = JSON.parse(JSON.stringify(CURRENT_MODE));
    
    // Apply settings from GAME_DATA based on difficulty
    const settings = GAME_DATA.DIFFICULTY[difficulty];
    
    newMode.physics.speed = settings.speed;
    newMode.physics.pinchThreshold = settings.pinchThreshold;
    newMode.physics.spawnArea = settings.spawnArea;
    newMode.physics.spawnCount = settings.spawnCount;
    newMode.physics.scale = settings.scale;

    setActiveMode(newMode);
    setAppState('PLAYING');
  };

  const handleEndGame = (stats: GameStats) => {
    setSessionStats(stats);
    setAppState('REPORT');
  };

  const handleRestart = () => {
    setAppState('START');
    setSessionStats(null);
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <GlobalStyles theme={activeMode.theme} />
      
      <AmbientAudio enabled={musicEnabled} />

      {appState === 'START' && (
        <StartScreen 
          mode={CURRENT_MODE} 
          onSelectCategory={handleStart}
          musicEnabled={musicEnabled}
          onToggleMusic={setMusicEnabled}
        />
      )}

      {appState === 'PLAYING' && (
        <GameCanvas 
          mode={activeMode} 
          category={selectedCategory} 
          onEndGame={handleEndGame}
          inputMethod={inputMethod}
        />
      )}

      {appState === 'REPORT' && sessionStats && (
        <SessionReport 
          stats={sessionStats} 
          mode={activeMode} 
          onRestart={handleRestart} 
        />
      )}

      <Footer />
    </div>
  );
}

export default App;