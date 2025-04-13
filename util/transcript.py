import openai
from openai import OpenAI
import sys
from dotenv import load_dotenv

load_dotenv()



def transcribe_webm_file(webm_path: str) -> str:
    """
    Transcribe a WebM audio file using OpenAI's Whisper API (via transcriptions.create).
    
    Parameters:
        webm_path (str): Path to the .webm audio file.
        
    Returns:
        str: The raw transcript including stutters, filler words, and hesitations.
    """

    client = OpenAI()
    try:
        with open(webm_path, "rb") as audio_file:
            # Custom prompt instructs the model to preserve the raw spoken elements.
            prompt = (
                "Transcribe the audio exactly as spoken. "
                "Preserve all raw speech elements including stutters (stuttered words such as 'T-t-t-the'), hesitations, filler words (e.g., 'um', 'uh', 'like'), "
                "pauses, and elongated words. Do not correct or normalize the spoken language."
            )

            
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                prompt=prompt,
                response_format="verbose_json"  # Returns a plain text transcript.
            )
        return transcription
    except Exception as e:
        print("Error during transcription:", str(e))
        return ""

if __name__ == "__main__":
    
    webm_file = './uploads/recording.webm'
    transcript = transcribe_webm_file(webm_file)
    
    print("Transcript:")
    print(transcript)
    # Extract the transcript text from the verbose JSON output.
    # transcript_text = transcript.text if transcript.text is not None else ""
    # output_file = "transcript.txt"

    # if transcript_text:
    #     with open(output_file, "w", encoding="utf-8") as f:
    #         f.write(transcript_text)
    #     print(f"Transcript written to {output_file}")
    # else:
    #     print("No transcript text produced.")