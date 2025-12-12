import React from 'react';
import { GameStats, ModeConfig } from '../types';

interface SessionReportProps {
  stats: GameStats;
  mode: ModeConfig;
  onRestart: () => void;
}

export const SessionReport: React.FC<SessionReportProps> = ({ stats, mode, onRestart }) => {
  const { theme } = mode;
  
  const averageReactionTime = stats.reactionTimes.length > 0
    ? (stats.reactionTimes.reduce((a, b) => a + b, 0) / stats.reactionTimes.length / 1000).toFixed(2)
    : "N/A";
    
  const accuracy = stats.pinchAttempts > 0 
    ? ((stats.successfulGrabs / stats.pinchAttempts) * 100).toFixed(1)
    : "0.0";

  return (
    <div 
      className="flex flex-col items-center justify-center w-full h-full p-4 md:p-8 text-center animate-fadeIn overflow-y-auto"
      style={{ color: theme.secondary }}
    >
      <div className="w-full max-w-2xl border-2 md:border-4 p-6 md:p-8 rounded-xl bg-black" style={{ borderColor: theme.primary }}>
        <h2 className="text-2xl md:text-4xl font-bold mb-2 uppercase tracking-widest" style={{ color: theme.primary }}>
          Session Report
        </h2>
        <p className="text-sm md:text-xl mb-6 opacity-80 font-mono">PATIENT LOG: {new Date().toLocaleDateString()}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
          <div className="p-4 border-2 rounded-lg" style={{ borderColor: theme.secondary }}>
            <div className="text-xs md:text-sm uppercase tracking-wide opacity-70 mb-1">Avg Reaction Time</div>
            <div className="text-3xl md:text-5xl font-mono font-bold" style={{ color: theme.primary }}>
              {averageReactionTime}<span className="text-lg md:text-2xl ml-1">s</span>
            </div>
          </div>

          <div className="p-4 border-2 rounded-lg" style={{ borderColor: theme.secondary }}>
            <div className="text-xs md:text-sm uppercase tracking-wide opacity-70 mb-1">Motor Precision</div>
            <div className="text-3xl md:text-5xl font-mono font-bold" style={{ color: theme.primary }}>
              {accuracy}<span className="text-lg md:text-2xl ml-1">%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs md:text-sm font-mono border-t border-b py-4 mb-8 gap-2" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          <span>CATEGORY: {stats.category}</span>
          <span>OBJECTS: {stats.successfulGrabs}</span>
          <span>ATTEMPTS: {stats.pinchAttempts}</span>
        </div>

        <button
          onClick={onRestart}
          className="w-full md:w-auto px-8 py-4 text-lg md:text-xl font-bold uppercase tracking-wider rounded-full transition-transform hover:scale-105 active:scale-95"
          style={{ 
            backgroundColor: theme.primary, 
            color: theme.background,
            boxShadow: `0 0 20px ${theme.primary}66`
          }}
        >
          New Session
        </button>
      </div>
    </div>
  );
};