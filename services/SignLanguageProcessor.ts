import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';

// Sign language alphabet (J and Z are motion-based, not included in static model)
const LETTER_PREDICTIONS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'
];

export interface ProcessingResult {
  translatedText: string;
  isProcessing: boolean;
  progress: number;
  currentLetter?: string;
  error?: string;
}

export class SignLanguageProcessor {
  private readonly CONFIDENCE_THRESHOLD = 0.8;
  private readonly CONSISTENCY_FRAMES = 15;
  private readonly FRAME_INTERVAL_MS = 33; // ~30 fps

  /**
   * Extract frames from video as thumbnails at regular intervals
   * @param videoUri - URI of the video file
   * @returns Array of frame URIs
   */
  private async extractFrames(videoUri: string): Promise<string[]> {
    const frames: string[] = [];

    try {
      // Get video duration (we'll extract frames every 33ms to simulate 30fps)
      // For simplicity, we'll extract 30 frames (1 second of video at 30fps)
      // You can adjust this based on your video length

      const frameCount = 100; // Extract 100 frames

      for (let i = 0; i < frameCount; i++) {
        const timeMs = i * this.FRAME_INTERVAL_MS;

        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
            time: timeMs,
            quality: 1.0,
          });
          frames.push(uri);
        } catch (error) {
          // If we can't get more frames (end of video), stop
          console.log(`Stopped at frame ${i}, video might be shorter`);
          break;
        }
      }

      console.log(`Extracted ${frames.length} frames from video`);
      return frames;
    } catch (error) {
      console.error('Error extracting frames:', error);
      throw new Error('Failed to extract video frames');
    }
  }

  /**
   * Process a single frame image and return the predicted letter
   * Note: This is a simplified version - proper preprocessing would be needed
   * @param frameUri - URI of the frame image
   * @param model - The loaded TFLite model
   */
  private async processFrame(
    frameUri: string,
    model: any
  ): Promise<{ letter: string; confidence: number } | null> {
    try {
      // In a real implementation, you would:
      // 1. Load the image
      // 2. Convert to grayscale
      // 3. Detect hand landmarks using MediaPipe (react-native-mediapipe)
      // 4. Crop to hand bounding box
      // 5. Resize to 28x28
      // 6. Normalize pixel values (0-1)
      // 7. Run inference

      // For now, this is a placeholder showing the inference logic
      // You'll need to implement proper image preprocessing

      // Read frame as base64
      const base64 = await FileSystem.readAsStringAsync(frameUri);

      // This is where you'd preprocess and run the model
      // const output = await model.run(preprocessedData);

      // Placeholder: Return null until proper preprocessing is implemented
      return null;
    } catch (error) {
      console.error('Error processing frame:', error);
      return null;
    }
  }

  /**
   * Process a recorded video and return the translated text
   * @param videoUri - URI of the recorded video file
   * @param model - The loaded TFLite model (from useTensorflowModel hook)
   * @param onProgress - Callback for progress updates
   */
  async processVideo(
    videoUri: string,
    model: any,
    onProgress?: (progress: number, currentLetter?: string, currentText?: string) => void
  ): Promise<string> {
    if (!model) {
      throw new Error('Model not loaded');
    }

    try {
      // Extract frames from video
      onProgress?.(10, undefined, 'Extracting frames...');
      const frames = await this.extractFrames(videoUri);

      if (frames.length === 0) {
        throw new Error('No frames extracted from video');
      }

      // Process frames to get translated text
      onProgress?.(30, undefined, 'Processing frames...');
      let translatedText = '';
      let lastPredictedLetter = '';
      let framesConsistent = 0;

      for (let i = 0; i < frames.length; i++) {
        const result = await this.processFrame(frames[i], model);

        if (result) {
          const { letter, confidence } = result;

          // Only add letter if it stays the same for CONSISTENCY_FRAMES
          // and confidence is high enough
          if (letter === lastPredictedLetter) {
            framesConsistent++;
          } else {
            framesConsistent = 0;
            lastPredictedLetter = letter;
          }

          if (framesConsistent === this.CONSISTENCY_FRAMES) {
            translatedText += letter;
            console.log(`Added letter: ${letter} | Translation: ${translatedText}`);
            framesConsistent = 0; // Reset
          }

          // Update progress
          const progress = 30 + Math.floor((i / frames.length) * 60);
          onProgress?.(progress, letter, translatedText);
        }

        // Clean up frame file
        try {
          await FileSystem.deleteAsync(frames[i]);
        } catch (e) {
          // Ignore cleanup errors
        }
      }

      onProgress?.(100, undefined, translatedText);
      return translatedText;
    } catch (error) {
      console.error('Error processing video:', error);
      throw error;
    }
  }
}

// Singleton instance
let processorInstance: SignLanguageProcessor | null = null;

export const getSignLanguageProcessor = (): SignLanguageProcessor => {
  if (!processorInstance) {
    processorInstance = new SignLanguageProcessor();
  }
  return processorInstance;
};
