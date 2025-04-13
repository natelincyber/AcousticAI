import openai
from openai import OpenAI
import sys
from dotenv import load_dotenv

load_dotenv()

import openai
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

def transcribe_webm_file(webm_path: str) -> str:
    try:
        with open(webm_path, "rb") as audio_file:
            prompt = (
                "Transcribe the audio exactly as spoken. "
                "Preserve all raw speech elements including stutters, filler words, hesitations, and elongated words. "
                "Do not correct or normalize the spoken language."
            )
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                prompt=prompt,
                response_format="text"
            )
        return transcription
    except Exception as e:
        print("Error during transcription:", str(e))
        return "Transcription failed."


if __name__ == "__main__":
    
    webm_file = './uploads/recording.webm'
    transcript = transcribe_webm_file(webm_file)
    
    print("Transcript:")
    print(transcript)
