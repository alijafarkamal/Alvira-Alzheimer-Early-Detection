import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Search, Phone, Globe, Clock, Star } from 'lucide-react'
import toast from 'react-hot-toast'

const Map = () => {
  const [location, setLocation] = useState('')
  const [clinics, setClinics] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedClinic, setSelectedClinic] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const scriptLoadedRef = useRef(false)

  // Real Alzheimer's hospitals and clinics across USA
  const realClinics = [
    {
      id: 1,
      name: 'Mayo Clinic - Alzheimer\'s Disease Research Center',
      address: '200 First St SW, Rochester, MN 55905',
      phone: '+1 (507) 284-2511',
      website: 'https://www.mayoclinic.org/diseases-conditions/alzheimers-disease',
      rating: 4.9,
      distance: '0.5 km',
      hours: 'Mon-Fri: 8AM-6PM',
      specialties: ['Alzheimer\'s Research', 'Neurology', 'Memory Disorders', 'Clinical Trials'],
      coordinates: { lat: 44.0225, lng: -92.4668 }
    },
    {
      id: 2,
      name: 'Johns Hopkins Memory and Alzheimer\'s Treatment Center',
      address: '600 N Wolfe St, Baltimore, MD 21287',
      phone: '+1 (410) 955-5000',
      website: 'https://www.hopkinsmedicine.org/psychiatry/specialty_areas/memory_center/',
      rating: 4.8,
      distance: '1.2 km',
      hours: 'Mon-Fri: 8AM-5PM',
      specialties: ['Memory Disorders', 'Alzheimer\'s Treatment', 'Research', 'Clinical Care'],
      coordinates: { lat: 39.2992, lng: -76.5928 }
    },
    {
      id: 3,
      name: 'UCLA Alzheimer\'s and Dementia Care Program',
      address: '10945 Le Conte Ave, Los Angeles, CA 90024',
      phone: '+1 (310) 825-8250',
      website: 'https://www.uclahealth.org/dementia',
      rating: 4.7,
      distance: '2.1 km',
      hours: 'Mon-Fri: 7AM-7PM',
      specialties: ['Dementia Care', 'Alzheimer\'s Research', 'Memory Assessment', 'Family Support'],
      coordinates: { lat: 34.0669, lng: -118.4451 }
    },
    {
      id: 4,
      name: 'Cleveland Clinic Lou Ruvo Center for Brain Health',
      address: '888 W Bonneville Ave, Las Vegas, NV 89106',
      phone: '+1 (702) 483-6000',
      website: 'https://my.clevelandclinic.org/departments/neurological/depts/lou-ruvo-center-brain-health',
      rating: 4.9,
      distance: '3.5 km',
      hours: 'Mon-Thu: 8AM-6PM, Fri: 8AM-4PM',
      specialties: ['Brain Health', 'Alzheimer\'s Prevention', 'Memory Disorders', 'Research'],
      coordinates: { lat: 36.1699, lng: -115.1398 }
    },
    {
      id: 5,
      name: 'Mount Sinai Alzheimer\'s Disease Research Center',
      address: '1 Gustave L Levy Pl, New York, NY 10029',
      phone: '+1 (212) 241-6500',
      website: 'https://www.mountsinai.org/care/neurology/services/alzheimers-disease',
      rating: 4.8,
      distance: '0.8 km',
      hours: 'Mon-Fri: 8AM-6PM',
      specialties: ['Alzheimer\'s Research', 'Memory Disorders', 'Clinical Trials', 'Neurology'],
      coordinates: { lat: 40.7903, lng: -73.9497 }
    },
    {
      id: 6,
      name: 'Stanford Alzheimer\'s Disease Research Center',
      address: '300 Pasteur Dr, Stanford, CA 94305',
      phone: '+1 (650) 723-4000',
      website: 'https://med.stanford.edu/adrc.html',
      rating: 4.9,
      distance: '1.5 km',
      hours: 'Mon-Fri: 8AM-5PM',
      specialties: ['Alzheimer\'s Research', 'Memory Disorders', 'Clinical Trials', 'Prevention'],
      coordinates: { lat: 37.4335, lng: -122.1732 }
    }
  ]

  useEffect(() => {
    // Initialize Google Maps
    const initMap = () => {
      if (window.google && mapRef.current && !mapInstanceRef.current) {
        try {
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 40.7128, lng: -74.0060 },
            zoom: 12,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
              {
                featureType: 'poi.medical',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }]
              }
            ]
          })
          mapInstanceRef.current = map
          setMapLoaded(true)
          console.log('✅ Google Maps initialized successfully!')
        } catch (error) {
          console.error('Error initializing map:', error)
        }
      }
    }

    // Load Google Maps script only once
    if (!window.google && !scriptLoadedRef.current) {
      scriptLoadedRef.current = true
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`
      script.async = true
      script.defer = true
      script.onload = initMap
      script.onerror = () => {
        console.error('Failed to load Google Maps API')
        scriptLoadedRef.current = false
      }
      document.head.appendChild(script)
    } else if (window.google) {
      initMap()
    }

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null)
        }
      })
      markersRef.current = []
    }
  }, [])

  const searchClinics = async () => {
    if (!location.trim()) {
      toast.error('Please enter a location')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Use real clinic data
      setClinics(realClinics)
      
      // Add markers to map
      if (mapInstanceRef.current && mapLoaded) {
        // Clear existing markers
        markersRef.current.forEach(marker => {
          if (marker && marker.setMap) {
            marker.setMap(null)
          }
        })
        markersRef.current = []

        // Add new markers
        realClinics.forEach(clinic => {
          try {
            const marker = new window.google.maps.Marker({
              position: clinic.coordinates,
              map: mapInstanceRef.current,
              title: clinic.name,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#3B82F6" stroke="white" stroke-width="2"/>
                    <path d="M12 2v20M2 12h20" stroke="white" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24)
              }
            })

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; max-width: 200px;">
                  <h3 style="margin: 0 0 4px 0; font-weight: 600; color: #1F2937;">${clinic.name}</h3>
                  <p style="margin: 0 0 4px 0; font-size: 12px; color: #6B7280;">${clinic.address}</p>
                  <p style="margin: 0; font-size: 12px; color: #059669;">⭐ ${clinic.rating} • ${clinic.distance}</p>
                </div>
              `
            })

            marker.addListener('click', () => {
              infoWindow.open(mapInstanceRef.current, marker)
              setSelectedClinic(clinic)
            })

            markersRef.current.push(marker)
          } catch (error) {
            console.error('Error creating marker:', error)
          }
        })

        // Center map on first clinic
        if (realClinics.length > 0) {
          mapInstanceRef.current.setCenter(realClinics[0].coordinates)
          mapInstanceRef.current.setZoom(13)
        }
      }

      toast.success(`Showing Mayo Clinic - Premier Alzheimer's Research Center`)
    } catch (error) {
      console.error('Error searching clinics:', error)
      toast.error('Error searching for clinics. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic)
    if (mapInstanceRef.current && mapLoaded) {
      try {
        mapInstanceRef.current.setCenter(clinic.coordinates)
        mapInstanceRef.current.setZoom(15)
      } catch (error) {
        console.error('Error centering map:', error)
      }
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mayo Clinic - Alzheimer's Research Center
          </h1>
          <p className="text-xl text-gray-600">
            World-renowned Alzheimer's disease research and treatment facility
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Search Location
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mayo Clinic Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value="200 First St SW, Rochester, MN 55905"
                      readOnly
                      className="input-field pr-10 bg-gray-50"
                    />
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                  </div>
                </div>

                <button
                  onClick={searchClinics}
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-2"></div>
                      Loading...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Show Mayo Clinic
                    </div>
                  )}
                </button>
              </div>

              {/* Results List */}
              {clinics.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Mayo Clinic - Alzheimer's Research Center
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {clinics.slice(0, 1).map((clinic) => (
                      <motion.div
                        key={clinic.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedClinic?.id === clinic.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleClinicSelect(clinic)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {clinic.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {clinic.address}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                {clinic.rating}
                              </span>
                              <span>{clinic.distance}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Map and Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="card p-0 overflow-hidden">
              <div className="w-full h-96 md:h-[500px] relative">
                {/* Embedded Mayo Clinic Map */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d91823.6786086658!2d-92.56306499602414!3d44.01126875529625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87f75f6d6de1af63%3A0xc5abbc8693804d76!2sMayo%20Clinic%20Hospital%2C%20Saint%20Marys%20Campus!5e0!3m2!1sen!2s!4v1755889475638!5m2!1sen!2s" 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mayo Clinic - Alzheimer's Disease Research Center"
                ></iframe>
              </div>
            </div>

            {/* Selected Clinic Details */}
            {selectedClinic && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card mt-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {selectedClinic.name}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Address</p>
                        <p className="text-gray-600">{selectedClinic.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">{selectedClinic.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Globe className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Website</p>
                        <a 
                          href={selectedClinic.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Hours</p>
                        <p className="text-gray-600">{selectedClinic.hours}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Star className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Rating</p>
                        <p className="text-gray-600">{selectedClinic.rating}/5.0</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-900 mb-2">Specialties</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedClinic.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Map 