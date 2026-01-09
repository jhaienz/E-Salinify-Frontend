# Quick Start Guide

## 🎯 Current Status

✅ **Working:**
- Video recording
- Frame extraction
- Model loading
- UI/Progress tracking
- Result display

⚠️ **Needs Work:**
- Image preprocessing (convert frames to 28x28 grayscale)

## 🚀 Fastest Way to Get It Working

### Option 1: Backend Processing (30 minutes)

**Use your existing Python code!**

1. Create `backend/server.py`:
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import tempfile
import os

# Copy your Python processing code here or import it
# from your_script import translate_video

app = Flask(__name__)
CORS(app)

@app.route('/translate', methods=['POST'])
def translate():
    video_b64 = request.json['video']
    video_bytes = base64.b64decode(video_b64)

    # Save to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as f:
        f.write(video_bytes)
        temp_path = f.name

    try:
        # Use your existing Python function
        result = translate_video(temp_path)  # Your function here
        return jsonify({'text': result})
    finally:
        os.unlink(temp_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

2. Install dependencies:
```bash
pip install flask flask-cors
```

3. Update `services/SignLanguageProcessor.ts` - replace the `processVideo` method:
```typescript
async processVideo(videoUri: string, model: any, onProgress) {
    onProgress?.(10, undefined, 'Uploading video...');

    const videoData = await FileSystem.readAsStringAsync(videoUri);

    onProgress?.(30, undefined, 'Processing on server...');

    const response = await fetch('http://YOUR_IP:5000/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video: videoData }),
    });

    const result = await response.json();
    onProgress?.(100, undefined, result.text);
    return result.text;
}
```

4. Run:
```bash
# Terminal 1 - Backend
python backend/server.py

# Terminal 2 - React Native
npm start
```

### Option 2: Implement Preprocessing (2-4 hours)

See `IMPLEMENTATION_GUIDE.md` and `ImagePreprocessor.example.ts`

## 📋 Quick Checklist

Before testing:

- [ ] Model converted to TFLite (`model.tflite` in `/assets/model/`)
- [ ] Dependencies installed (`npm install`)
- [ ] Camera permissions granted
- [ ] Choose implementation approach (backend or native)
- [ ] Update `SignLanguageProcessor.ts` accordingly

## 🧪 Testing

1. Run: `npm start`
2. Open in simulator/device
3. Navigate to Camera screen
4. Record a sign language video (3-5 seconds)
5. Wait for processing
6. Check results

## 🔧 Configuration

Edit `services/SignLanguageProcessor.ts`:

```typescript
CONFIDENCE_THRESHOLD = 0.8;   // Lower = more detections
CONSISTENCY_FRAMES = 15;       // Lower = faster but less accurate
FRAME_INTERVAL_MS = 33;        // Higher = fewer frames, faster
```

## 📁 Key Files

- `/app/home/camera/index.tsx` - Camera screen UI
- `/services/SignLanguageProcessor.ts` - Main logic
- `/services/ImagePreprocessor.ts` - Image preprocessing (needs implementation)
- `/assets/model/model.tflite` - AI model

## 🐛 Common Issues

**"Model not loaded"**
→ Check model file exists at `/assets/model/model.tflite`

**"No frames extracted"**
→ Record longer video (5+ seconds)

**"No signs detected"**
→ Normal until preprocessing is implemented

**App crashes**
→ Check console for errors, may need to clear cache

## 📚 Full Documentation

- `CONVERSION_SUMMARY.md` - Complete overview
- `IMPLEMENTATION_GUIDE.md` - Detailed implementation guide
- `services/README.md` - API documentation

## 💡 Tips

1. Start with backend approach to validate the model works
2. Then optimize with native preprocessing if needed
3. Test with clear, well-lit sign language videos
4. Adjust thresholds based on your testing results

## 🎉 Done!

Once working, you should see:
- Record video ✓
- Processing modal ✓
- Translated text appears ✓

Happy coding! 🚀
