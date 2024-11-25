"use client"

import { motion } from "framer-motion"
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname()
  const [isPresent, setIsPresent] = useState(false)

  useEffect(() => {
    setIsPresent(true)
    return () => setIsPresent(false)
  }, [pathname])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isPresent ? 1 : 0,
        y: isPresent ? 0 : 20
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
