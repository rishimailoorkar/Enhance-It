# Enhance-It Web Application

A modern, responsive web application for AI-powered image enhancement using Real-ESRGAN technology.

## Project Structure

```
Enhance-It/
├── Real-ESRGAN/
│   └── inference_realesrgan.py
├── uploads/
├── results/
├── web-app/
│   ├── app.py
│   ├── templates/
│   │   └── index.html
│   └── static/
│       ├── logo.png
│       └── favicon.ico
```

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Drag & Drop Upload**: Intuitive file upload with drag and drop support
- **Image Preview**: Preview images before enhancement with options to change or remove
- **AI Enhancement**: Powered by Real-ESRGAN for professional-grade image upscaling
- **Download Results**: Easy download of enhanced images
- **Modern UI**: Beautiful glassmorphism design with smooth animations

## Installation

1. Clone the repository
2. Install Python dependencies:
   ```bash
   pip install flask werkzeug
   ```
3. Set up Real-ESRGAN in the parent directory
4. Create the required directories:
   ```bash
   mkdir -p uploads results
   ```
5. Run the Flask application:
   ```bash
   python app.py
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5000`
2. Upload an image using the drag & drop area or file browser
3. Preview your image and click "Enhance Image"
4. Wait for the AI processing to complete
5. Download your enhanced image

## Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript
- **AI Model**: Real-ESRGAN
- **Design**: Modern glassmorphism with responsive layout

## AI Research Lab

This project is proudly created under the AI Research Lab of QD&Co, advancing the future of artificial intelligence and computer vision technology.

## License

© Rishi Mailoorkar 2025 Enhance-It | Built by AI Research Lab, QD&Co
>>>>>>> 387bca8 (Removed submodule reference & added Real-ESRGAN as regular folder)
