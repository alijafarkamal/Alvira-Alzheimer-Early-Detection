import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, MapPin, Lightbulb, Shield, Zap, Users } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Prediction',
      description: 'Advanced machine learning models to predict Alzheimer\'s risk based on medical data and symptoms.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MapPin,
      title: 'Find Nearby Clinics',
      description: 'Locate the nearest Alzheimer\'s specialists and healthcare facilities in your area.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Lightbulb,
      title: 'Personalized Guidance',
      description: 'Get AI-powered recommendations and guidance tailored to your specific condition.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your medical data is encrypted and protected with the highest security standards.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get predictions and insights within seconds using our optimized AI models.',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Connect with healthcare professionals and get expert medical advice.',
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Alvira
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI-powered Alzheimer's prediction and personalized guidance platform. 
              Get early detection, find nearby specialists, and receive expert recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/prediction"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                <Brain className="w-5 h-5 mr-2" />
                Start Prediction
              </Link>
              <Link
                to="/map"
                className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Find Clinics
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Alvira?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform combines cutting-edge AI technology with 
              healthcare expertise to provide the best possible care for Alzheimer's patients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Take the first step towards better health. Our AI-powered platform is here to help.
            </p>
            <Link
              to="/prediction"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg inline-flex items-center transition-colors duration-200"
            >
              <Brain className="w-5 h-5 mr-2" />
              Start Your Assessment
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home 