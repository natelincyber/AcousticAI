import re
import wave
import string
import librosa
import soundfile as sf
import numpy as np
from typing import List, Dict
from collections import Counter
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from llama_index.core.prompts import PromptTemplate
from llama_index.llms.openai import OpenAI as LlamaOpenAI
from .data import NLPAnalysis

FILLER_WORDS = {

    "um", "uh", "like", "you know", "so", "well", "i mean", "actually", "basically",
    "right", "okay", "hmm", "uhh", "umm", "err", "alright",

    "literally", "lowkey", "highkey", "kinda", "sorta", "honestly", "seriously",
    "legit", "deadass", "bro", "dude", "not gonna lie", "ngl", "y'know", "fr", "no cap",
    "tbh", "like i said", "idk", "idc", "whatever", "i guess", "i feel like",

    "uhhh", "ummm", "huh", "hmmm", "meh"
}


EMOTION_MAP = {
    "a": "Angry",
    "n": "Neutral",
    "s": "Sad",
    "h": "Happy"
}

def analyze_transcript_llm(transcript: str, analytics) -> NLPAnalysis:

    prompt = PromptTemplate(
    """You are an experienced speaking coach assistant giving advice.

        You are given the following metrics extracted from a user's audio:
        - `pitch`: {pitch_analysis}
        - `top_words`: {top_words}
        - `filler_words`: {filler_words}
        - `wpm`: {wpm}
        - `emotion_percentages`: {emotion_percentages}

        Your task is to analyze the following speech transcript:
        "{transcript}"

        Guidelines:

            Stuttered Words:

                Detect repeated beginnings (e.g., “t-today”, “I-I-I”).

                Count how often each unique stutter appears.

                Focus only on actual repeated speech patterns, not typos or natural repetition.

            Actionable Comments:

                Provide 5 total.

                Each must be a short, clear sentence.

                Use speech metrics (e.g., high WPM, monotone pitch, overuse of fillers) to guide improvement suggestions.

                Use transcript content and metrics (e.g., varied emotion, strong delivery, clear vocabulary) to give affirmations.

        Begin your structured analysis now. """)

    llm = LlamaOpenAI(model="gpt-4o-mini")
    return llm.structured_predict(
        output_cls=NLPAnalysis,
        prompt=prompt,
        transcript=transcript,
        pitch=analytics["pitch_analysis"]["pitch"],
        top_words=analytics["top_words"],
        filler_words=analytics["filler_words"],
        wpm=analytics["wpm"],
        emotion_percentages=analytics["emotion_percentages"],
    )

def get_top_n_words(text: str, n: int) -> Dict[str, int]:
    translator = str.maketrans("", "", string.punctuation)
    text_cleaned = text.translate(translator).lower()
    words = text_cleaned.split()
    word_counts = Counter(words)
    top_n = word_counts.most_common(n)
    return {word: count for word, count in top_n}


def get_filler_words_frequency(transcript: str, filler_words: set = FILLER_WORDS) -> Dict[str, int]:
    transcript = transcript.lower()
    word_list = transcript.split()
    filler_counts = Counter()

    for filler in filler_words:
        if ' ' in filler:
            filler_counts[filler] = transcript.count(filler)


    single_word_fillers = {w for w in filler_words if ' ' not in w}
    for word in word_list:
        if word in single_word_fillers:
            filler_counts[word] += 1

    return {word: count for word, count in filler_counts.items() if count > 0}

def calculate_wpm(wav_path: str, transcript: str) -> float:
    try:
        with wave.open(wav_path, 'rb') as wav_file:
            frames = wav_file.getnframes()
            rate = wav_file.getframerate()
            duration_seconds = frames / float(rate)
        
        duration_minutes = duration_seconds / 60.0
        
        word_count = len(transcript.split())

        wpm = word_count / duration_minutes if duration_minutes > 0 else 0.0
        return round(wpm, 2)
    
    except Exception as e:
        print(f"Error calculating WPM: {e}")
        return 0.0

def pitch_analysis(wav_path):
    y, sr = librosa.load(wav_path)
    duration = librosa.get_duration(y=y, sr=sr)


    f0, voiced_flag, voiced_probs = librosa.pyin(
        y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7')
    )
    times = librosa.times_like(f0)

    voiced_pitches = []
    for t, pitch in zip(times, f0):
        if not np.isnan(pitch):
            voiced_pitches.append({"time": round(float(t), 3), "pitch": round(float(pitch), 2)})

    times = [entry["time"] for entry in voiced_pitches]
    pitches = [entry["pitch"] for entry in voiced_pitches]
    voiced_f0 = f0[~np.isnan(f0)]
    pitch_list = voiced_f0.tolist()

    if pitch_list:
        avg_pitch = np.mean(pitch_list)
    else:

        avg_pitch = 0.0

    return {
        "pitch": avg_pitch,
        "pitch_list": pitches,
        "pitch_timelist": times,
        "duration": duration
    }


def calculate_emotion_percentages(emotion_segments: list, use_full_names: bool = True) -> dict:

    valid_emotions = set(EMOTION_MAP.keys())
    
    emotion_durations = defaultdict(float)
    total_duration = 0.0

    def process_segment(segment):
        nonlocal total_duration
        start = segment.get("start", 0.0)
        end = segment.get("end", 0.0)
        emotion = segment.get("emotion")
        
        if emotion in valid_emotions:
            duration = end - start
            emotion_durations[emotion] += duration
            total_duration += duration

    with ThreadPoolExecutor() as executor:
        executor.map(process_segment, emotion_segments)

    if total_duration == 0:
        return {}

    percentages = {}
    for emotion in EMOTION_MAP:
        key = EMOTION_MAP[emotion] if use_full_names else emotion
        if total_duration > 0:
            percentages[key] = round((emotion_durations[emotion] / total_duration) * 100, 2)
        else:
            percentages[key] = 0.0

    return percentages


def run_full_analysis(transcript: str, wav_path: str, emotion_segments: list = None) -> dict:
    results = {}

    results["pitch_analysis"] = pitch_analysis(wav_path)

    print("pitch analysis done")

    results["top_words"] = get_top_n_words(transcript, 5)

    print("top n done")

    results["filler_words"] = get_filler_words_frequency(transcript)

    print("filler done")

    results["wpm"] = calculate_wpm(wav_path, transcript)

    print("wpm done")

    if emotion_segments:
        results["emotion_percentages"] = calculate_emotion_percentages(emotion_segments)
    else:
        results["emotion_percentages"] = {}

    print("emotion done")

    nlp_analysis = analyze_transcript_llm(transcript, results)
    results["stuttered_words"] = [st.model_dump() for st in nlp_analysis.stuttered_words]
    results["actionable_comments"] = [s.model_dump() for s in nlp_analysis.actionable_comments]

    print("llm analysis done")

    return results