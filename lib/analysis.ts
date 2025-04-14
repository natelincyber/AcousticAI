import { convertWebmToWav } from './ffmpeg';
import { transcribeAudio } from './whisper';
import { pitchAnalysis, getTopNWords, getFillerWordsFrequency, calculateWpm } from './audio-features';
import { analyzeEmotion } from './emotion';
import { FILLER_WORDS } from './constants';


export async function runFullAnalysis(webmBuffer: Buffer): Promise<any> {
  const { wavBuffer, duration } = await convertWebmToWav(webmBuffer);

  const transcript = await transcribeAudio(wavBuffer);

  const pitchData = await pitchAnalysis(wavBuffer);

  const topWords = getTopNWords(transcript, 5);

  const fillerWords = getFillerWordsFrequency(transcript, FILLER_WORDS);

  const wpm = await calculateWpm(wavBuffer, transcript);

  const emotionSegments = await analyzeEmotion(wavBuffer);

  const emotionPercentages = calculateEmotionPercentages(emotionSegments);

  //placeholder
  const stuttered_words: any[] = [];

  const actionable_comments: any[] = [];

  return {
    transcript,
    pitch_analysis: pitchData,
    top_words: topWords,
    filler_words: fillerWords,
    wpm,
    emotion_percentages: emotionPercentages,
    stuttered_words,
    actionable_comments,
  };
}




function calculateEmotionPercentages(segments: any[], useFullNames = true): Record<string, number> {
  const EMOTION_MAP: Record<string, string> = {
    a: "Angry",
    n: "Neutral",
    s: "Sad",
    h: "Happy"
  };
  const emotionDurations: Record<string, number> = {};
  let totalDuration = 0;

  
  segments.forEach(seg => {
    const start = seg.start || 0;
    const end = seg.end || 0;
    const emotion = seg.emotion;
    if (emotion in EMOTION_MAP) {
      const dur = end - start;
      emotionDurations[emotion] = (emotionDurations[emotion] || 0) + dur;
      totalDuration += dur;
    }
  });


  const percentages: Record<string, number> = {};
  Object.entries(EMOTION_MAP).forEach(([code, name]) => {
    percentages[useFullNames ? name : code] =
      totalDuration > 0 ? Number(((emotionDurations[code] || 0) / totalDuration * 100).toFixed(2)) : 0;
  });
  return percentages;
}
