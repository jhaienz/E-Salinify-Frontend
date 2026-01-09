import { SignLanguageProcessor } from '@/services/SignLanguageProcessor';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
export default function App() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [translatedText, setTranslatedText] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [recordedVideoUri, setRecordedVideoUri] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);
  const processorRef = useRef<SignLanguageProcessor>(new SignLanguageProcessor());

  // Load the TFLite model
  const model = useTensorflowModel(require('../../../assets/model/model.tflite'));

  useEffect(() => {
    if (model.state === 'loaded') {
      console.log('Model loaded successfully');
    } else if (model.state === 'error') {
      console.error('Error loading model:', model.error);
      Alert.alert('Error', 'Failed to load sign language model');
    }
  }, [model.state]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const startRecording = async () => {
    if (cameraRef.current && !isRecording) {
      setIsRecording(true);
      setTranslatedText('');
      setRecordedVideoUri(null);
      try {
        const video = await cameraRef.current.recordAsync();
        console.log('Video recorded:', video);

        if (video?.uri) {
          setRecordedVideoUri(video.uri);
          // Automatically process the video after recording
          await processRecordedVideo(video.uri);
        }
      } catch (error) {
        console.error('Error recording video:', error);
        Alert.alert('Error', 'Failed to record video');
      } finally {
        setIsRecording(false);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  const processRecordedVideo = async (videoUri: string) => {
    if (model.state !== 'loaded') {
      Alert.alert('Error', 'Model is not loaded yet. Please wait.');
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setShowResult(true);

    try {
      const result = await processorRef.current.processVideo(
        videoUri,
        model.model,
        (progress, currentLetter, currentText) => {
          setProcessingProgress(progress);
          if (currentText) {
            setTranslatedText(currentText);
          }
        }
      );

      setTranslatedText(result || 'No signs detected');
    } catch (error) {
      console.error('Error processing video:', error);
      Alert.alert('Error', 'Failed to process video. Please try again.');
      setShowResult(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeResult = () => {
    setShowResult(false);
    setTranslatedText('');
    setProcessingProgress(0);
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} mode="video" mute={true}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>

          {!isRecording ? (
            <TouchableOpacity
              style={[styles.button, styles.recordButton]}
              onPress={startRecording}
              disabled={model.state !== 'loaded'}
            >
              <Text style={styles.text}>
                {model.state === 'loading' ? 'Loading Model...' : 'Start Recording'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={stopRecording}
            >
              <Text style={styles.text}>Stop Recording</Text>
            </TouchableOpacity>
          )}
        </View>

        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>Recording...</Text>
          </View>
        )}
      </CameraView>

      {/* Processing Modal */}
      <Modal
        visible={showResult}
        animationType="slide"
        transparent={true}
        onRequestClose={closeResult}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isProcessing ? 'Processing Video...' : 'Translation Complete'}
            </Text>

            {isProcessing ? (
              <>
                <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
                <Text style={styles.progressText}>{Math.round(processingProgress)}%</Text>
              </>
            ) : (
              <>
                <View style={styles.resultBox}>
                  <Text style={styles.resultLabel}>Translated Text:</Text>
                  <Text style={styles.resultText}>
                    {translatedText || 'No signs detected'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={closeResult}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
    gap: 20,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderRadius: 10,
  },
  recordButton: {
    backgroundColor: 'rgba(220, 38, 38, 0.7)',
  },
  stopButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.7)',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  recordingIndicator: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    marginRight: 8,
  },
  recordingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginTop: 10,
  },
  resultBox: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  resultLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
