# AssemblyAI Real-time STT — Core Spec

Source: https://www.assemblyai.com/docs/streaming/getting-started/transcribe-streaming-audio.md

## 1. Important Rules
- Billed per open WebSocket duration. Always run `client.disconnect(terminate=True)` or `transcriber.close()`.
- Default Model: `universal-3-5-pro`.

## 2. Python Code Snippet
```python
import os, requests
from assemblyai.streaming.v3 import RealTimeTranscriber, RealTimeTranscriberOptions, RealTimeParameters, Encoding, RealTimeEvents

client = RealTimeTranscriber(
    RealTimeTranscriberOptions(terminate_timeout=30.0),
    api_key=os.environ["ASSEMBLYAI_API_KEY"]
)
client.on(RealTimeEvents.Turn, lambda c, e: print(e.transcript) if e.transcript else None)

client.connect(RealTimeParameters(speech_model="universal-3-5-pro", encoding=Encoding.aac))
# Stream audio chunks...
client.disconnect(terminate=True)
```

## 3. JavaScript / Node.js Code Snippet
```javascript
import { AssemblyAI } from "assemblyai";
const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });
const transcriber = client.streaming.transcriber({ speechModel: "universal-3-5-pro", encoding: "aac" });

transcriber.on("turn", (turn) => { if (turn.transcript) console.log(turn.transcript); });
await transcriber.connect();
// Send audio chunks via transcriber.sendAudio(buffer)...
await transcriber.close();
```
