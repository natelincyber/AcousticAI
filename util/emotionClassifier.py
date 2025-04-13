import json
from speechbrain.inference.diarization import Speech_Emotion_Diarization

class EmotionDiarizer:
    def __init__(self, device="cuda"):
        self.classifier = Speech_Emotion_Diarization.from_hparams(
            source="speechbrain/emotion-diarization-wavlm-large",
            run_opts={"device": device}
        )

    def analyze(self, file_path):
        diarization = self.classifier.diarize_file(file_path)
        # Convert result to JSON-friendly format
        results = diarization.get(file_path, [])
        return json.dumps(results, indent=2)

# Example usage:
if __name__ == "__main__":
    diarizer = EmotionDiarizer()
    result_json = diarizer.analyze("./uploads/recording.wav")
    print(result_json)
