import fs from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { promisify } from 'util';
import ffmpeg from 'fluent-ffmpeg';



const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);



export async function convertWebmToWav(webmBuffer: Buffer): Promise<{ wavBuffer: Buffer; duration: number }> {
  const tempDir = tmpdir();
  const unique = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  const inputPath = join(tempDir, `${unique}.webm`);
  const outputPath = join(tempDir, `${unique}.wav`);



  await writeFileAsync(inputPath, webmBuffer);
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec('pcm_s16le')
      .audioChannels(1)
      .audioFrequency(16000)
      .format('wav')
      .on('error', async (err: any) => {
        await unlinkAsync(inputPath);
        reject(err);
      })
      .on('end', async () => {
        try {
          ffmpeg.ffprobe(outputPath, async (err: any, metadata: any) => {
            if (err) {
              await unlinkAsync(inputPath);
              await unlinkAsync(outputPath);
              return reject(err);
            }
            const duration = metadata.format?.duration || 0;
            const wavBuffer = await readFileAsync(outputPath);
            await unlinkAsync(inputPath);
            await unlinkAsync(outputPath);
            resolve({ wavBuffer, duration });
          });
        } catch (error) {
          reject(error);
        }
      })
      
      .save(outputPath);
  });
}
