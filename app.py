from flask import Flask, request, jsonify, send_from_directory
import os
import sys
import subprocess
import uuid
from flask_cors import CORS

try:
    import basicsr
except ImportError:
    import subprocess, sys
    subprocess.call([sys.executable, "-m", "pip", "install", "git+https://github.com/xinntao/BasicSR.git"])


app = Flask(__name__)
CORS(app)  # Allow cross-origin for frontend requests

UPLOAD_FOLDER = os.path.join('static', 'uploads')
RESULT_FOLDER = os.path.join('static', 'results')
REAL_ESRGAN_SCRIPT = os.path.join('Real-ESRGAN', 'inference_realesrgan.py')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

@app.route('/', methods=['POST'])
def enhance_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    input_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    result_filename = f"{os.path.splitext(unique_filename)[0]}_out.jpg"
    output_path = os.path.join(RESULT_FOLDER, result_filename)

    file.save(input_path)

    try:
        result = subprocess.run([
            sys.executable,
            REAL_ESRGAN_SCRIPT,
            '-i', input_path,
            '-o', RESULT_FOLDER,
            '--suffix', 'out',
            '--fp32',
            '--tile', '64'
        ], capture_output=True, text=True)

        if result.returncode != 0:
            print("[❌] ESRGAN Failed:\n", result.stderr)
            return jsonify({'error': 'Enhancement failed'}), 500

    except Exception as e:
        print("[❌] Subprocess Error:", str(e))
        return jsonify({'error': 'Server error'}), 500

    # Return the accessible path for the frontend
    return jsonify({'filename': f"/results/{result_filename}"})

@app.route('/results/<filename>')
def get_result(filename):
    return send_from_directory(RESULT_FOLDER, filename)

@app.route('/')
def home():
    return "Enhance-It API is running. Use POST to / to upload an image."

if __name__ == '__main__':
    app.run(debug=True)
