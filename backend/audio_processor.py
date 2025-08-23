import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import librosa
import opensmile
import os
from werkzeug.utils import secure_filename
import base64
import io

class WaveNetBlock(nn.Module):
    def __init__(self, n_filters, kernel_size, dilation):
        super(WaveNetBlock, self).__init__()
        self.tanh_conv = nn.Conv1d(n_filters, n_filters, kernel_size, dilation=dilation, padding='same')
        self.sigmoid_conv = nn.Conv1d(n_filters, n_filters, kernel_size, dilation=dilation, padding='same')
        self.skip_conv = nn.Conv1d(n_filters, n_filters, kernel_size=1)

    def forward(self, x):
        tanh_out = torch.tanh(self.tanh_conv(x))
        sigmoid_out = torch.sigmoid(self.sigmoid_conv(x))
        z = tanh_out * sigmoid_out
        skip = self.skip_conv(z)
        res = skip + x
        return res, skip

class ImprovedAttentionLayer(nn.Module):
    def __init__(self, n_filters):
        super(ImprovedAttentionLayer, self).__init__()
        self.attention = nn.Sequential(
            nn.Linear(n_filters, n_filters // 2),
            nn.ReLU(),
            nn.Linear(n_filters // 2, 1)
        )
    
    def forward(self, x):
        x_permuted = x.permute(0, 2, 1)
        attention_scores = self.attention(x_permuted)
        attention_weights = F.softmax(attention_scores, dim=1)
        weighted_sum = torch.bmm(attention_weights.transpose(1, 2), x_permuted)
        return weighted_sum.squeeze(1), attention_weights.squeeze(-1)

class ImprovedWaveNetClassifier(nn.Module):
    def __init__(self, input_shape, num_classes, num_features, kernel_size=2, dilation_depth=9, n_filters=64):
        super(ImprovedWaveNetClassifier, self).__init__()
        
        self.initial_conv = nn.Sequential(
            nn.Conv1d(1, n_filters, kernel_size=kernel_size, padding='same'),
            nn.BatchNorm1d(n_filters),
            nn.ReLU()
        )
        
        self.res_blocks = nn.ModuleList([
            WaveNetBlock(n_filters, kernel_size=kernel_size, dilation=2**i)
            for i in range(1, dilation_depth + 1)
        ])
        
        self.attention = ImprovedAttentionLayer(n_filters)
        
        self.classifier = nn.Sequential(
            nn.Linear(n_filters, n_filters),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(n_filters, n_filters // 2),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(n_filters // 2, num_classes)
        )
        
        self.feature_predictor = nn.Sequential(
            nn.Linear(n_filters, n_filters // 2),
            nn.ReLU(),
            nn.Linear(n_filters // 2, num_features)
        )

    def forward(self, x):
        x = x.unsqueeze(1)
        x = self.initial_conv(x)
        
        skip_connections = []
        for block in self.res_blocks:
            x, skip = block(x)
            skip_connections.append(skip)
        
        x = torch.stack(skip_connections).sum(0)
        x = F.relu(x)
        
        attended_features, attention_weights = self.attention(x)
        
        class_output = self.classifier(attended_features)
        feature_output = self.feature_predictor(attended_features)
        
        return class_output, feature_output, attention_weights

class AudioProcessor:
    def __init__(self):
        self.sr = 16000
        self.max_length = 96000
        self.smile = opensmile.Smile(
            feature_set=opensmile.FeatureSet.eGeMAPSv02,
            feature_level=opensmile.FeatureLevel.Functionals
        )
        self.label_map = {0: 'Healthy', 1: 'Alzheimer', 2: 'Parkinson'}
        self.model = None
        self.load_model()
    
    def load_model(self):
        try:
            model_path = '../wn_model.pth'
            if os.path.exists(model_path):
                input_shape = (self.max_length,)
                num_classes = 3
                num_features = 88
                
                self.model = ImprovedWaveNetClassifier(
                    input_shape=input_shape,
                    num_classes=num_classes,
                    num_features=num_features
                )
                
                self.model.load_state_dict(torch.load(model_path, map_location='cpu'))
                self.model.eval()
                print("✅ Audio model loaded successfully!")
            else:
                print("⚠️ Audio model file not found, using rule-based audio analysis")
        except Exception as e:
            print(f"❌ Error loading audio model: {e}")
    
    def process_audio_file(self, file_path):
        try:
            audio, sr = librosa.load(file_path, sr=self.sr)
            
            if len(audio) < self.max_length:
                audio = np.pad(audio, (0, self.max_length - len(audio)), mode='constant')
            else:
                audio = audio[:self.max_length]
            
            return audio
        except Exception as e:
            print(f"Error processing audio file: {e}")
            return None
    
    def extract_acoustic_features(self, file_path):
        try:
            features = self.smile.process_file(file_path).values.flatten()
            return features
        except Exception as e:
            print(f"Error extracting acoustic features: {e}")
            return None
    
    def analyze_audio(self, audio_data):
        try:
            if self.model is None:
                return self.rule_based_audio_analysis(audio_data)
            
            audio_tensor = torch.tensor(audio_data, dtype=torch.float32).unsqueeze(0)
            
            with torch.no_grad():
                class_output, feature_output, attention_weights = self.model(audio_tensor)
                probabilities = F.softmax(class_output, dim=1)
                predicted_class = torch.argmax(class_output, dim=1).item()
                confidence = probabilities[0][predicted_class].item() * 100
                predicted_label = self.label_map[predicted_class]
            
            return {
                'prediction': predicted_label,
                'confidence': confidence,
                'probabilities': probabilities[0].tolist(),
                'model_used': 'WaveNet Audio Model'
            }
        except Exception as e:
            print(f"Error in audio analysis: {e}")
            return self.rule_based_audio_analysis(audio_data)
    
    def rule_based_audio_analysis(self, audio_data):
        try:
            features = self.extract_acoustic_features_from_array(audio_data)
            
            if features is None:
                return {
                    'prediction': 'Healthy',
                    'confidence': 50.0,
                    'probabilities': [0.5, 0.3, 0.2],
                    'model_used': 'Rule-based Audio Analysis'
                }
            
            risk_score = 0
            
            if features.get('jitter', 0) > 0.05:
                risk_score += 20
            if features.get('shimmer', 0) > 0.1:
                risk_score += 20
            if features.get('hnr', 0) < 10:
                risk_score += 20
            if features.get('mfcc_variance', 0) > 2.0:
                risk_score += 20
            
            if risk_score >= 60:
                prediction = 'Alzheimer'
                confidence = min(85, risk_score)
            elif risk_score >= 30:
                prediction = 'Parkinson'
                confidence = min(75, risk_score)
            else:
                prediction = 'Healthy'
                confidence = max(60, 100 - risk_score)
            
            return {
                'prediction': prediction,
                'confidence': confidence,
                'probabilities': [0.3, 0.4, 0.3] if prediction == 'Alzheimer' else [0.4, 0.3, 0.3],
                'model_used': 'Rule-based Audio Analysis'
            }
        except Exception as e:
            print(f"Error in rule-based analysis: {e}")
            return {
                'prediction': 'Healthy',
                'confidence': 50.0,
                'probabilities': [0.5, 0.3, 0.2],
                'model_used': 'Rule-based Audio Analysis'
            }
    
    def extract_acoustic_features_from_array(self, audio_data):
        try:
            jitter = np.std(np.diff(audio_data))
            shimmer = np.std(audio_data) / np.mean(np.abs(audio_data))
            
            mfccs = librosa.feature.mfcc(y=audio_data, sr=self.sr, n_mfcc=13)
            mfcc_variance = np.var(mfccs)
            
            spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=audio_data, sr=self.sr))
            
            return {
                'jitter': jitter,
                'shimmer': shimmer,
                'mfcc_variance': mfcc_variance,
                'spectral_centroid': spectral_centroid,
                'hnr': 15.0
            }
        except Exception as e:
            print(f"Error extracting features from array: {e}")
            return None
    
    def process_base64_audio(self, base64_data):
        try:
            if ',' in base64_data:
                base64_data = base64_data.split(',')[1]
            
            audio_bytes = base64.b64decode(base64_data)
            
            temp_path = '/tmp/temp_audio.wav'
            with open(temp_path, 'wb') as f:
                f.write(audio_bytes)
            
            audio_data = self.process_audio_file(temp_path)
            os.remove(temp_path)
            
            return audio_data
        except Exception as e:
            print(f"Error processing base64 audio: {e}")
            return None 