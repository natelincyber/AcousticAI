import re
import wave
import string
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

def analyze_transcript_llm(transcript: str) -> NLPAnalysis:
    prompt = PromptTemplate(
        """You are a speaking coach assistant.

        Your task is to analyze the provided speech transcript and return a structured analysis with:
        1. Stuttered words: Look for repeated syllables, letters, or full words (e.g., "I-I-I", "t-today") and count how many times each unique stutter occurs.
        2. Actionable comments: Provide up to 5 one-sentence suggestions. Each should be either a constructive improvement or a positive affirmation of good speaking habits.

        Return results in the correct structured JSON format defined by the schema.

        Transcript:
        {transcript}
        """
    )

    llm = LlamaOpenAI(model="gpt-4o-mini")
    return llm.structured_predict(
        output_cls=NLPAnalysis,
        prompt=prompt,
        transcript=transcript
    )

def get_top_n_words(text: str, n: int) -> List[str]:
    translator = str.maketrans("", "", string.punctuation)
    text_cleaned = text.translate(translator).lower()
    words = text_cleaned.split()
    word_counts = Counter(words)
    top_n = word_counts.most_common(n)
    return [word for word, _ in top_n]


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


def calculate_emotion_percentages(emotion_segments: list, use_full_names: bool = True) -> dict:

    # Use a set for valid emotions to check in one go
    valid_emotions = set(EMOTION_MAP.keys())
    
    # Using defaultdict to accumulate durations by emotion
    emotion_durations = defaultdict(float)
    total_duration = 0.0

    def process_segment(segment):
        nonlocal total_duration
        # Extract necessary data
        start = segment.get("start", 0.0)
        end = segment.get("end", 0.0)
        emotion = segment.get("emotion")
        
        if emotion in valid_emotions:
            # Compute duration
            duration = end - start
            emotion_durations[emotion] += duration
            total_duration += duration

    # Using ThreadPoolExecutor for parallel processing of large emotion segments
    with ThreadPoolExecutor() as executor:
        executor.map(process_segment, emotion_segments)

    # If no emotion segments, return empty dictionary
    if total_duration == 0:
        return {}

    # Calculate the percentage of total duration for each emotion
    percentages = {
        (EMOTION_MAP.get(emotion) if use_full_names else emotion): round((duration / total_duration) * 100, 2)
        for emotion, duration in emotion_durations.items()
    }

    return percentages


def run_full_analysis(transcript: str, wav_path: str, emotion_segments: list = None) -> dict:
    results = {}

    try:
        nlp_analysis = analyze_transcript_llm(transcript)
        results["stuttered_words"] = [st.model_dump() for st in nlp_analysis.stuttered_words]
        results["actionable_comments"] = [s.model_dump() for s in nlp_analysis.actionable_comments]
    except Exception as e:
        print(f"LLM analysis failed: {e}")
        results["stuttered_words"] = []
        results["actionable_comments"] = []

    print("llm analysis done")

    results["top_words"] = get_top_n_words(transcript, 10)

    print("top n done")

    results["filler_words"] = get_filler_words_frequency(transcript)

    print("filler done")

    results["wpm"] = calculate_wpm(wav_path, transcript)
    print("wpm done")
    if emotion_segments:
        results["emotion_percentages"] = calculate_emotion_percentages(emotion_segments)
    else:
        results["emotion_percentages"] = {}

    return results