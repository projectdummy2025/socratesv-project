# AssemblyAI Integration Reference — Socrates-Voice

## 1. Overview
Socrates-Voice utilizes AssemblyAI for real-time speech recognition and voice token management:
- **Real-time STT Token Generation**: Backend generates short-lived WebSocket tokens (`expires_in_seconds=300`).
- **Streaming Client**: Web Audio API streams PCM 16-bit 16kHz audio from client browser to AssemblyAI.
- **Native Browser Fallback**: Web Speech API (`id-ID`) for localized Indonesian speech recognition.

---

## 2. Server-side Token Generation (Fastify Node.js Backend)

```typescript
// Token Endpoint: GET https://streaming.assemblyai.com/v3/token?expires_in_seconds=300
const apiResponse = await fetch('https://streaming.assemblyai.com/v3/token?expires_in_seconds=300', {
  method: 'GET',
  headers: {
    'Authorization': process.env.ASSEMBLYAI_API_KEY
  }
});
const { token } = await apiResponse.json();
const websocketUrl = `wss://streaming.assemblyai.com/v3/ws?token=${token}&sample_rate=16000&encoding=pcm_s16le`;
```

---

## 3. Client Audio Streaming (Web Audio API PCM 16-bit 16kHz)

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

---

## 4. WebSocket Termination Protocol
Always close WebSocket connections properly to prevent unwanted usage:
- Send `{"type": "Terminate"}` JSON message before closing socket.
- Call `socket.close(1000, "User stopped session")`.
