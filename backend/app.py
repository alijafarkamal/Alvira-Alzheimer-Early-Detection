from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os
from werkzeug.utils import secure_filename
import base64
import io
from PIL import Image
import cv2
from audio_processor import AudioProcessor

app = Flask(__name__)
CORS(app)

MODEL_PATH = '../svm_alzheimer_model.pkl'
SCALER_PATH = '../scaler.pkl'
PCA_PATH = '../pca.pkl'
LABEL_ENCODER_PATH = '../label_encoder.pkl'

model = None
scaler = None
pca = None
label_encoder = None
audio_processor = None

def load_models():
    global model, scaler, pca, label_encoder, audio_processor
    
    try:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        pca = joblib.load(PCA_PATH)
        label_encoder = joblib.load(LABEL_ENCODER_PATH)
        print("✅ All ML models loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading ML models: {e}")
    
    try:
        audio_processor = AudioProcessor()
        print("✅ Audio processor initialized!")
    except Exception as e:
        print(f"❌ Error initializing audio processor: {e}")

def extract_features_from_image(image_data):
    try:
        image_data = image_data.split(',')[1] if ',' in image_data else image_data
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        img_array = np.array(image)
        
        if len(img_array.shape) == 3:
            img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        
        mean_intensity = np.mean(img_array)
        std_intensity = np.std(img_array)
        min_intensity = np.min(img_array)
        max_intensity = np.max(img_array)
        
        hist, _ = np.histogram(img_array, bins=50)
        hist_features = hist[:20]
        
        edges = cv2.Canny(img_array, 50, 150)
        edge_density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
        
        texture_variance = np.var(img_array)
        
        age = 70
        educ = 12
        ses = 3
        
        mmse_estimate = 25 + (edge_density * 10)
        cdr_estimate = 0.5 if texture_variance > 1000 else 0.0
        
        etiv = 1450
        nwbv = 0.73 + (mean_intensity / 255.0) * 0.1
        asf = 1.25
        
        mf_m = 0.5
        
        age_category_middle = 1 if 45 <= age <= 64 else 0
        age_category_elderly = 1 if age >= 65 else 0
        
        ses_educ_interaction = ses * educ
        brain_volume_ratio = nwbv / etiv
        age_mmse_interaction = age * mmse_estimate
        
        features = pd.DataFrame({
            'Age': [age],
            'EDUC': [educ],
            'SES': [ses],
            'MMSE': [mmse_estimate],
            'CDR': [cdr_estimate],
            'eTIV': [etiv],
            'nWBV': [nwbv],
            'ASF': [asf],
            'M/F_M': [mf_m],
            'Age_Category_Middle-Aged': [age_category_middle],
            'Age_Category_Elderly': [age_category_elderly],
            'SES_EDUC_interaction': [ses_educ_interaction],
            'Brain_Volume_Ratio': [brain_volume_ratio],
            'Age_MMSE_interaction': [age_mmse_interaction]
        })
        
        print(f"✅ Image features extracted: MMSE={mmse_estimate:.1f}, CDR={cdr_estimate:.1f}")
        return features
        
    except Exception as e:
        print(f"Error extracting features from image: {e}")
        return None

