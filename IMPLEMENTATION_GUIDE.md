# Sign Language Video Processing - Implementation Guide

This document explains the React Native implementation of the Python sign language video-to-text translation system.

## Overview

The implementation converts recorded sign language videos into text using a TensorFlow Lite model. The system:
1. Records video from the camera
2. Extracts frames from the video
3. Processes each frame through the TFLite model
4. Applies consistency logic to build the translated text
5. Displays the result to the user

## Files Created/Modified

### 1. `/services/SignLanguageProcessor.ts`
Core service that handles video processing logic.

**Key Features:**
- Extracts frames from video using `expo-video-thumbnails`
- Processes frames through the TFLite model
- Implements consistency logic (same letter must appear for 15 consecutive frames)
- Progress tracking with callbacks

**Key Methods:**
- `extractFrames(videoUri)`: Extracts ~100 frames from the video (33ms intervals, ~30fps)
- `processFrame(frameUri, model)`: Processes a single frame (placeholder - needs implementation)
- `processVideo(videoUri, model, onProgress)`: Main method that orchestrates the entire process

### 2. `/app/home/camera/index.tsx`
Updated camera screen with video processing integration.

**New Features:**
- TFLite model loading on component mount
- Automatic video processing after recording stops
- Processing modal with progress indicator
- Result display with translated text
- Recording indicator during video capture

**Key State:**
- `isProcessing`: Whether video is currently being processed
- `processingProgress`: Progress percentage (0-100)
- `translatedText`: Final translated text result
- `showResult`: Controls the result modal visibility

## Architecture Differences from Python

### Python Implementation
```python
# Processes video frame-by-frame in real-time
cap = cv2.VideoCapture(video_path)
while cap.isOpened():
    ret, frame = cap.read()
    # Immediate frame processing with MediaPipe
    # Hand detection → Crop → Grayscale → Resize → Model inference
```

### React Native Implementation
```typescript
// Two-stage process:
// 1. Extract frames as thumbnails
const frames = await extractFrames(videoUri);

// 2. Process each frame
for (const frame of frames) {
    const result = await processFrame(frame, model);
}
```

## What's Complete

✅ **Infrastructure:**
- Service architecture (`SignLanguageProcessor`)
- Model loading with `react-native-fast-tflite`
- Frame extraction with `expo-video-thumbnails`
- UI with progress tracking and result display

✅ **Logic:**
- Consistency checking (15 frames)
- Progress callbacks
- Error handling
- File cleanup after processing

✅ **UI/UX:**
- Recording indicator
- Processing modal with progress
- Result display
- Model loading state

## What Needs Implementation

### ⚠️ Critical: Frame Preprocessing

The `processFrame` method in [SignLanguageProcessor.ts](services/SignLanguageProcessor.ts:69-100) is currently a placeholder. You need to implement:

```typescript
private async processFrame(frameUri: string, model: any) {
    // TODO: Implement the following steps:

    // 1. Load the frame image
    // 2. Convert to grayscale
    // 3. Detect hand landmarks (consider react-native-mediapipe or similar)
    // 4. Calculate hand bounding box
    // 5. Crop to hand region
    // 6. Resize to 28x28
    // 7. Normalize pixel values to 0-1 range
    // 8. Format as tensor input for the model
    // 9. Run model inference
    // 10. Return prediction with confidence
}
```

### Options for Hand Detection

**Option 1: Native MediaPipe (Recommended)**
- Use `@mediapipe/tasks-vision` or similar React Native binding
- Provides hand landmark detection like the Python version
- Most accurate, matches Python implementation

**Option 2: Backend Processing**
- Send video to a backend server
- Process with the existing Python code
- Return translated text
- Pros: Reuses existing code, easier preprocessing
- Cons: Requires internet, slower, server costs

**Option 3: Simplified Approach**
- Use image processing libraries like `react-native-image-resizer`
- Manual grayscale conversion
- Skip hand detection, process full frame
- Pros: Simpler, no external dependencies
- Cons: Less accurate, may not work well

## Dependencies Installed

```json
{
  "expo-file-system": "latest",
  "expo-video-thumbnails": "latest",
  "react-native-fast-tflite": "^1.6.1" (already installed)
}
```

## Model File

The TFLite model should be located at:
```
/assets/model/model.tflite
```

Make sure your `smnist.h5` Keras model is converted to TFLite format. If you need to convert it:

```python
import tensorflow as tf

# Load Keras model
model = tf.keras.models.load_model('smnist.h5')

# Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Save
with open('model.tflite', 'wb') as f:
    f.write(tflite_model)
```

## Usage

1. **Launch the camera screen**
2. **Wait for "Loading Model..." to change to "Start Recording"**
3. **Tap "Start Recording"** - perform sign language gestures
4. **Tap "Stop Recording"** - video processing begins automatically
5. **View progress** - modal shows processing percentage
6. **See results** - translated text appears when complete

## Testing the Implementation

Since frame preprocessing is not yet implemented, the current code will:
- ✅ Successfully record video
- ✅ Extract frames from the video
- ✅ Show processing progress
- ❌ Return empty/null results (no actual predictions)

To test that the infrastructure works:
1. Add temporary mock predictions in `processFrame`:
```typescript
// Temporary test code
return {
    letter: LETTER_PREDICTIONS[Math.floor(Math.random() * LETTER_PREDICTIONS.length)],
    confidence: 0.9
};
```
2. Record a short video
3. Verify the processing modal appears
4. Check that random letters appear (proves the pipeline works)

## Next Steps

1. **Implement frame preprocessing** (critical)
   - Research React Native image processing libraries
   - Implement grayscale conversion
   - Implement resize to 28x28
   - Implement hand detection (optional but recommended)

2. **Test with actual data**
   - Record videos with known sign language gestures
   - Verify predictions match expected letters
   - Tune confidence threshold if needed

3. **Optimize performance**
   - Adjust frame extraction rate (currently 30fps, can reduce to 15fps)
   - Adjust consistency frames (currently 15, can tune)
   - Consider processing frames in batches

4. **Error handling**
   - Handle model loading failures gracefully
   - Provide feedback for unclear signs
   - Add retry logic for failed processing

## Key Parameters to Tune

```typescript
// In SignLanguageProcessor.ts
CONFIDENCE_THRESHOLD = 0.8;  // Minimum confidence to accept prediction
CONSISTENCY_FRAMES = 15;      // Frames needed for consistent letter
FRAME_INTERVAL_MS = 33;       // 33ms = ~30fps, increase for fewer frames
```

## Troubleshooting

**Model won't load:**
- Check that `model.tflite` exists in `/assets/model/`
- Verify file permissions
- Check console for error messages

**No predictions:**
- Frame preprocessing not implemented yet (expected)
- Follow "Next Steps" above

**Poor accuracy:**
- Adjust `CONFIDENCE_THRESHOLD`
- Adjust `CONSISTENCY_FRAMES`
- Improve frame preprocessing quality
- Ensure lighting is good during recording

**Slow processing:**
- Reduce frame count (change `frameCount` in `extractFrames`)
- Increase `FRAME_INTERVAL_MS` to extract fewer frames
- Consider processing on backend server

## Code References

- Camera screen: [app/home/camera/index.tsx](app/home/camera/index.tsx)
- Processing service: [services/SignLanguageProcessor.ts](services/SignLanguageProcessor.ts)
- Model location: [assets/model/model.tflite](assets/model/model.tflite)
