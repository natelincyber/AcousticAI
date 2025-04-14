import OpenAI from 'openai';
import { tmpdir } from 'os';
import { join } from 'path';
import fs from 'fs/promises';
import { createReadStream } from 'fs';



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



export async function transcribeAudio(wavBuffer: Buffer): Promise<string> {
  const tempFilePath = join(
    tmpdir(),
    `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.wav`
  );
  await fs.writeFile(tempFilePath, wavBuffer);
  try {
    const prompt =
      "Transcribe the audio exactly as spoken. Preserve all raw speech elements including stutters, filler words, hesitations, and elongated words. Do not correct or normalize the spoken language.";
    const response = await openai.audio.transcriptions.create({
      file: createReadStream(tempFilePath),
      model: "whisper-1",
      prompt,
      response_format: "text",
    });
    


    return response;
  } catch (error) {
    console.error("Error during transcription:", error);
    return "Transcription failed.";
  } finally {
    await fs.unlink(tempFilePath);
  }
}
