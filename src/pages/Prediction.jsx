import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Brain, AlertCircle, CheckCircle, XCircle, Mic, Volume2 } from 'lucide-react'
import toast from 'react-hot-toast'

const Prediction = () => {
  const [activeTab, setActiveTab] = useState('image')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [uploadedAudio, setUploadedAudio] = useState(null)
  const [symptoms, setSymptoms] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState(null)

  const onDropImage = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage({
          file: file,
          preview: reader.result
        })
      }
      reader.readAsDataURL(file)
      toast.success('Image uploaded successfully!')
    }
  }

  const onDropAudio = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedAudio({
          file: file,
          preview: reader.result
        })
      }
      reader.readAsDataURL(file)
      toast.success('Audio uploaded successfully!')
    }
  }

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({
    onDrop: onDropImage,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  })

  const { getRootProps: getAudioRootProps, getInputProps: getAudioInputProps, isDragActive: isAudioDragActive } = useDropzone({
    onDrop: onDropAudio,
    accept: {
      'audio/*': ['.wav', '.mp3', '.m4a', '.flac']
    },
    multiple: false
  })

  const handlePrediction = async () => {
    if (activeTab === 'image' && !uploadedImage) {
      toast.error('Please upload an image first')
      return
    }
    if (activeTab === 'audio' && !uploadedAudio) {
      toast.error('Please upload an audio file first')
      return
    }
    if (activeTab === 'text' && !symptoms.trim()) {
      toast.error('Please enter symptoms first')
      return
    }

    setIsLoading(true)
    
    try {
      let inputData, inputType
      
      if (activeTab === 'image') {
        inputData = uploadedImage.preview
        inputType = 'image'
      } else if (activeTab === 'audio') {
        inputData = uploadedAudio.preview
        inputType = 'audio'
      } else {
        inputData = symptoms
        inputType = 'text'
      }
      
      const response = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: inputType,
          data: inputData
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const result = await response.json()
      
      if (result.success) {
        setPrediction(result.prediction)
        toast.success('Prediction completed successfully!')
      } else {
        throw new Error(result.error || 'Prediction failed')
      }
    } catch (error) {
      console.error('Prediction error:', error)
      toast.error('API server not available. Please ensure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High':
        return 'text-red-600 bg-red-100'
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'Low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Alzheimer's Risk Prediction
          </h1>
          <p className="text-xl text-gray-600">
            Upload medical images, audio recordings, or describe symptoms for AI-powered risk assessment
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('image')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'image'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Image
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'audio'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mic className="w-4 h-4 inline mr-2" />
              Upload Audio
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'text'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Enter Symptoms
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {activeTab === 'image' && 'Upload Medical Image'}
              {activeTab === 'audio' && 'Upload Audio Recording'}
              {activeTab === 'text' && 'Describe Symptoms'}
            </h2>

            {activeTab === 'image' && (
              <div>
                <div
                  {...getImageRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                    isImageDragActive
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <input {...getImageInputProps()} />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  {isImageDragActive ? (
                    <p className="text-blue-600">Drop the image here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">
                        Drag & drop an image here, or click to select
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports: JPEG, PNG, GIF (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>

                {uploadedImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <div className="relative">
                      <img
                        src={uploadedImage.preview}
                        alt="Uploaded"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === 'audio' && (
              <div>
                <div
                  {...getAudioRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                    isAudioDragActive
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <input {...getAudioInputProps()} />
                  <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  {isAudioDragActive ? (
                    <p className="text-blue-600">Drop the audio file here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">
                        Drag & drop an audio file here, or click to select
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports: WAV, MP3, M4A, FLAC (Max 50MB)
                      </p>
                    </div>
                  )}
                </div>

                {uploadedAudio && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <div className="relative bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Volume2 className="w-8 h-8 text-blue-500 mr-3" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{uploadedAudio.file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(uploadedAudio.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => setUploadedAudio(null)}
                          className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                      <audio controls className="w-full mt-3">
                        <source src={uploadedAudio.preview} type={uploadedAudio.file.type} />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === 'text' && (
              <div>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe the symptoms you're experiencing... (e.g., memory loss, confusion, difficulty with daily tasks, mood changes, etc.)"
                  className="input-field h-48 resize-none"
                  rows="8"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Be as detailed as possible for better accuracy
                </p>
              </div>
            )}

            <button
              onClick={handlePrediction}
              disabled={isLoading || 
                (activeTab === 'image' && !uploadedImage) || 
                (activeTab === 'audio' && !uploadedAudio) || 
                (activeTab === 'text' && !symptoms.trim())}
              className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Get Prediction
                </div>
              )}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Prediction Results
            </h2>

            {prediction ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getRiskColor(prediction.risk)}`}>
                    {prediction.risk === 'High' && <AlertCircle className="w-4 h-4 mr-2" />}
                    {prediction.risk === 'Low' && <CheckCircle className="w-4 h-4 mr-2" />}
                    Risk Level: {prediction.risk}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Confidence Score</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{prediction.confidence}%</p>
                </div>

                {prediction.audio_prediction && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Audio Analysis Result</h3>
                    <p className="text-sm text-blue-800">
                      <strong>Prediction:</strong> {prediction.audio_prediction}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Important Note</h3>
                  <p className="text-sm text-blue-800">
                    This is an AI-powered assessment and should not replace professional medical diagnosis. 
                    Please consult with a healthcare provider for accurate diagnosis and treatment.
                  </p>
                </div>
                
                {prediction.model_used && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Model Information</h3>
                    <p className="text-sm text-gray-700">
                      <strong>Model Used:</strong> {prediction.model_used}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Input Type:</strong> {activeTab}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Upload an image, audio file, or enter symptoms to get your prediction results
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Prediction 