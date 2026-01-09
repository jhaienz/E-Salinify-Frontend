/**
 * Example Implementation of ImagePreprocessor
 *
 * This is a reference implementation showing how to implement the preprocessing methods.
 * Copy the implementations from this file to ImagePreprocessor.ts and adapt as needed.
 */

import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export class ImagePreprocessorExample {
  /**
   * EXAMPLE: Resize image using expo-image-manipulator
   */
  async resizeImage(
    imageUri: string,
    targetWidth: number,
    targetHeight: number
  ): Promise<string> {
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: targetWidth, height: targetHeight } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    return result.uri;
  }

  /**
   * EXAMPLE: Crop image using expo-image-manipulator
   */
  async cropImage(
    imageUri: string,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<string> {
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ crop: { originX: x, originY: y, width, height } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    return result.uri;
  }

  /**
   * EXAMPLE: Basic approach to get pixel data
   *
   * Note: This is simplified. For production, you may need to use:
   * - @shopify/react-native-skia for direct pixel access
   * - expo-gl for WebGL-based processing
   * - Native modules for better performance
   */
  async getNormalizedPixelData(imageUri: string): Promise<Float32Array> {
    try {
      // For now, we'll need to use a workaround since React Native
      // doesn't have direct pixel access like Python's OpenCV

      // Option 1: Use base64 (simplified but not accurate for grayscale)
      // This is a placeholder - you'll need a proper implementation

      // For actual implementation, consider:
      // 1. Using react-native-image-to-base64 to get base64
      // 2. Decoding base64 to get RGBA values
      // 3. Converting to grayscale: gray = 0.299*R + 0.587*G + 0.114*B
      // 4. Normalizing to 0-1 range

      // Placeholder: Create a 28x28 array
      const pixels = new Float32Array(28 * 28);

      // In production, fill this with actual normalized pixel values
      // For now, return zeros (this won't work but shows the structure)

      console.warn('getNormalizedPixelData needs proper implementation');
      return pixels;
    } catch (error) {
      console.error('Error getting pixel data:', error);
      throw error;
    }
  }

  /**
   * EXAMPLE: Complete preprocessing pipeline
   *
   * This shows the full workflow but note that getNormalizedPixelData
   * needs a proper implementation for this to work.
   */
  async preprocessFrame(frameUri: string): Promise<{
    data: Float32Array;
    width: number;
    height: number;
  }> {
    try {
      // Step 1: Resize to 28x28
      const resizedUri = await this.resizeImage(frameUri, 28, 28);

      // Step 2: Get pixel data (needs proper implementation)
      const pixelData = await this.getNormalizedPixelData(resizedUri);

      // Step 3: Clean up temporary file
      try {
        await FileSystem.deleteAsync(resizedUri);
      } catch (e) {
        // Ignore cleanup errors
      }

      return {
        data: pixelData,
        width: 28,
        height: 28,
      };
    } catch (error) {
      console.error('Error in preprocessing:', error);
      throw error;
    }
  }
}

/**
 * ALTERNATIVE APPROACH: Backend Processing
 *
 * If image preprocessing in React Native is too complex, consider
 * processing on a backend server:
 */

export class BackendPreprocessor {
  private readonly API_URL = 'https://your-api.com/process-video';

  /**
   * Send video to backend for processing
   */
  async processVideoOnBackend(videoUri: string): Promise<string> {
    try {
      // Read video file
      const videoData = await FileSystem.readAsStringAsync(videoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Send to backend
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video: videoData,
        }),
      });

      const result = await response.json();
      return result.translatedText;
    } catch (error) {
      console.error('Backend processing error:', error);
      throw error;
    }
  }
}

/**
 * PYTHON BACKEND EXAMPLE
 *
 * If you choose the backend approach, here's a Flask example:
 *
 * ```python
 * from flask import Flask, request, jsonify
 * import base64
 * import tempfile
 * import os
 *
 * app = Flask(__name__)
 *
 * @app.route('/process-video', methods=['POST'])
 * def process_video():
 *     data = request.json
 *     video_base64 = data['video']
 *
 *     # Decode base64 to video file
 *     video_data = base64.b64decode(video_base64)
 *
 *     # Save to temporary file
 *     with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp:
 *         tmp.write(video_data)
 *         tmp_path = tmp.name
 *
 *     try:
 *         # Use your existing Python code here
 *         from your_processing_script import process_video_to_text
 *         translated_text = process_video_to_text(tmp_path)
 *
 *         return jsonify({'translatedText': translated_text})
 *     finally:
 *         # Cleanup
 *         os.unlink(tmp_path)
 *
 * if __name__ == '__main__':
 *     app.run(host='0.0.0.0', port=5000)
 * ```
 */

/**
 * RECOMMENDATION FOR PIXEL DATA EXTRACTION
 *
 * The hardest part is getting grayscale pixel values from images in React Native.
 * Here are your best options:
 *
 * 1. Use react-native-image-to-base64 + canvas processing
 *    - Decode base64 PNG
 *    - Extract RGBA values
 *    - Convert to grayscale
 *
 * 2. Use @shopify/react-native-skia
 *    - Direct pixel access
 *    - Better performance
 *    - More complex setup
 *
 * 3. Use native modules
 *    - Write native Java/Kotlin (Android) and Swift/Obj-C (iOS)
 *    - Best performance
 *    - Most complex
 *
 * 4. Use backend processing (recommended for MVP)
 *    - Reuse your existing Python code
 *    - Fast to implement
 *    - Requires internet connection
 */
