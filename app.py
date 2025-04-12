from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import os
from moviepy.editor import AudioFileClip
from vosk import Model, KaldiRecognizer
import wave
import json
from transformers import T5Tokenizer, TFT5ForConditionalGeneration

app = Flask(__name__, static_folder="reactapp/dist", static_url_path="")
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

MODEL_PATH = "model"  # Vosk model path
if not os.path.exists(MODEL_PATH):
    raise RuntimeError("Vosk model not found in 'model/' directory. Please download and unzip it.")

# ------------------ Load T5 Model for Grammar and Punctuation Correction ------------------

print("Loading punctuation restoration model...")
tokenizer = T5Tokenizer.from_pretrained('SJ-Ray/Re-Punctuate')
model = TFT5ForConditionalGeneration.from_pretrained('SJ-Ray/Re-Punctuate')
print("Model loaded.")

# ------------------ Vosk Transcription ------------------

def extract_audio_with_moviepy(webm_path, wav_path):
    clip = AudioFileClip(webm_path)
    clip.write_audiofile(
        wav_path,
        fps=16000,
        nbytes=2,
        codec='pcm_s16le',
        ffmpeg_params=["-ac", "1"]
    )

def transcribe_with_vosk(wav_path, model_path=MODEL_PATH):
    wf = wave.open(wav_path, "rb")
    if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
        raise ValueError("Audio file must be WAV format mono PCM 16kHz.")

    model = Model(model_path)
    rec = KaldiRecognizer(model, wf.getframerate())

    results = []
    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            results.append(json.loads(rec.Result()))
    results.append(json.loads(rec.FinalResult()))

    return " ".join([r.get("text", "") for r in results])

# ------------------ Punctuation Restoration ------------------

def correct_grammar_and_punctuation(text):
    input_text = 'punctuate: ' + text.strip()
    inputs = tokenizer.encode(input_text, return_tensors="tf")
    result = model.generate(inputs)
    corrected_text = tokenizer.decode(result[0], skip_special_tokens=True)
    return corrected_text

# ------------------ Flask Routes ------------------

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    try:
        return send_from_directory(app.static_folder, path)
    except:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/upload', methods=['POST'])
def upload_and_transcribe():
    if 'audio' not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files['audio']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if not file.filename.endswith('.webm'):
        return jsonify({"error": "Only .webm files are allowed"}), 400

    filename = file.filename
    webm_path = os.path.join(UPLOAD_FOLDER, filename)
    wav_path = os.path.join(UPLOAD_FOLDER, filename.rsplit('.', 1)[0] + '.wav')

    file.save(webm_path)

    try:
        extract_audio_with_moviepy(webm_path, wav_path)
        raw_transcription = transcribe_with_vosk(wav_path)
        corrected_transcription = correct_grammar_and_punctuation(raw_transcription)
        print("[Transcription]:", raw_transcription)
        print("[Corrected]:", corrected_transcription)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({
        "message": "File uploaded and transcribed successfully",
        "filename": filename,
        "transcription": corrected_transcription
    }), 200

if __name__ == '__main__':
    app.run(debug=True)