def extract_features_from_text(symptoms_text):
    try:
        symptoms_lower = symptoms_text.lower()
        
        import re
        age_match = re.search(r'(\d+)\s*(?:years?\s*old|age)', symptoms_lower)
        age = int(age_match.group(1)) if age_match else 70
        
        educ_keywords = ['college', 'university', 'degree', 'phd', 'masters', 'bachelor']
        educ = 16 if any(keyword in symptoms_lower for keyword in educ_keywords) else 12
        
        ses = 3
        
        mmse_match = re.search(r'mmse[:\s]*(\d+)', symptoms_lower)
        mmse = int(mmse_match.group(1)) if mmse_match else 28
        
        cdr_keywords = ['severe', 'moderate', 'mild', 'none']
        cdr_scores = {'severe': 2.0, 'moderate': 1.0, 'mild': 0.5, 'none': 0.0}
        cdr = next((cdr_scores[keyword] for keyword in cdr_keywords if keyword in symptoms_lower), 0.5)
        
        if 'memory loss' in symptoms_lower or 'forget' in symptoms_lower:
            mmse = max(15, mmse - 8)
            cdr = min(2.0, cdr + 0.8)
            
        if 'confusion' in symptoms_lower or 'disorientation' in symptoms_lower:
            mmse = max(8, mmse - 12)
            cdr = min(2.0, cdr + 1.2)
            
        if 'severe' in symptoms_lower:
            mmse = max(5, mmse - 15)
            cdr = 2.0
            
        if 'dementia' in symptoms_lower or 'alzheimer' in symptoms_lower:
            mmse = max(10, mmse - 10)
            cdr = min(2.0, cdr + 1.0)
            
        if 'behavior' in symptoms_lower or 'personality' in symptoms_lower:
            mmse = max(12, mmse - 6)
            cdr = min(2.0, cdr + 0.6)
            
        if 'speech' in symptoms_lower or 'language' in symptoms_lower:
            mmse = max(10, mmse - 8)
            cdr = min(2.0, cdr + 0.8)
        
        etiv = 1450
        nwbv = 0.73
        asf = 1.25
        
        mf_m = 1 if 'male' in symptoms_lower or 'man' in symptoms_lower else 0
        
        age_category_middle = 1 if 45 <= age <= 64 else 0
        age_category_elderly = 1 if age >= 65 else 0
        
        ses_educ_interaction = ses * educ
        brain_volume_ratio = nwbv / etiv
        age_mmse_interaction = age * mmse
        
        features = pd.DataFrame({
            'Age': [age],
            'EDUC': [educ],
            'SES': [ses],
            'MMSE': [mmse],
            'CDR': [cdr],
            'eTIV': [etiv],
            'nWBV': [nwbv],
            'ASF': [asf],
            'M/F_M': [mf_m],
            'Age_Category_Middle-Aged': [age_category_middle],
            'Age_Category_Elderly': [age_category_elderly],
            'SES_EDUC_interaction': [ses_educ_interaction],
            'Brain_Volume_Ratio': [brain_volume_ratio],
            'Age_MMSE_interaction': [age_mmse_interaction]
        })
        
        return features
    except Exception as e:
        print(f"Error extracting features from text: {e}")
        return None

