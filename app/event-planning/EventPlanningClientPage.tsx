"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Calendar, Users, MapPin, Check } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { toast } from "@/hooks/use-toast"

const eventTypes = [
  "Wedding",
  "Corporate Event",
  "Birthday Party",
  "Anniversary",
  "Baby Shower",
  "Engagement Party",
  "Graduation",
  "Other",
]

export default function EventPlanningClientPage() {
  const router = useRouter()
  const { addEventBooking } = useCart()

  const [formData, setFormData] = useState({
    date: "",
    location: "",
    eventType: "",
    guestCount: 0,
    additionalInfo: "",
  })

  const [errors, setErrors] = useState({
    date: "",
    location: "",
    eventType: "",
    guestCount: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is updated
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      date: "",
      location: "",
      eventType: "",
      guestCount: "",
    }

    let isValid = true

    if (!formData.date) {
      newErrors.date = "Please select a date"
      isValid = false
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        newErrors.date = "Please select a future date"
        isValid = false
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = "Please enter an event location"
      isValid = false
    }

    if (!formData.eventType) {
      newErrors.eventType = "Please select an event type"
      isValid = false
    }

    if (!formData.guestCount || formData.guestCount <= 0) {
      newErrors.guestCount = "Please enter a valid number of guests"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Add event booking to cart
    addEventBooking({
      ...formData,
      guestCount: Number(formData.guestCount),
      price: 2000, // R2000 fixed price for event planning
    })

    toast({
      title: "Event planning added to cart",
      description: "Lungi's event planning services have been added to your cart",
    })

    // Redirect to cart
    router.push("/cart")
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1600&auto=format&fit=crop"
            alt="Event Planning Services with Candles"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-4">Event Planning</h1>
            <p className="text-lg md:text-xl">Create memorable experiences with professional event planning by Lungi</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Event Planning Info */}
          <div>
            <h2 className="text-3xl font-serif font-medium mb-6">Professional Event Planning Services</h2>
            <p className="text-gray-700 mb-6">
              Lungi, the creative mind behind Umi Candles, offers professional event planning services to make your
              special occasions truly memorable. With years of experience in creating beautiful atmospheres and
              coordinating flawless events, Lungi brings creativity, attention to detail, and a passion for perfection
              to every event.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-fuchsia-100 flex items-center justify-center mr-4">
                  <Check className="h-5 w-5 text-fuchsia-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Personalized Planning</h3>
                  <p className="text-gray-600 mt-1">
                    Every event is unique. Lungi works closely with you to understand your vision and bring it to life.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-fuchsia-100 flex items-center justify-center mr-4">
                  <Check className="h-5 w-5 text-fuchsia-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Attention to Detail</h3>
                  <p className="text-gray-600 mt-1">
                    From lighting to table settings, every detail is carefully considered to create a cohesive
                    atmosphere.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-fuchsia-100 flex items-center justify-center mr-4">
                  <Check className="h-5 w-5 text-fuchsia-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Stress-Free Experience</h3>
                  <p className="text-gray-600 mt-1">
                    Relax and enjoy your event while Lungi handles the coordination and ensures everything runs
                    smoothly.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-fuchsia-50 p-6 rounded-lg border border-fuchsia-100">
              <h3 className="text-xl font-medium mb-3">Service Fee: R2,000</h3>
              <p className="text-gray-700">
                The event planning service includes an initial consultation, event design, coordination with vendors,
                and on-site management on the day of your event. Additional costs may apply for large events or special
                requirements.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-medium mb-4">Event Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {eventTypes.map((type) => (
                  <div key={type} className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                    {type}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-serif font-medium mb-6">Book Lungi for Your Event</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border ${errors.date ? "border-red-300" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500`}
                  />
                </div>
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Location *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Address or venue name"
                    className={`w-full pl-10 pr-4 py-2 border ${errors.location ? "border-red-300" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500`}
                  />
                </div>
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>

              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type *
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.eventType ? "border-red-300" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500`}
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.eventType && <p className="mt-1 text-sm text-red-600">{errors.eventType}</p>}
              </div>

              <div>
                <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Guests *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="guestCount"
                    name="guestCount"
                    value={formData.guestCount || ""}
                    onChange={handleChange}
                    min="1"
                    className={`w-full pl-10 pr-4 py-2 border ${errors.guestCount ? "border-red-300" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500`}
                  />
                </div>
                {errors.guestCount && <p className="mt-1 text-sm text-red-600">{errors.guestCount}</p>}
              </div>

              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us more about your event, special requirements, or questions"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-fuchsia-600 text-white py-3 rounded-full font-medium hover:bg-fuchsia-700 transition-colors flex items-center justify-center"
              >
                Book Now - R2,000
              </button>
            </form>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-medium mb-8 text-center">What Clients Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
                    alt="Client"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Sarah Johnson</h3>
                  <p className="text-sm text-gray-600">Wedding, Cape Town</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Lungi transformed our wedding into a magical experience. Her attention to detail and creative vision
                made our special day absolutely perfect. Highly recommend!"
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
                    alt="Client"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Michael Ndlovu</h3>
                  <p className="text-sm text-gray-600">Corporate Event, Johannesburg</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Our company anniversary event was flawlessly executed thanks to Lungi. Professional, responsive, and
                incredibly creative. Our team was impressed!"
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
                    alt="Client"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Thandi Khumalo</h3>
                  <p className="text-sm text-gray-600">Baby Shower, Durban</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Lungi planned the most beautiful baby shower for me. The decor, the atmosphere, everything was perfect.
                She took all the stress away and let me enjoy my special day."
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
