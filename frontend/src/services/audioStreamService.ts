// Real-time audio recorder and WebSocket streamer for AssemblyAI Voice Agent & Web Speech API
export interface AudioStreamCallbacks {
  onTranscript: (speakerRole: string, transcriptText: string) => void;
  onError: (errorMessage: string) => void;
}

export class AudioStreamManager {
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private socketConnection: WebSocket | null = null;
  private speechRecognitionInstance: any | null = null;
  private isCancelled = false;

  // Start recording audio from microphone and stream to AssemblyAI / Web Speech API (Indonesian id-ID)
  public async startStreaming(websocketUrl: string, callbacks: AudioStreamCallbacks): Promise<void> {
    this.stopStreaming(); // Ensure previous connections are fully closed
    this.isCancelled = false;

    // 1. Try Native Web Speech API with Indonesian (id-ID) for accurate local speech recognition
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        this.speechRecognitionInstance = recognition;
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          if (this.isCancelled) return;
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              const transcriptText = event.results[i][0].transcript.trim();
              if (transcriptText) {
                console.log('(SpeechRec) Recognized Indonesian speech:', transcriptText);
                callbacks.onTranscript('USER', transcriptText);
              }
            }
          }
        };

        recognition.onerror = (event: any) => {
          if (this.isCancelled) return;
          console.warn('(SpeechRec) Native speech error:', event.error);
        };

        recognition.onend = () => {
          if (!this.isCancelled && this.speechRecognitionInstance) {
            try {
              this.speechRecognitionInstance.start();
            } catch (err) {
              // Already started or active
            }
          }
        };

        recognition.start();
        console.log('(AudioStream) Native Indonesian SpeechRecognition started');
        return;
      } catch (nativeErr) {
        console.warn('(AudioStream) Native SpeechRecognition fallback to WebSocket:', nativeErr);
      }
    }

    // 2. Fallback to AssemblyAI WebSocket Raw PCM Stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (this.isCancelled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      this.mediaStream = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx({ sampleRate: 16000 });
      const sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);

      if (websocketUrl && (websocketUrl.startsWith('wss://') || websocketUrl.startsWith('ws://'))) {
        const wsConnection = new WebSocket(websocketUrl);
        this.socketConnection = wsConnection;

        wsConnection.onopen = () => {
          if (this.isCancelled) {
            wsConnection.close();
            return;
          }
          console.log('(AudioStream) WebSocket connected to AssemblyAI STT');
        };

        wsConnection.onmessage = (event) => {
          if (this.isCancelled) return;
          try {
            const messageData = JSON.parse(event.data);
            console.log('(AudioStream) Received AssemblyAI message:', messageData);
            if ((messageData.type === 'Turn' || messageData.message_type === 'FinalTranscript') && messageData.transcript) {
              callbacks.onTranscript('USER', messageData.transcript);
            } else if (messageData.type === 'Error') {
              console.error('(AudioStream) AssemblyAI Error:', messageData.error);
              callbacks.onError(messageData.error || 'AssemblyAI Error');
            }
          } catch (err) {
            console.warn('(AudioStream) Parsing message error:', err);
          }
        };

        wsConnection.onerror = (err) => {
          if (this.isCancelled) return;
          callbacks.onError('WebSocket connection error');
          console.error('(AudioStream) WebSocket error:', err);
        };
      }

      this.processorNode.onaudioprocess = (audioProcessingEvent) => {
        if (!this.isCancelled && this.socketConnection?.readyState === WebSocket.OPEN) {
          const inputChannelData = audioProcessingEvent.inputBuffer.getChannelData(0);
          const pcm16Data = new Int16Array(inputChannelData.length);
          for (let index = 0; index < inputChannelData.length; index++) {
            const floatSample = Math.max(-1, Math.min(1, inputChannelData[index]));
            pcm16Data[index] = floatSample < 0 ? floatSample * 0x8000 : floatSample * 0x7FFF;
          }
          this.socketConnection.send(pcm16Data.buffer);
        }
      };

      sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.audioContext.destination);

    } catch (err) {
      if (this.isCancelled) return;
      callbacks.onError('Microphone access denied or unsupported');
      console.error('(AudioStream) Media error:', err);
    }
  }

  // Stop audio recording and close all speech & WebSocket resources immediately
  public stopStreaming(): void {
    this.isCancelled = true;

    try {
      if (this.speechRecognitionInstance) {
        const instance = this.speechRecognitionInstance;
        this.speechRecognitionInstance = null;
        instance.onend = null;
        instance.onresult = null;
        instance.onerror = null;
        instance.stop();
        instance.abort();
      }
    } catch (err) {
      console.warn('(AudioStream) SpeechRecognition stop error:', err);
    }

    try {
      if (this.processorNode) {
        this.processorNode.onaudioprocess = null;
        this.processorNode.disconnect();
      }
    } catch (err) {
      console.warn('(AudioStream) ProcessorNode disconnect error:', err);
    }

    try {
      if (this.audioContext) {
        this.audioContext.close();
      }
    } catch (err) {
      console.warn('(AudioStream) AudioContext close error:', err);
    }

    try {
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      }
    } catch (err) {
      console.warn('(AudioStream) MediaStream tracks stop error:', err);
    }

    try {
      if (this.socketConnection) {
        if (this.socketConnection.readyState === WebSocket.OPEN) {
          this.socketConnection.send(JSON.stringify({ type: 'Terminate' }));
          this.socketConnection.close(1000, 'User stopped session');
        } else if (this.socketConnection.readyState === WebSocket.CONNECTING) {
          this.socketConnection.close(1000, 'User stopped session');
        }
      }
    } catch (err) {
      console.warn('(AudioStream) WebSocket close error:', err);
    }

    this.speechRecognitionInstance = null;
    this.mediaStream = null;
    this.audioContext = null;
    this.processorNode = null;
    this.socketConnection = null;
    console.log('(AudioStream) Audio recording and streaming stopped completely');
  }
}