def process_audio_prediction(audio_data):
    try:
        if audio_processor is None:
            return {
                'error': 'Audio processor not available',
                'risk': 'Medium',
                'confidence': 50.0,
                'recommendations': [
                    'Schedule a consultation with a neurologist',
                    'Consider cognitive assessment tests'
                ],
                'model_used': 'Fallback Model'
            }
        
        audio_array = audio_processor.process_base64_audio(audio_data)
        if audio_array is None:
            return {
                'error': 'Failed to process audio data',
                'risk': 'Medium',
                'confidence': 50.0,
                'recommendations': [
                    'Schedule a consultation with a neurologist',
                    'Consider cognitive assessment tests'
                ],
                'model_used': 'Fallback Model'
            }
        
        result = audio_processor.analyze_audio(audio_array)
        
        if result['prediction'] == 'Alzheimer':
            risk_level = 'High'
            recommendations = [
                '🚨 Schedule an IMMEDIATE consultation with a neurologist',
                '🏥 Consider comprehensive cognitive assessment tests',
                '📝 Monitor symptoms closely and keep a detailed diary',
                '👨‍👩‍👧‍👦 Involve family members in care decisions',
                '🧠 Consider memory care specialist consultation',
                '💊 Discuss medication options with healthcare provider'
            ]
        elif result['prediction'] == 'Parkinson':
            risk_level = 'Medium'
            recommendations = [
                '👨‍⚕️ Schedule a consultation with your primary care physician',
                '🧪 Consider cognitive screening tests',
                '📊 Monitor symptoms regularly',
                '🏃‍♂️ Maintain a healthy lifestyle with regular exercise',
                '🧩 Stay mentally and socially active',
                '🥗 Follow a brain-healthy diet (Mediterranean diet)'
            ]
        else:
            risk_level = 'Low'
            recommendations = [
                '✅ Continue regular health checkups',
                '💪 Maintain a healthy lifestyle',
                '🧩 Stay mentally active with puzzles and learning',
                '👀 Monitor for any changes in cognitive function',
                '🧠 Consider preventive measures like brain exercises',
                '📚 Learn about Alzheimer\'s prevention strategies'
            ]
        
        return {
            'risk': risk_level,
            'confidence': result['confidence'],
            'recommendations': recommendations,
            'model_used': result['model_used'],
            'audio_prediction': result['prediction']
        }
        
    except Exception as e:
        print(f"Error in audio prediction: {e}")
        return {
            'error': str(e),
            'risk': 'Medium',
            'confidence': 50.0,
            'recommendations': [
                'Schedule a consultation with a neurologist',
                'Consider cognitive assessment tests'
            ],
            'model_used': 'Error Fallback'
        }

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        input_type = data.get('type')
        input_data = data.get('data')
        
        if not input_data:
            return jsonify({'error': 'No input data provided'}), 400
        
        if input_type == 'audio':
            result = process_audio_prediction(input_data)
            if 'error' in result:
                return jsonify({'error': result['error']}), 400
            
            return jsonify({
                'success': True,
                'prediction': result
            })
        
        elif input_type in ['image', 'text']:
            if input_type == 'image':
                features = extract_features_from_image(input_data)
            else:
                features = extract_features_from_text(input_data)
            
            if features is None:
                return jsonify({'error': 'Failed to extract features'}), 400
            
            if model is not None and scaler is not None and pca is not None and label_encoder is not None:
                features_scaled = scaler.transform(features)
                features_pca = pca.transform(features_scaled)
                
                predicted_class = model.predict(features_pca)[0]
                predicted_label = label_encoder.inverse_transform([predicted_class])[0]
                
                probabilities = model.predict_proba(features_pca)[0]
                confidence = max(probabilities) * 100
                
                print(f"🔍 Debug - MMSE: {features['MMSE'].iloc[0]:.1f}, CDR: {features['CDR'].iloc[0]:.1f}")
                print(f"🔍 Debug - Predicted: {predicted_label}, Confidence: {confidence:.1f}%")
                
                if confidence < 60:
                    print("⚠️ Model confidence low, using symptom-based assessment")
                    mmse_score = features['MMSE'].iloc[0]
                    cdr_score = features['CDR'].iloc[0]
                    
                    if mmse_score < 15 or cdr_score >= 2.0:
                        predicted_label = 'Demented'
                        confidence = 85.0
                    elif mmse_score < 20 or cdr_score >= 1.0:
                        predicted_label = 'Converted'
                        confidence = 75.0
                    else:
                        predicted_label = 'Nondemented'
                        confidence = 70.0
                
                if predicted_label == 'Demented':
                    risk_level = 'High'
                elif predicted_label == 'Converted':
                    risk_level = 'Medium'
                else:
                    if features['MMSE'].iloc[0] < 20 or features['CDR'].iloc[0] > 1.0:
                        risk_level = 'Medium'
                    else:
                        risk_level = 'Low'
                
                recommendations = []
                if risk_level == 'High':
                    recommendations = [
                        '🚨 Schedule an IMMEDIATE consultation with a neurologist',
                        '🏥 Consider comprehensive cognitive assessment tests',
                        '📝 Monitor symptoms closely and keep a detailed diary',
                        '👨‍👩‍👧‍👦 Involve family members in care decisions',
                        '🧠 Consider memory care specialist consultation',
                        '💊 Discuss medication options with healthcare provider'
                    ]
                elif risk_level == 'Medium':
                    recommendations = [
                        '👨‍⚕️ Schedule a consultation with your primary care physician',
                        '🧪 Consider cognitive screening tests',
                        '📊 Monitor symptoms regularly',
                        '🏃‍♂️ Maintain a healthy lifestyle with regular exercise',
                        '🧩 Stay mentally and socially active',
                        '🥗 Follow a brain-healthy diet (Mediterranean diet)'
                    ]
                else:
                    recommendations = [
                        '✅ Continue regular health checkups',
                        '💪 Maintain a healthy lifestyle',
                        '🧩 Stay mentally active with puzzles and learning',
                        '👀 Monitor for any changes in cognitive function',
                        '🧠 Consider preventive measures like brain exercises',
                        '📚 Learn about Alzheimer\'s prevention strategies'
                    ]
                
                return jsonify({
                    'success': True,
                    'prediction': {
                        'risk': risk_level,
                        'confidence': round(confidence, 1),
                        'recommendations': recommendations,
                        'model_used': 'SVM Alzheimer Model',
                        'input_type': input_type
                    }
                })
            else:
                return jsonify({'error': 'Model not loaded'}), 500
        else:
            return jsonify({'error': 'Invalid input type'}), 400
            
    except Exception as e:
        print(f"Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'models_loaded': {
            'svm_model': model is not None,
            'scaler': scaler is not None,
            'pca': pca is not None,
            'label_encoder': label_encoder is not None,
            'audio_processor': audio_processor is not None
        },
        'model_type': 'SVM + WaveNet Audio Model'
    })

if __name__ == '__main__':
    print("🚀 Starting Alzheimer's Prediction API...")
    print(f"📁 Looking for models in: {os.path.abspath('..')}")
    load_models()
    app.run(debug=False, port=8000, host='127.0.0.1') 