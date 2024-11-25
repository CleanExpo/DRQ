"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

export function FadeInStagger({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

export function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

export function ParallaxSection({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <motion.div style={{ y }} className="relative">
      {children}
    </motion.div>
  )
}

export function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60 // Update 60 times during animation
    const stepDuration = duration / steps
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      current += increment
      step++
      setDisplayValue(Math.round(current))

      if (step >= steps) {
        setDisplayValue(value)
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayValue}
    </motion.span>
  )
}
