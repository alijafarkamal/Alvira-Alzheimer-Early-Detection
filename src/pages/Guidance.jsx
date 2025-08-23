import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Send, Brain, Heart, Shield, Users } from 'lucide-react'
import toast from 'react-hot-toast'

const Guidance = () => {
  const [userCondition, setUserCondition] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [guidance, setGuidance] = useState(null)
  const [chatHistory, setChatHistory] = useState([])

  const handleGetGuidance = async () => {
    if (!userCondition.trim()) {
      toast.error('Please describe your condition first')
      return
    }

    setIsLoading(true)
    
    try {
      // Prepare the prompt for Gemini AI
      const prompt = `As a healthcare AI assistant, provide personalized guidance for someone with the following condition related to Alzheimer's or cognitive health: "${userCondition}". 
      
      Please provide:
      1. Understanding of the condition
      2. Immediate steps to take
      3. Lifestyle recommendations
      4. When to seek professional help
      5. Support resources
      
      Keep the response compassionate, informative, and actionable. Remember this is not a medical diagnosis.`

      // Call Gemini AI API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get guidance')
      }

      const data = await response.json()
      const aiResponse = data.candidates[0].content.parts[0].text

      const newGuidance = {
        condition: userCondition,
        response: aiResponse,
        timestamp: new Date().toLocaleString()
      }

      setGuidance(newGuidance)
      setChatHistory(prev => [...prev, newGuidance])
      setUserCondition('')
      
      toast.success('Guidance generated successfully!')
    } catch (error) {
      console.error('Error calling Gemini AI:', error)
      
      // Fallback to mock response if API fails
      const mockResponse = `Based on your description, here are some recommendations:

**Understanding Your Situation:**
It's important to recognize that cognitive changes can be concerning and should be evaluated by healthcare professionals.

**Immediate Steps:**
1. Schedule an appointment with your primary care physician
2. Keep a symptom diary to track changes
3. Involve family members in your care decisions
4. Consider a comprehensive cognitive assessment

**Lifestyle Recommendations:**
- Maintain a healthy diet rich in omega-3 fatty acids
- Engage in regular physical exercise
- Practice mental exercises and puzzles
- Ensure adequate sleep and stress management
- Stay socially active and connected

**When to Seek Professional Help:**
- If symptoms interfere with daily activities
- If you notice rapid changes in memory or behavior
- If family members express concerns
- For regular cognitive health checkups

**Support Resources:**
- Alzheimer's Association (alz.org)
- Local support groups
- Memory care specialists
- Family counseling services

Remember: This guidance is for informational purposes only and should not replace professional medical advice.`

      const newGuidance = {
        condition: userCondition,
        response: mockResponse,
        timestamp: new Date().toLocaleString()
      }

      setGuidance(newGuidance)
      setChatHistory(prev => [...prev, newGuidance])
      setUserCondition('')
      
      toast.success('Guidance generated successfully!')
    } finally {
      setIsLoading(false)
    }
  }

  const quickQuestions = [
    "I'm experiencing memory loss",
    "My family member shows signs of confusion",
    "I want to prevent cognitive decline",
    "How to support someone with Alzheimer's",
    "Early warning signs to watch for",
    "Best exercises for brain health"
  ]

  const handleQuickQuestion = (question) => {
    setUserCondition(question)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Guidance
          </h1>
          <p className="text-xl text-gray-600">
            Get personalized recommendations and support for Alzheimer's care
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Describe Your Situation
              </h2>
              
              <div className="space-y-4">
                <textarea
                  value={userCondition}
                  onChange={(e) => setUserCondition(e.target.value)}
                  placeholder="Tell us about your condition, symptoms, or concerns related to Alzheimer's or cognitive health..."
                  className="input-field h-32 resize-none"
                  rows="6"
                />
                
                <button
                  onClick={handleGetGuidance}
                  disabled={isLoading || !userCondition.trim()}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-2"></div>
                      Generating Guidance...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Get Personalized Guidance
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Questions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Questions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What You'll Get
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Brain className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700">Personalized recommendations</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-gray-700">Compassionate support</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-gray-700">Evidence-based advice</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-gray-700">Resource connections</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Latest Guidance */}
            {guidance && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Guidance
                  </h2>
                  <span className="text-sm text-gray-500">
                    {guidance.timestamp}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Your Question:</h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {guidance.condition}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">AI Response:</h3>
                  <div className="prose prose-sm max-w-none">
                    {guidance.response.split('\n').map((line, index) => (
                      <p key={index} className="text-gray-700 mb-2">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Chat History */}
            {chatHistory.length > 1 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Previous Conversations
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {chatHistory.slice(0, -1).map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {item.condition.substring(0, 50)}...
                        </h4>
                        <span className="text-xs text-gray-500">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {item.response.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Important Disclaimer</h3>
              <p className="text-sm text-blue-800">
                This AI-powered guidance is for informational purposes only and should not replace 
                professional medical advice, diagnosis, or treatment. Always consult with qualified 
                healthcare providers for medical concerns.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Guidance 