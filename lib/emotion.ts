// lib/emotion.ts
import * as ort from 'onnxruntime-node';
import { decode } from 'wav-decoder';
import { join } from 'path';

let session: ort.InferenceSession | null = null;

async function loadSession() {
  if (!session) {
    session = await ort.InferenceSession.create(join(process.cwd(), 'models', 'emotion_diarization.onnx'));
  }
  return session;
}




export async function analyzeEmotion(wavBuffer: Buffer): Promise<any[]> {
  const session = await loadSession();
  const decoded = await decode(wavBuffer);
  const inputTensor = new ort.Tensor('float32', decoded.channelData[0], [1, decoded.channelData[0].length]);
  
  const results = await session.run({ input: inputTensor });
  return [{
    start: 0.0,
    end: decoded.channelData[0].length / decoded.sampleRate,
    emotion: 'n' //neutral
  }];
}
