// npx ts-node tests/test-backend.ts
import { promises as fs } from 'fs';
import path from 'path';
import { runFullAnalysis } from '../lib/analysis';



async function runTest() {
  try {
    const testAudioPath = path.join(__dirname, 'audio', 'audio.webm');
    console.log(`Reading test audio from ${testAudioPath}`);
    const audioBuffer = await fs.readFile(testAudioPath);
    const result = await runFullAnalysis(audioBuffer);
    console.log('Test pipeline result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error during test:', error);
  }
}

runTest();
