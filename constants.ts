import { ModesMap, DifficultyLevel } from './types';

export const GAME_DATA = {
  // THERAPEUTIC CATEGORIES (ADL Focused)
  CATEGORIES: {
    "ESSENTIALS": ["KEYS", "GLASSES", "PHONE", "CUP", "SPOON"],
    "NOURISHMENT": ["APPLE", "BREAD", "WATER", "EGG", "MILK"],
    "ANIMALS": ["DOG", "CAT", "BIRD", "FISH", "LION"]
  },
  
  // PROGRESSIVE DIFFICULTY SETTINGS
  DIFFICULTY: {
    EASY: {
      label: "REHAB START",
      speed: 0.1,         // Extremely slow floating
      spawnCount: 2,      // Only 1 target + 1 distractor (Low cognitive load)
      scale: 1.5,         // Extra large text
      pinchThreshold: 60, // Very easy to grab
      spawnArea: 0.9
    },
    MEDIUM: {
      label: "ACTIVE RECOVERY",
      speed: 0.3,
      spawnCount: 3,
      scale: 1.2,
      pinchThreshold: 45,
      spawnArea: 0.7
    },
    HARD: {
      label: "COGNITIVE FLOW",
      speed: 0.6,
      spawnCount: 5,      // 1 target + 4 distractors
      scale: 1.0,
      pinchThreshold: 30, // Requires precision
      spawnArea: 0.6
    }
  } as Record<DifficultyLevel, { label: string, speed: number, spawnCount: number, scale: number, pinchThreshold: number, spawnArea: number }>
};

// Curated list of high-clarity, identifiable photos from Unsplash
export const WORD_IMAGES: Record<string, string> = {
  // ESSENTIALS
  "KEYS": "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&q=80",
  "GLASSES": "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&q=80",
  "PHONE": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
  "CUP": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80",
  "SPOON": "https://images.unsplash.com/photo-1619360178306-056c0774df28?w=500&q=80",
  
  // NOURISHMENT
  "APPLE": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&q=80",
  "BREAD": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80",
  "WATER": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&q=80",
  "EGG": "https://images.unsplash.com/photo-1587486913049-53fc88980fa1?w=500&q=80",
  "MILK": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80",

  // ANIMALS
  "DOG": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=80",
  "CAT": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80",
  "BIRD": "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=500&q=80",
  "FISH": "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=500&q=80",
  "LION": "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=500&q=80"
};

export const MODES: ModesMap = {
  ELDERLY: {
    id: "ELDERLY",
    gameplayType: "ASSOCIATION",
    theme: {
      background: "rgba(0, 0, 0, 0.6)",
      primary: "#00FF00",
      secondary: "#FFFFFF",
      font: "Arial, sans-serif"
    },
    physics: {
      speed: GAME_DATA.DIFFICULTY.MEDIUM.speed,
      gravity: false,
      spawnArea: GAME_DATA.DIFFICULTY.MEDIUM.spawnArea,
      pinchThreshold: GAME_DATA.DIFFICULTY.MEDIUM.pinchThreshold,
      spawnCount: GAME_DATA.DIFFICULTY.MEDIUM.spawnCount,
      scale: GAME_DATA.DIFFICULTY.MEDIUM.scale
    },
    content: {
      title: "Silver Neuro-Gym",
      subtitle: "Visual Association Therapy",
      wordLists: GAME_DATA.CATEGORIES,
      successMsg: "ASSOCIATION VERIFIED"
    }
  }
};

export const CURRENT_MODE = MODES.ELDERLY;

export const CANVAS_PADDING = 50;
export const FONT_BASE_SIZE = 24;
export const ELDERLY_SCALE = 1.5; // Fallback