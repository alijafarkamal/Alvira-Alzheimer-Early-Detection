# Alvira — Alzheimer’s Early Detection (Multi‑Modal AI Platform)

A web-based, multi-modal AI prototype for **early Alzheimer’s risk screening** using three types of user input:

- **Audio (speech)** → WaveNet-style deep model (PyTorch) + acoustic feature fallback
- **Text (symptoms description)** → engineered clinical-style features → SVM classifier (scikit-learn)
- **Image (medical image upload)** → lightweight computer-vision feature extraction → SVM classifier (scikit-learn)

> Important: This project provides an **AI-powered risk assessment** and **must not be used as a medical diagnosis**. Always consult qualified healthcare professionals.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [How It Works (Pipeline)](#how-it-works-pipeline)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Quick Start (Run Locally)](#quick-start-run-locally)
  - [1) Frontend Setup](#1-frontend-setup)
  - [2) Backend Setup](#2-backend-setup)
  - [3) Start the App](#3-start-the-app)
- [API Documentation](#api-documentation)
  - [Health Check](#health-check)
  - [Prediction Endpoint](#prediction-endpoint)
  - [Request Examples](#request-examples)
- [Models & Artifacts](#models--artifacts)
- [Frontend UI Guide](#frontend-ui-guide)
- [Notes, Limitations, and Safety](#notes-limitations-and-safety)
- [License](#license)

---

## Project Overview

**Alvira** is an Alzheimer’s early detection platform built as a full-stack application:

- **Frontend (React + Vite)** provides a friendly UI to upload **image**, **audio**, or enter **text symptoms**.
- **Backend (Flask)** exposes an API endpoint that performs inference using pre-trained models and preprocessing artifacts included in the repository.

The system returns:
- **Risk level**: `Low` / `Medium` / `High`
- **Confidence** (percentage)
- **Recommendations** (actionable guidance)
- For audio: an additional predicted class label (Healthy / Alzheimer / Parkinson)

---

## Features

- Multi-tab UI for:
  - Image upload (JPG/PNG/GIF)
  - Audio upload (WAV/MP3/M4A/FLAC)
  - Symptom text input
- Real-time API-based inference (`POST /api/predict`)
- Built-in recommendation generation based on predicted risk
- Health endpoint to verify model loading (`GET /api/health`)

---

## How It Works (Pipeline)

High-level flow:

```
User Input  →  Feature Extraction  →  Model Inference  →  Risk Level + Confidence + Recommendations
```

### 1) Audio (Speech)
- Audio is decoded from Base64 and written temporarily as a `.wav` file.
- Resampled/loaded at **16 kHz** and padded/truncated to a fixed length.
- If `wn_model.pth` is available:
  - A WaveNet-style 1D CNN + attention classifier predicts:
    - `Healthy`, `Alzheimer`, or `Parkinson`
- If the audio model is unavailable or errors occur:
  - A rule-based fallback computes approximate acoustic measures (e.g., jitter/shimmer proxies, MFCC variance) and returns a best-effort result.

### 2) Text (Symptoms)
- The backend parses the symptom text to infer fields like:
  - Age (if mentioned)
  - Education (heuristic based on keywords)
  - MMSE/CDR (if present; otherwise defaults + symptom-based adjustments)
- These are converted into a structured feature vector (DataFrame) used by the SVM pipeline.

### 3) Image (Medical Image)
- The backend decodes the image (Base64), converts to grayscale if needed, then computes simple features:
  - intensity statistics, histogram bins, edges, texture variance
- The code then builds a clinical-style feature vector (with some default assumptions) and sends it through the same SVM pipeline.

---

## Tech Stack

### Frontend
- React 18, React Router
- Vite
- Tailwind CSS (with PostCSS + Autoprefixer)
- UI/UX:
  - `framer-motion` animations
  - `react-dropzone` for uploads
  - `react-hot-toast` notifications
  - `lucide-react` icons

### Backend
- Flask + Flask-CORS
- scikit-learn (SVM + preprocessing artifacts)
- PyTorch (audio model)
- librosa (audio loading)
- OpenSMILE (acoustic feature extraction support)
- OpenCV + Pillow (image processing)

---

## Repository Structure

Typical important files/folders in this repo:

- `README.md` — documentation
- `start.sh` — startup helper script
- `backend/`
  - `app.py` — Flask API (prediction + health)
  - `audio_processor.py` — audio model + processing pipeline
  - `requirements.txt` — Python dependencies
- `src/` — React source code
  - `pages/Prediction.jsx` — main prediction UI (image/audio/text)
  - `components/Navbar.jsx` — navigation
  - `pages/Home.jsx`, `pages/About.jsx`, `pages/Guidance.jsx`, `pages/Map.jsx` — additional UI pages
- Model artifacts (repo root):
  - `svm_alzheimer_model.pkl`
  - `scaler.pkl`
  - `pca.pkl`
  - `label_encoder.pkl`
  - `wn_model.pth`

---

## Quick Start (Run Locally)

### Prerequisites
- **Node.js** (recommended: 18+)
- **Python** (recommended: 3.9+)
- Optional but recommended:
  - A Python virtual environment (venv/conda)
  - System dependencies required by `opencv-python` / `opensmile` depending on your OS

### 1) Frontend Setup

From the repository root:

```bash
npm install
```

Run the frontend dev server:

```bash
npm run dev
```

Vite will show a local URL (commonly `http://localhost:5173`).

### 2) Backend Setup

Install Python dependencies:

```bash
cd backend
pip install -r requirements.txt
```

> Note: If you’re on a system-managed Python (some Linux distros), you might see the project using:
> `pip install -r requirements.txt --break-system-packages`
> Use that only if you understand the implications; virtualenv is safer.

Start the Flask backend:

```bash
python3 app.py
```

Backend runs on:

- `http://127.0.0.1:8000`

### 3) Start the App

The frontend expects the backend at:

- `http://localhost:8000/api/predict`

So ensure:
- Backend is running on port **8000**
- Frontend is running (Vite dev server)

---

## API Documentation

### Health Check

**GET** `/api/health`

Returns whether models were loaded successfully, for example:

- SVM model loaded
- scaler / PCA / label encoder loaded
- audio processor initialized

### Prediction Endpoint

**POST** `/api/predict`

**Request JSON**

```json
{
  "type": "image" | "audio" | "text",
  "data": "<base64-data-url OR plain text>"
}
```

- For **image**: `data` should be a Data URL string like `data:image/png;base64,...`
- For **audio**: `data` should be a Data URL string like `data:audio/wav;base64,...`
- For **text**: `data` is plain text (symptom description)

**Response (success)**

```json
{
  "success": true,
  "prediction": {
    "risk": "Low|Medium|High",
    "confidence": 82.5,
    "recommendations": ["..."],
    "model_used": "SVM Alzheimer Model|WaveNet Audio Model|Rule-based Audio Analysis",
    "input_type": "image|audio|text",
    "audio_prediction": "Healthy|Alzheimer|Parkinson"
  }
}
```

> `audio_prediction` is typically present for audio predictions.

### Request Examples

#### Text
```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"type":"text","data":"Age 72. Memory loss and confusion. Difficulty with daily tasks."}'
```

#### Image / Audio
For image/audio, the easiest way is to use the web UI (it automatically converts the file to Base64 Data URL).

---

## Models & Artifacts

This repository includes pre-trained artifacts:

- `svm_alzheimer_model.pkl` — SVM classifier used for **image** and **text** feature vectors
- `scaler.pkl` — feature scaling
- `pca.pkl` — PCA transformation
- `label_encoder.pkl` — maps class indices to labels (e.g., Nondemented/Converted/Demented)
- `wn_model.pth` — PyTorch audio classifier weights

---

## Frontend UI Guide

The prediction workflow is implemented in:

- `src/pages/Prediction.jsx`

The UI provides three tabs:
1. **Upload Image**
2. **Upload Audio**
3. **Enter Symptoms**

When the user clicks **Get Prediction**, the frontend calls:

- `POST http://localhost:8000/api/predict`

…and displays:
- Risk badge (Low/Medium/High)
- Confidence bar
- Recommendations
- (Audio only) predicted label: Healthy / Alzheimer / Parkinson

---

## Notes, Limitations, and Safety

- **Not a diagnostic tool**: This is a research/prototype-style implementation.
- **Image pipeline is heuristic**: The image feature extraction is lightweight and uses some default clinical assumptions; it is not a full medical-imaging diagnostic workflow.
- **Text parsing is heuristic**: Symptoms are converted into features using rules/regex and defaults.
- **Audio processing relies on environment support**:
  - `opensmile` and `opencv-python` may require additional system libraries depending on OS.
- **Privacy**: If you deploy this publicly, you must handle sensitive health data responsibly (consent, security, and compliance).

---

## License

MIT License
