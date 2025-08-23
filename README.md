# Alvira - Alzheimer's Early Detection Platform

Multi-modal AI system for early Alzheimer's disease detection using speech patterns, medical images, and symptom analysis.

## Problem & Solution

**Problem**: Early Alzheimer's detection requires multiple diagnostic approaches and is often delayed due to limited access to specialized testing.

**Solution**: AI-powered platform that analyzes:
- **Speech patterns** via WaveNet neural network
- **Medical images** via computer vision
- **Symptom descriptions** via NLP

## Technology Stack

### Backend (Flask + AI)
- **WaveNet Model**: Speech pattern analysis for cognitive decline detection
- **SVM Model**: Symptom-based risk assessment
- **OpenSMILE**: Acoustic feature extraction (jitter, shimmer, MFCC)
- **OpenCV**: Medical image processing
- **PyTorch**: Deep learning inference

### Frontend (React + Vite)
- **Multi-modal Interface**: Image, audio, and text input
- **Real-time Analysis**: Instant AI predictions
- **Responsive Design**: Mobile-friendly interface

## Quick Start

```bash
# Install dependencies
npm install
cd backend && pip install -r requirements.txt --break-system-packages

# Start application
./start.sh
```

## API Endpoints

- `POST /api/predict` - Multi-modal prediction
  - `type`: "image" | "audio" | "text"
  - `data`: Base64 encoded file or text

## Models

- `wn_model.pth` - WaveNet for speech analysis
- `svm_alzheimer_model.pkl` - SVM for symptom analysis
- `scaler.pkl`, `pca.pkl`, `label_encoder.pkl` - Data preprocessing

## Architecture

```
Input → Feature Extraction → AI Models → Risk Assessment → Recommendations
  ↓           ↓              ↓            ↓               ↓
Image     OpenCV         SVM Model    Risk Level     Personalized
Audio     OpenSMILE      WaveNet      Confidence     Guidance
Text      NLP            NLP          Predictions    Actions
```

## Performance

- **Audio Analysis**: 3-class classification (Healthy/Alzheimer's/Parkinson's)
- **Image Analysis**: Medical image feature extraction
- **Text Analysis**: Symptom parsing and risk scoring
- **Response Time**: < 5 seconds for all modalities

## Deployment

```bash
# Backend
cd backend && python3 app.py

# Frontend
npm run build && npm run preview
```

## License

MIT License 