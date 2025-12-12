# Universal Therapeutic Motion Platform (Silver Neuro-Gym)

**Project Context:** Kaggle AI Competition - "AI for Social Good" (Health Track)  
**System Architect:** Barbara Yam

## Overview

The **Silver Neuro-Gym** is an accessible, web-based therapeutic tool designed to improve mental well-being and cognitive recall for seniors. It gamifies physical and cognitive therapy by allowing users to interact with floating words in a "zero gravity" environment using simple hand gestures.

Unlike traditional therapy apps that rely on small touch targets, this platform uses **Google MediaPipe Hands** to create a "Minority Report" style interface. Users can "grab" words out of thin air, promoting fine motor skills (pinching) and cognitive association without the need for wearables or controllers.

## Core Features

### 🧠 Cognitive & Motor Therapy
*   **Visual Association:** Users must identify words that match a central image prompt (e.g., matching the word "KEYS" to a picture of keys).
*   **Motor Precision:** Tracks "Pinch Precision" and "Reaction Time" to monitor neurological health.
*   **Zero-Gravity Physics:** Words float slowly to reduce anxiety and allow time for processing, specifically tuned for elderly users.

### ♿ Accessibility First
*   **OLED High Contrast Mode:** Pure black backgrounds with Neon Green (Primary) elements for maximum visibility for aging eyes.
*   **Large Typography:** Sans-serif fonts scaled 150% larger than standard web apps.
*   **Dual Input Modes:**
    *   **Motion Mode:** Uses the webcam to track hand skeleton data.
    *   **Touch Mode:** Fallback for tablets or users with limited mobility who prefer direct touch.

### 🎵 Adaptive Atmosphere
*   **Generative Audio:** Procedural Web Audio engine creates soothing, non-looping ambient soundscapes (C Major pad) to reduce anxiety during sessions.
*   **Visual Feedback:** Immediate color-coded feedback (Green for success, Red for error) and a segmented progress bar.

## Technical Architecture

This application is architected as a "Zero-Build" Single Page Application (SPA) to ensure maximum portability and ease of deployment in resource-constrained environments (e.g., nursing homes without IT support).

*   **Framework:** React 19 (via ESM imports, no Webpack/Vite bundler required).
*   **Styling:** Tailwind CSS (via CDN).
*   **AI/CV:** Google MediaPipe Hands (Client-side Computer Vision).
*   **Rendering:** HTML5 Canvas API for high-performance 60FPS animations.
*   **Audio:** Native Web Audio API for synthesis (no external MP3 assets).

## How to Run

1.  **Download:** Save all files to a local directory.
2.  **Serve:** Because this app uses ES Modules and Webcam access, it must be served via HTTPS or `localhost`.
    *   *VS Code:* Right-click `index.html` -> "Open with Live Server".
    *   *Python:* Run `python3 -m http.server` in the directory.
    *   *Node:* Run `npx serve .`
3.  **Play:** Open the URL in Google Chrome (recommended for best MediaPipe performance). Allow Camera access when prompted.

## Categories & Word Lists

The app currently supports three therapeutic categories focused on Activities of Daily Living (ADL):

1.  **ESSENTIALS:** Keys, Glasses, Phone, Cup, Spoon.
2.  **NOURISHMENT:** Apple, Bread, Water, Egg, Milk.
3.  **ANIMALS:** Dog, Cat, Bird, Fish, Lion.

## License

MIT License - Free for educational and non-profit therapeutic use.
