import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Shield, Users, Zap, Heart, Award } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Technology',
      description: 'State-of-the-art machine learning models trained on extensive medical data for accurate predictions.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your medical data is encrypted and protected with enterprise-grade security measures.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Users,
      title: 'Expert Collaboration',
      description: 'Developed in collaboration with leading neurologists and healthcare professionals.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Real-time Analysis',
      description: 'Instant results and recommendations powered by cutting-edge AI algorithms.',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'Designed with empathy to provide supportive guidance during difficult times.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Award,
      title: 'Evidence-Based',
      description: 'All recommendations are based on the latest medical research and clinical guidelines.',
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Lead Neurologist',
      description: 'Specialist in cognitive disorders with 15+ years of experience in Alzheimer\'s research.',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'AI Research Director',
      description: 'Expert in machine learning and medical AI with focus on early disease detection.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Clinical Psychologist',
      description: 'Specializes in cognitive assessment and family support for Alzheimer\'s patients.',
      image: 'https://images.unsplash.com/photo-1594824475545-9d0c7c4951c5?w=150&h=150&fit=crop&crop=face'
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Alvira
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing Alzheimer's care through AI-powered early detection, 
            personalized guidance, and comprehensive support for patients and families.
          </p>
        </motion.div>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                To provide accessible, accurate, and compassionate Alzheimer's care through 
                innovative AI technology, helping families navigate the challenges of cognitive 
                decline with confidence and support.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that early detection and intervention can significantly improve 
                quality of life for patients and their loved ones. Our platform combines 
                cutting-edge technology with human empathy to create a comprehensive care solution.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">Early Detection</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">AI-Powered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">Compassionate Care</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Why Alvira?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Advanced AI algorithms for accurate predictions
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Comprehensive support for patients and families
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Easy access to healthcare professionals
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    Evidence-based recommendations and guidance
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with the latest advancements in AI and healthcare technology
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
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Expert Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Leading healthcare professionals and AI researchers dedicated to improving Alzheimer's care
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">95%</div>
                <div className="text-blue-100">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-blue-100">Patients Helped</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-blue-100">Support Available</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-blue-100">Expert Partners</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Have questions about our platform or need support? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@alvira.com"
                className="btn-primary inline-flex items-center justify-center"
              >
                Contact Support
              </a>
              <a
                href="tel:+1-555-ALVIRA"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Call Us
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}

export default About 