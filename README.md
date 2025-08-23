# Alvira - Alzheimer's Prediction & Guidance Platform

A comprehensive AI-powered web application for Alzheimer's disease prediction using multiple modalities: medical images, audio recordings, and symptom descriptions.

## 🌟 Features

- **Multi-Modal AI Prediction**: 
  - Upload medical images for visual analysis
  - Upload audio recordings for speech pattern analysis
  - Describe symptoms for text-based assessment
- **Advanced Audio Analysis**: WaveNet-based neural network for speech pattern detection
- **SVM Model Integration**: Machine learning model for symptom-based prediction
- **Personalized Guidance**: Get AI-generated recommendations
- **Clinic Finder**: Locate nearby Alzheimer's specialists and healthcare facilities
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Privacy First**: Secure handling of medical data

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Python 3.8+
- Google Maps API key
- Gemini AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NeuraViaHacks
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install flask flask-cors numpy pandas scikit-learn opencv-python Pillow werkzeug torch torchaudio librosa opensmile joblib requests --break-system-packages
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

5. **Start the backend server**
   ```bash
   cd backend
   python3 app.py
   ```

6. **Start the frontend development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Dropzone** for file uploads
- **React Hot Toast** for notifications

### Backend
- **Flask** web framework
- **PyTorch** for deep learning models
- **WaveNet** neural network for audio analysis
- **SVM** model for symptom-based prediction
- **OpenSMILE** for audio feature extraction
- **Librosa** for audio processing
- **OpenCV** for image processing
- **Scikit-learn** for machine learning

### AI Models
- **WaveNet Audio Model** (`wn_model.pth`) - Speech pattern analysis
- **SVM Alzheimer Model** (`svm_alzheimer_model.pkl`) - Symptom-based prediction
- **Data Preprocessing Models** (`scaler.pkl`, `pca.pkl`, `label_encoder.pkl`)

## 📁 Project Structure

```
NeuraViaHacks/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── audio_processor.py     # Audio processing module
│   └── requirements.txt       # Python dependencies
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Prediction.jsx     # Multi-modal prediction interface
│   │   ├── Map.jsx
│   │   ├── Guidance.jsx
│   │   └── About.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── ML Models/
│   ├── wn_model.pth           # WaveNet audio model
│   ├── svm_alzheimer_model.pkl
│   ├── scaler.pkl
│   ├── pca.pkl
│   └── label_encoder.pkl
├── Audio Samples/
│   ├── adrso031.wav           # Test audio file
│   └── explanation.wav        # Test audio file
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎯 Key Features Explained

### 1. Multi-Modal Prediction Page
- **Image Upload**: Drag & drop medical images for visual analysis
- **Audio Upload**: Upload WAV, MP3, M4A, FLAC files for speech pattern analysis
- **Text Input**: Describe symptoms for comprehensive assessment
- **Real-time Results**: Instant AI-powered predictions with confidence scores

### 2. Audio Analysis
- **WaveNet Model**: Advanced neural network for speech pattern detection
- **OpenSMILE Features**: Acoustic feature extraction (jitter, shimmer, MFCC)
- **Multi-class Classification**: Healthy, Alzheimer's, Parkinson's detection
- **Fallback Analysis**: Rule-based analysis when model is unavailable

### 3. Image Analysis
- **Feature Extraction**: Edge detection, texture analysis, intensity statistics
- **Medical Image Processing**: Optimized for brain scans and medical images
- **SVM Integration**: Machine learning-based prediction

### 4. Text Analysis
- **Symptom Parsing**: Intelligent extraction of age, symptoms, severity
- **Natural Language Processing**: Keyword-based risk assessment
- **Comprehensive Scoring**: MMSE and CDR score estimation

### 5. Map Page
- **Location Search**: Find clinics by city, state, or ZIP code
- **Interactive Map**: Google Maps integration with custom markers
- **Clinic Details**: Contact information, ratings, and specialties

### 6. Guidance Page
- **AI Chat**: Personalized recommendations using Gemini AI
- **Quick Questions**: Pre-defined common concerns
- **Chat History**: Track previous conversations

## 🔧 Configuration

### API Keys Setup

1. **Gemini AI API**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add to `.env` file

2. **Google Maps API**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Maps JavaScript API and Places API
   - Create API key with appropriate restrictions
   - Add to `.env` file

### Model Configuration

The application uses pre-trained models:
- **Audio Model**: `wn_model.pth` - WaveNet neural network
- **SVM Model**: `svm_alzheimer_model.pkl` - Support Vector Machine
- **Preprocessing**: `scaler.pkl`, `pca.pkl`, `label_encoder.pkl`

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
python3 app.py
```

### Frontend Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 🔒 Security & Privacy

- All API calls are made client-side with proper error handling
- No sensitive data is stored locally
- Environment variables protect API keys
- HTTPS required for production deployment
- Audio and image data processed securely

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: support@alvira.com
- **Documentation**: [docs.alvira.com](https://docs.alvira.com)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- Google Gemini AI for intelligent guidance
- Google Maps for location services
- PyTorch team for deep learning framework
- OpenSMILE for audio feature extraction
- Medical professionals for domain expertise
- Open source community for amazing tools

---

**Disclaimer**: This application is for educational and informational purposes only. It should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns. 