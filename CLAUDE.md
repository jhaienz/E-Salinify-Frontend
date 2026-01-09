# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-Salinify is a React Native mobile application built with Expo that helps bridge communication gaps by translating sign language through camera or providing keyboard-based communication. The app uses Expo Router for file-based routing and React Native's new architecture.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start
# Or use expo directly
npx expo start

# Run on specific platforms
npm run android  # Android emulator
npm run ios      # iOS simulator
npm run web      # Web browser

# Linting
npm run lint
```

## Architecture & Routing

**File-Based Routing**: This project uses Expo Router with file-based routing. Routes are defined by the file structure in the `app/` directory:

- `app/index.tsx` - Entry point that checks onboarding status in AsyncStorage and redirects accordingly
- `app/onboarding/index.tsx` - Onboarding screen shown on first launch
- `app/home/index.tsx` - Main home screen with communication method selection
- `app/home/camera/index.tsx` - Camera-based sign language translation
- `app/home/keyboard/index.tsx` - Keyboard-based communication

**Navigation Flow**:
1. App checks `hasOnBoarded` key in AsyncStorage
2. First-time users → Onboarding screen → Home screen
3. Returning users → Direct to Home screen
4. Home screen allows selection between camera or keyboard communication modes

## Key Technologies

- **Expo SDK ~54.0** with new architecture enabled (`newArchEnabled: true`)
- **React 19.1.0** with experimental React Compiler enabled
- **expo-router ~6.0** for file-based navigation with typed routes
- **expo-camera ~17.0** for video recording and hand sign detection
- **react-native-fast-tflite ~1.6** for TensorFlow Lite model inference
- **expo-video-thumbnails** for frame extraction from recorded videos
- **expo-image-manipulator** for image preprocessing (resize, crop)
- **AsyncStorage** for persistent onboarding state
- **expo-google-fonts/quicksand** - Global font family loaded in root layout

## Project Structure

```
app/                    # File-based routes (screens)
  ├── _layout.tsx      # Root layout - loads fonts, SafeAreaView wrapper
  ├── index.tsx        # Entry point - checks onboarding status
  ├── onboarding/      # First-time user experience
  ├── home/            # Main app screens
  │   ├── index.tsx    # Communication method selection
  │   ├── camera/      # Camera-based sign language mode with AI
  │   └── keyboard/    # Keyboard-based communication mode
components/            # Reusable React components
  └── homeScreen/      # Home screen specific components
services/              # Business logic services
  ├── SignLanguageProcessor.ts      # Video-to-text translation
  ├── ImagePreprocessor.ts          # Frame preprocessing (needs impl)
  ├── ImagePreprocessor.example.ts  # Reference implementations
  └── README.md                      # Service documentation
assets/
  ├── images/          # Image assets
  ├── styles/          # StyleSheet definitions (*.style.tsx files)
  ├── HAND_SIGNS/      # Hand sign reference images
  ├── model/           # TensorFlow Lite models
  │   └── model.tflite # Sign language model (28x28 grayscale input)
  └── fonts/           # Custom fonts
constant/              # App constants (colors, etc.)
data/                  # Static data (CameraCommunicationData)
```

## Styling Conventions

Styles are organized in separate files under `assets/styles/` with `.style.tsx` extension:
- `HomeScreen.style.tsx`
- `OnBoardingPage.style.tsx`
- `CameraScreen.style.tsx`
- `KeyboardScreen.style.tsx`

Import styles using the `@/` path alias: `@/assets/styles/HomeScreen.style`

## Path Aliases

TypeScript is configured with `@/*` path alias mapping to root directory:
```typescript
import { HomeScreenStyle } from "@/assets/styles/HomeScreen.style";
import { CameraCommunicationData } from "@/data/data";
```

## Camera Functionality

The camera screen (`app/home/camera/index.tsx`) uses:
- `expo-camera` with video recording mode
- Camera permissions handling
- Video recording with `recordAsync()` and `stopRecording()`
- Camera facing toggle (front/back)
- **NEW**: AI-powered sign language video-to-text translation
- **NEW**: Automatic processing after recording stops
- **NEW**: Progress modal with translated text display

Camera permission message: "Allow $(PRODUCT_NAME) to access your camera" (configured in `app.json`)

### Sign Language Translation Pipeline

When a video is recorded, it's automatically processed:
1. **Frame Extraction**: `expo-video-thumbnails` extracts frames at ~30fps
2. **Preprocessing**: Frames are resized to 28x28, converted to grayscale, normalized (needs implementation)
3. **Model Inference**: TFLite model predicts sign language letter for each frame
4. **Consistency Check**: Letter must appear for 15 consecutive frames with 80%+ confidence
5. **Result Display**: Translated text shown in modal

Model: Located at `assets/model/model.tflite` (expects 28x28 grayscale input, outputs 24 classes A-Y)

**Implementation Status:**
- ✅ Video recording and frame extraction
- ✅ Model loading and inference pipeline
- ✅ UI with progress tracking and results
- ⚠️ Image preprocessing needs implementation (see `services/ImagePreprocessor.ts`)

## State Management

Currently uses:
- React hooks (useState, useEffect) for local component state
- AsyncStorage for persistence (onboarding status)
- No global state management library (Redux/Context) implemented yet

## Important Configuration

- **New Architecture**: Enabled in `app.json` (`newArchEnabled: true`)
- **React Compiler**: Experimental feature enabled in `app.json`
- **Typed Routes**: Expo Router typed routes enabled
- **Edge-to-edge**: Android edge-to-edge display enabled
- **Orientation**: Portrait only
- **UI Style**: Automatic (light/dark mode support)

## Development Notes

- Fonts must be loaded before rendering (handled in `app/_layout.tsx`)
- SafeAreaView wrapper applied at root level to handle notches/safe areas
- AsyncStorage is cleared when navigating from home to camera/keyboard screens (see `handleDeleteItem` in home screen)
- TFLite model loads on camera screen mount using `useTensorflowModel` hook
- Video processing happens automatically after recording (no manual trigger needed)
- Frame preprocessing implementation needed - see `services/ImagePreprocessor.ts`

## Sign Language AI Implementation

This project includes a converted Python → React Native sign language translation system:

**Quick Start:** See `QUICK_START.md` for fastest implementation (backend recommended for MVP)

**Architecture:**
- `SignLanguageProcessor` - Main video processing orchestrator
- `ImagePreprocessor` - Frame preprocessing utilities (needs implementation)
- TFLite model expects: 28x28 grayscale images, normalized to 0-1 range
- Predictions validated with: 15-frame consistency, 0.8 confidence threshold

**Documentation:**
- `CONVERSION_SUMMARY.md` - Complete Python to React Native conversion guide
- `IMPLEMENTATION_GUIDE.md` - Detailed implementation instructions
- `services/README.md` - Service API and usage
- `services/ImagePreprocessor.example.ts` - Reference code examples

**Next Steps:**
1. Convert Keras model (`smnist.h5`) to TFLite format
2. Place `model.tflite` in `assets/model/`
3. Implement image preprocessing (choose backend or native approach)
4. Test with sign language videos
