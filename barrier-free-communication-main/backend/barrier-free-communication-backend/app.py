# Importing all required libraries
import os
import base64
import tempfile
from flask import Flask, request, jsonify, send_file
from flask_socketio import SocketIO
from flask_cors import CORS
import speech_recognition as sr
from deep_translator import GoogleTranslator
from youtube_transcript_api import YouTubeTranscriptApi
import cv2
import numpy as np

# Initializing Flask and WebSockets
app = Flask(__name__)
CORS(app)

# Enabling WebSockets
socketio = SocketIO(app, cors_allowed_origins="*")

# Creating a temp dir for storing audio
tempDir = "temp_audio"
# Adding flag for error handling in case the dir already exists
os.makedirs(tempDir, exist_ok=True)

# For transcription
# Initializing the recognizer - needed to convert audible words to text
recognizer = sr.Recognizer()

# Creating a function to process the audio file at the specified file path and returning the transcribed text
def audio_transcribe(filePath):
    try:
        # Opening the audio file
        with sr.AudioFile(filePath) as source:
            # Reads the audio file and converts it to an appropriate format for speech recognition
            audioData = recognizer.record(source)

            # Sends audio data to Google's speech-to-text API
            transcript = recognizer.recognize_google(audioData)
            # Returns the transcribed text
            return transcript

    # Error handling
    except sr.UnknownValueError:
        return "Unable to understand audio"
    
    # Google API down
    except sr.RequestError:
        return "Service unavailable"
    
    # Catch-all for other errors - returning the exact error message
    except Exception as e:
        return str(e)

# API route to allow the uploading of audio files
@app.route("/upload", methods=["POST"])  # POST as it supports file uploads
def audio_upload():
    try:
        # Extracting the file from the request and retrieving the uploaded file
        file = request.files["file"]

        # Ensuring only .wav files are allowed
        if not file.filename.endswith(".wav"):
            return jsonify({"error": "You must upload your audio file as a WAV file."}), 400
        
        # Creating a full file path as Flask needs an actual file path
        tempFilePath = os.path.join(tempDir, file.filename)
        
        # Saving the file before processing as speech-to-text transcription requires a file path
        file.save(tempFilePath)

        # Calling the transcription function to create a transcript
        transcript = audio_transcribe(tempFilePath)

        # Deleting the temp file
        os.remove(tempFilePath)

        # To ensure that the transcript is compatible with our JavaScript front end
        return jsonify({"text": transcript})
    
    # Error handling - returning the exact error message
    except Exception as e:
        return jsonify({"error": str(e)})

# Handling live audio as input
# Setting up the listener for an "audio chunk" event - triggered when live audio data is sent from the client
@socketio.on("audio chunk")
def audio_chunk_handling(data):
    try:
        # Decoding base64 string into binary audio data
        audioData = base64.b64decode(data)
        # A new temp file path is created to store audio temporarily
        tempFilePath = os.path.join(tempDir, "live_audio.wav")

        # Allows audio data to be saved in an appropriate format for transcription
        with open(tempFilePath, "wb") as tempFile:
            tempFile.write(audioData)

        # Calling the transcription function to create a transcript
        transcript = audio_transcribe(tempFilePath)

        # Transcribed text is emitted back to the client through the transcription event
        socketio.emit("transcription", {"text": transcript})

    # Error handling - returning the exact error message
    except Exception as e:
        socketio.emit("error", {"error": str(e)})


# API route to transcribe
@app.route("/transcribe", methods=["POST"]) 
def transcribe():
    if request.is_json:
        data = request.get_json()
        text = data.get('text')
        tar = data.get('target')

        print(tar)

        if(tar == 'English'):
            ttgt = 'en'
        elif(tar == 'Arabic'):
            ttgt = 'ar'
        elif(tar == 'Hindi'):
            ttgt= 'hi'
        else:
            ttgt = 'en'
    

        translator = GoogleTranslator(source='auto', target=ttgt)

        # Translate the text
        translated_text = translator.translate(text)

        # Print the translated text
        print(translated_text)

        return jsonify({
            'message': f"{translated_text}"
        }), 200  # Send back a successful response
    
    return jsonify({'error': 'Request must be JSON'}), 400

@app.route('/generate-captions', methods=['POST'])
def generate_captions():
    """
    Generates captions from a YouTube video given its URL.

    Returns:
        A JSON response containing the captions or an error message.
    """
    data = request.get_json()
    youtube_url = data.get('youtube_url')

    # Extract video ID from the URL
    if not youtube_url or 'v=' not in youtube_url:
      return jsonify({"error": "Invalid or missing YouTube URL"}), 400

    video_id = youtube_url.split('v=')[1]
    if '&' in video_id:
        video_id = video_id.split('&')[0]

    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400

    try:
        # Fetch transcript using youtube_transcript_api
        fetched_transcript = YouTubeTranscriptApi.get_transcript(video_id)

        captions = [snippet['text'] for snippet in fetched_transcript]
        # Join captions to make it easier for frontend rendering
        formatted_captions = '\n'.join(captions)

        return jsonify({"captions": formatted_captions}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to fetch captions: {str(e)}"}), 500

ASSETS_DIR = "C:/Users/siddo/Downloads/barrier-free-communication-main/barrier-free-communication-main/frontend/barrier-free-communication-frontend/assets"

@app.route('/merge-videos', methods=['POST'])
def merge_videos():
    try:
        data = request.get_json()
        video_names = data.get('video_names', [])
        
        if not video_names or not isinstance(video_names, list):
            return jsonify({"error": "Invalid or missing video names"}), 400

        video_paths = [os.path.join(ASSETS_DIR, name) for name in video_names]
        
        # Verify all videos exist
        for path in video_paths:
            if not os.path.exists(path):
                return jsonify({"error": f"Video not found: {path}"}), 404

        output_path = os.path.join(tempDir, "merged_video.mp4")
        
        # Get properties of first video
        first_video = cv2.VideoCapture(video_paths[0])
        frame_width = int(first_video.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(first_video.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = int(first_video.get(cv2.CAP_PROP_FPS))
        first_video.release()

        # Create video writer
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

        # Process each video
        for video_path in video_paths:
            cap = cv2.VideoCapture(video_path)
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                out.write(frame)
            cap.release()

        out.release()
        
        # Return the video file
        return send_file(
            output_path,
            mimetype='video/mp4',
            as_attachment=True,
            download_name='merged_video.mp4'
        )

    except Exception as e:
        return jsonify({"error": f"Failed to merge videos: {str(e)}"}), 500

# Main function to run the app
if __name__ == '__main__':
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)
