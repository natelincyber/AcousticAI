import Pitchfinder from 'pitchfinder';
import { decode } from 'wav-decoder';




export function getTopNWords(text: string, n: number): Record<string, number> {
  const cleaned = text.replace(/[^\w\s]/g, '').toLowerCase();
  const words = cleaned.split(/\s+/);
  const count: Record<string, number> = {};
  words.forEach((w) => {
    if (w) count[w] = (count[w] || 0) + 1;
  });
  const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
  const result: Record<string, number> = {};
  sorted.slice(0, n).forEach(([word, cnt]) => (result[word] = cnt));
  return result;
}




export function getFillerWordsFrequency(transcript: string, fillerSet: Set<string>): Record<string, number> {
  const lower = transcript.toLowerCase();
  const words = lower.split(/\s+/);
  const counts: Record<string, number> = {};
  fillerSet.forEach((filler) => {
    counts[filler] = 0;
  });
  words.forEach((word) => {
    if (fillerSet.has(word)) {
      counts[word] = (counts[word] || 0) + 1;
    }
  });
  for (const key in counts) {
    if (counts[key] === 0) delete counts[key];
  }
  return counts;
}




export async function calculateWpm(wavBuffer: Buffer, transcript: string): Promise<number> {
  const decoded = await decode(wavBuffer);
  const durationSeconds = decoded.channelData[0].length / decoded.sampleRate;
  const minutes = durationSeconds / 60;
  const wordCount = transcript.trim().split(/\s+/).length;
  return minutes > 0 ? Number((wordCount / minutes).toFixed(2)) : 0;
}




export async function pitchAnalysis(wavBuffer: Buffer): Promise<{ avgPitch: number; pitchList: number[]; duration: number }> {
  const decoded = await decode(wavBuffer);
  const signal = decoded.channelData[0];
  const sampleRate = decoded.sampleRate;
  const duration = signal.length / sampleRate;
  
  const detectPitch = Pitchfinder.YIN({ sampleRate });
  const pitches: number[] = [];
  const windowSize = 1024;
  const hopSize = 256;
  for (let i = 0; i < signal.length - windowSize; i += hopSize) {
    const segment = signal.slice(i, i + windowSize);
    const pitch = detectPitch(segment);
    if (pitch) {
      pitches.push(pitch);
    }
  }
  const avgPitch = pitches.reduce((a, b) => a + b, 0) / (pitches.length || 1);
  return { avgPitch, pitchList: pitches, duration };
}
