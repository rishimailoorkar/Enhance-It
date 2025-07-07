import React, { useState, useRef } from 'react';
import { Cpu, Upload, Loader2, Sparkles, Github, Mail, Globe, Zap, Shield, RefreshCw, X  } from "lucide-react";

interface UploadedImage {
  file: File;
  preview: string;
}

type AppState = 'upload' | 'preview' | 'enhancing' | 'result';

function App() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>('upload');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImage({
            file,
            preview: e.target.result as string
          });
          setAppState('preview');
          setEnhancedImage(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleEnhance = async () => {
    if (!uploadedImage) return;
    setAppState('enhancing');

    const formData = new FormData();
    formData.append('file', uploadedImage.file);

    try {
      const response = await fetch('http://127.0.0.1:5000/', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        const filename = result.filename;
        const imageURL = `http://127.0.0.1:5000${result.filename}`;
        setEnhancedImage(imageURL);
        setAppState('result');
      } else {
        throw new Error('Enhancement failed');
      }
    } catch (error) {
      console.error('[❌] Enhancement Error:', error);
      alert('Something went wrong during enhancement.');
      setAppState('preview');
    }
  };

  const handleDownload = () => {
    if (enhancedImage) {
      const link = document.createElement('a');
      link.href = enhancedImage;
      link.download = `enhanced_${uploadedImage?.file.name || 'image.jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleStartOver = () => {
    setUploadedImage(null);
    setEnhancedImage(null);
    setAppState('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="backdrop-blur-md bg-white/80 border-b border-white/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <img
                  src="/static/logo.png"
                  alt="Enhance-It Logo"
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Sparkles className="w-7 h-7 text-white hidden" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Enhance-It
                </h1>
                <p className="text-sm text-gray-600">Ai-Powered Image Enhancer</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <Cpu className="w-4 h-4" />
              <span>Powered by Real-ESRGAN</span>
            </div>
          </div>
        </div>
      </header>
      
       {/* Hero Section */}
  <div className="text-center mt-16 mb-16">
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
      Transform Your Images with AI
    </h2>
    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
      Upload any low-resolution image and Let our AI enhance it to stunning 4K quality.
      Smart AI enhancement for sharper, cleaner, and more detailed visuals.

      <p className="text-sm text-gray-500 mt-5">  
   Note: Large images (e.g., 1000×1000 px) may take a few seconds. <br/>Please wait patiently while the AI works its magic ✨
</p>

    </p>
  </div>

      {/* Upload or Preview */}
      <main className="max-w-3xl mx-auto mt-12 mb-24 px-4 text-center">
        {appState === 'upload' || appState === 'preview' ? (
          <>
            <div
              className={`border-4 border-dashed rounded-lg p-10 cursor-pointer transition-all ${
                isDragOver ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-500" />
              <p className="text-gray-600 mt-4">
                Drag & drop an image here, or <span className="text-blue-600 underline">click to upload</span>
              </p>
              <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileInputChange} />
            </div>

            {uploadedImage && (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mt-8">Preview:</h3>
                <img
                  src={uploadedImage.preview}
                  alt="Preview"
                  className="rounded-lg shadow-lg mt-4 mx-auto max-w-full h-auto"
                />
                <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
  {/* Change Image */}
  <button
    onClick={() => fileInputRef.current?.click()}
    className="flex items-center justify-center px-6 py-2 bg-gray-100 text-gray-800 font-medium rounded-xl shadow hover:bg-gray-200 transition"
  >
    <RefreshCw className="w-4 h-4 mr-2" />
    Change Image
  </button>

  {/* Enhance Image */}
  <button
    onClick={handleEnhance}
    className="flex items-center justify-center px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-xl shadow hover:brightness-110 transition"
  >
    <Zap className="w-4 h-4 mr-2" />
    Enhance Image
  </button>

  {/* Remove All */}
  <button
    onClick={handleStartOver}
    className="flex items-center justify-center px-6 py-2 bg-red-100 text-red-600 font-medium rounded-xl shadow hover:bg-red-200 transition"
  >
    <X className="w-4 h-4 mr-2" />
    Remove All
  </button>
</div>

              </>
            )}
          </>
        ) : appState === 'enhancing' ? (
          <div className="text-center mt-20">
            <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mx-auto" />
            <p className="mt-4 text-gray-700 text-lg">Enhancing your image...</p>
          </div>
        ) : null}

        {/* Result */}
        {enhancedImage && appState === 'result' && (
          <div className="mt-12 text-center mb-24">
            <h3 className="text-xl font-semibold text-gray-800">Enhanced Image:</h3>
            <img
              src={enhancedImage}
              alt="Enhanced Output"
              className="rounded-lg shadow-lg mt-4 mx-auto max-w-full h-auto"
            />
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleDownload}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
              >
                Download
              </button>
              <button
                onClick={handleStartOver}
                className="px-6 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-400 transition"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </main>

            {/* AI Research Lab Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Developed by AI Research Lab</h3>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              This project is proudly created under the AI Research Lab of QD&Co by Rishi Mailoorkar, 
              Focusing on the Ai Product Research and Development of tools that helps creators of tommorow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Advanced AI Models</h4>
              <p className="text-blue-100">Utilizing state-of-the-art Real-ESRGAN technology</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Secure Processing</h4>
              <p className="text-blue-100">Your images are processed securely and privately</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Optimized Enhancement</h4>
              <p className="text-blue-100">Engineered to enhance intelligently focusing on details or textures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">Enhance-It</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Built by <a href="https://in.linkedin.com/in/rishi-mailoorkar">Rishi Mailoorkar</a>, a Product Designer exploring AI through hands-on development.
                restoring lost details, sharpening textures, and bringing clarity to every pixel.
              </p>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4">
                <p className="text-sm font-medium">
                  🔬 Part of the AI Product Research Lab under QD&Co.,
                </p>
                <p className="text-xs text-blue-200 mt-1">
                  Advancing the future of artificial intelligence
                </p>
              </div>
            </div>

            {/* Technology */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Technology</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Real-ESRGAN AI Model</li>
                <li>Super Resolution</li>
                <li>Image Enhancement</li>
                <li>Deep Learning</li>
                <li>Computer Vision</li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://rishimailoorkar-enhanceit-documentation.tiiny.site" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="https://www.pdfhost.net/index.php?Action=Download&File=2f7ef336c13ee2f7dc55abd8a59ecf16" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="https://github.com/xinntao/Real-ESRGAN" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="tel:+91 8310341267" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="mailto:mailoorkarrishi@gmail.com" className="hover:text-white transition-colors">Report Issues</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
                <p>© 2025 Enhance-It | Built by <a href="https://in.linkedin.com/in/rishi-mailoorkar" className="hover:text-white transition-colors"><b>Rishi Mailoorkar</b></a> | Under The Research Lab of <a href="https://qdnco.com/digital_studio/index.html"><b>QD&Co.</b></a></p>
                
              </div>
              
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <a href="https://github.com/rishimailoorkar" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="mailto:mailoorkarrishi@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="https://www.qdnco.com" className="text-gray-400 hover:text-white transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
