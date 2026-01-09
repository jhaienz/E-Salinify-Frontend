# Services Directory

This directory contains the core business logic for sign language video processing.

## Files

### `SignLanguageProcessor.ts`
Main orchestrator for video-to-text translation.

**Usage:**
```typescript
import { SignLanguageProcessor } from '@/services/SignLanguageProcessor';
import { useTensorflowModel } from 'react-native-fast-tflite';

// In your component
const model = useTensorflowModel(require('@/assets/model/model.tflite'));
const processor = new SignLanguageProcessor();

// Process video
const result = await processor.processVideo(
  videoUri,
  model.model,
  (progress, currentLetter, currentText) => {
    console.log(`Progress: ${progress}%`);
    console.log(`Current: ${currentLetter}`);
    console.log(`Text: ${currentText}`);
  }
);

console.log('Final translation:', result);
```

### `ImagePreprocessor.ts`
Image preprocessing utilities (needs implementation).

**Once implemented, usage will be:**
```typescript
import { getImagePreprocessor } from '@/services/ImagePreprocessor';

const preprocessor = getImagePreprocessor();

// Preprocess a single frame
const processedImage = await preprocessor.preprocessFrame(frameUri);

// Use with model
const prediction = await model.run(processedImage.data);
```

## Integration Flow

```
Video Recording
      ↓
Extract Frames (SignLanguageProcessor.extractFrames)
      ↓
For each frame:
    ↓
    Preprocess (ImagePreprocessor.preprocessFrame)
    ↓
    Detect hand → Crop → Resize → Grayscale → Normalize
    ↓
    Run Model Inference
    ↓
    Check Consistency (15 frames)
    ↓
    Add to translated text if consistent
      ↓
Final Result
```

## Implementation Status

- ✅ **SignLanguageProcessor**: Complete infrastructure, needs preprocessor integration
- ⚠️ **ImagePreprocessor**: Skeleton created, all methods need implementation

## Next Steps

1. Install image processing library:
```bash
npx expo install expo-image-manipulator
```

2. Implement the preprocessing methods in `ImagePreprocessor.ts`

3. Update `SignLanguageProcessor.processFrame()` to use the preprocessor:
```typescript
// In SignLanguageProcessor.ts
import { getImagePreprocessor } from './ImagePreprocessor';

private async processFrame(frameUri: string, model: any) {
    try {
        const preprocessor = getImagePreprocessor();

        // Preprocess the frame
        const processedImage = await preprocessor.preprocessFrame(frameUri);

        // Run model inference
        const output = await model.run(processedImage.data);

        // Find best prediction
        const predictions = output as number[];
        let maxConfidence = 0;
        let maxIndex = 0;

        for (let i = 0; i < predictions.length; i++) {
            if (predictions[i] > maxConfidence) {
                maxConfidence = predictions[i];
                maxIndex = i;
            }
        }

        // Return if confidence is high enough
        if (maxConfidence > this.CONFIDENCE_THRESHOLD) {
            return {
                letter: LETTER_PREDICTIONS[maxIndex],
                confidence: maxConfidence
            };
        }

        return null;
    } catch (error) {
        console.error('Error processing frame:', error);
        return null;
    }
}
```

## Testing

### Test Frame Extraction
```typescript
const frames = await processor.extractFrames(videoUri);
console.log(`Extracted ${frames.length} frames`);
```

### Test Preprocessing (once implemented)
```typescript
const preprocessor = getImagePreprocessor();
const processed = await preprocessor.preprocessFrame(frameUri);
console.log('Processed shape:', processed.data.length); // Should be 784 (28*28)
console.log('Pixel range:', Math.min(...processed.data), '-', Math.max(...processed.data)); // Should be 0-1
```

### Test Model Inference (once preprocessing is done)
```typescript
const result = await processor.processVideo(videoUri, model.model);
console.log('Translation:', result);
```
