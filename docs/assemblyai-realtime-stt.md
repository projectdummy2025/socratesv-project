# AssemblyAI Real-time STT — Core Spec

Source: https://www.assemblyai.com/docs/streaming/getting-started/transcribe-streaming-audio

## 1. Important Rules
- Billed per open WebSocket duration. Always run `client.disconnect(terminate=True)` or send `{"type": "Terminate"}` JSON.
- Real-time token endpoint: `GET https://streaming.assemblyai.com/v3/token?expires_in_seconds=300` (HTTP Method `GET`).
- WebSocket URL: `wss://streaming.assemblyai.com/v3/ws?token=<token>&sample_rate=16000&encoding=pcm_s16le`.
- Default Model: `universal-3-5-pro` (English `en-US`).
- Native Browser Fallback: Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) with `lang = 'id-ID'` for Indonesian speech recognition.

## 2. Server-side Token Generation (Node.js/Fastify)
```javascript
const apiResponse = await fetch('https://streaming.assemblyai.com/v3/token?expires_in_seconds=300', {
  method: 'GET',
  headers: {
    'Authorization': process.env.ASSEMBLYAI_API_KEY
  }
});
const { token } = await apiResponse.json();
const websocketUrl = `wss://streaming.assemblyai.com/v3/ws?token=${token}&sample_rate=16000&encoding=pcm_s16le`;
```

## 3. Web Audio API PCM 16-bit 16kHz Client Streaming
```javascript
const audioCtx = new AudioContext({ sampleRate: 16000 });
const sourceNode = audioCtx.createMediaStreamSource(mediaStream);
const processorNode = audioCtx.createScriptProcessor(4096, 1, 1);

processorNode.onaudioprocess = (e) => {
  const inputChannelData = e.inputBuffer.getChannelData(0);
  const pcm16Data = new Int16Array(inputChannelData.length);
  for (let i = 0; i < inputChannelData.length; i++) {
    const s = Math.max(-1, Math.min(1, inputChannelData[i]));
    pcm16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  socketConnection.send(pcm16Data.buffer);
};

sourceNode.connect(processorNode);
processorNode.connect(audioCtx.destination);
```
