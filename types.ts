export interface ThemeConfig {
  background: string;
  primary: string;
  secondary: string;
  font: string;
}

export interface PhysicsConfig {
  speed: number;
  gravity: boolean;
  spawnArea: number;
  pinchThreshold: number;
  spawnCount: number;
  scale: number;
}

export interface ContentConfig {
  title: string;
  subtitle: string;
  wordLists: Record<string, string[]>;
  successMsg: string;
}

export interface ModeConfig {
  id: string;
  gameplayType: "ASSOCIATION" | "STANDARD";
  theme: ThemeConfig;
  physics: PhysicsConfig;
  content: ContentConfig;
}

export interface ModesMap {
  [key: string]: ModeConfig;
}

export interface GameStats {
  reactionTimes: number[];
  pinchAttempts: number;
  successfulGrabs: number;
  startTime: number;
  endTime: number;
  category: string;
}

export interface WordEntity {
  id: string;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  spawnTime: number;
  isGrabbed: boolean;
}

export interface GlobalMediaPipe {
  Hands: any;
  Camera: any;
}

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';
export type InputMethod = 'CAMERA' | 'TOUCH';

declare global {
  interface Window {
    Hands: any;
    Camera: any;
    drawConnectors: any;
    drawLandmarks: any;
    HAND_CONNECTIONS: any;
  }
}