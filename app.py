from flask import Flask, send_from_directory, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os
from moviepy.editor import AudioFileClip
from util.emotionClassifier import EmotionDiarizer
import json

app = Flask(__name__, static_folder="reactapp/dist", static_url_path="")
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


diarizer = EmotionDiarizer()

# ------------------ Wav Transcription ------------------

def extract_audio_with_moviepy(webm_path, wav_path):
    clip = AudioFileClip(webm_path)
    clip.write_audiofile(
        wav_path,
        fps=16000,
        nbytes=2,
        codec='pcm_s16le',
        ffmpeg_params=["-ac", "1"]
    )


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
    
    sid = request.args.get("sid")

    webm_path, wav_path = save_file(file, sid)

    socketio.start_background_task(run_emotion_analysis, wav_path=wav_path, sid=sid)



    return jsonify({
        "message": "File processed successfully!",
        "filename": file.filename
    }), 200

    

    

def save_file(file, sid):
    

    filename = file.filename
    webm_path = os.path.join(UPLOAD_FOLDER, filename)
    wav_path = os.path.join(UPLOAD_FOLDER, filename.rsplit('.', 1)[0] + '.wav')

    file.save(webm_path)

    try:
        extract_audio_with_moviepy(webm_path, wav_path)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    socketio.emit("upload_status", {
        "status": "uploaded",
        "filename": file.filename
    }, to=sid)
    
    return webm_path, wav_path


def run_emotion_analysis(wav_path, sid):
    try:
        results_json = diarizer.analyze(wav_path)
        print(results_json)
        socketio.emit("emotion_result", {
            "status": "completed",
            "results": json.loads(results_json),
        }, to=sid)
        
    except Exception as e:
        socketio.emit("emotion_result", {
            "status": "error",
            "error": str(e)
        }, to=sid)

if __name__ == '__main__':
    socketio.run(app, debug=True)


