import React, { useEffect, useMemo, useState } from 'react'

const HeroSlider = () => {
  const slides = useMemo(
    () => [
      '/images/two.jpg',
      '/images/four.jpg',
      '/images/five.jpg',
      '/images/six.jpg',
      '/images/ten.jpg',
      '/images/twelve.jpg',
      '/images/huang-mu-DZ8CdAVlFrI-unsplash.jpg'
    ],
    []
  )

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const sliderTimer = setInterval(() => {
      setCurrentSlide((previousSlide) => (previousSlide + 1) % slides.length)
    }, 4500)

    return () => clearInterval(sliderTimer)
  }, [slides.length])

  return (
    <div className="relative h-[260px] overflow-hidden rounded-2xl p-6 text-white shadow-lg sm:h-[300px] sm:p-8">
      {/* ============Animated image slider background============== */}
      {slides.map((slide, index) => (
        <div
          key={slide}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
            currentSlide === index ? 'scale-110 opacity-100' : 'scale-100 opacity-0'
          }`}
          style={{
            backgroundImage: `url(${slide})`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      ))}

      {/* ==========Contrast overlay for readability ==================*/}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/70 via-slate-900/55 to-emerald-900/65" />

      {/*================= Hero text content =======================*/}
      <div className="relative z-10 flex h-full max-w-xl flex-col justify-center">
        <p className="mb-2 text-sm uppercase tracking-wide text-emerald-100">Smart Crop Care</p>
        <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">
          Detect Rice Nutrient Deficiency from Leaf Images
        </h2>
        <p className="mt-3 text-sm text-emerald-50 md:text-base">
          Upload a leaf photo, get deficiency insights, and ask AgriBot for treatment guidance.
        </p>
      </div>

      {/* =============Slider progress dots ============*/}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full bg-black/25 px-3 py-2 backdrop-blur-sm">
        {slides.map((slide, index) => (
          <button
            key={`${slide}-dot`}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 cursor-pointer rounded-full border border-white/40 transition-all duration-500 ${
              currentSlide === index
                ? 'w-4 bg-emerald-100 shadow-[0_0_6px_rgba(255,255,255,0.45)]'
                : 'w-1.5 bg-white/35 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider
