
import * as React from "react"

// Adjusted breakpoints for better device support
const MOBILE_BREAKPOINT = 768 // Tablets and below
const SMALL_MOBILE_BREAKPOINT = 480 // Small phones

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Initial check function
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(isMobileDevice)
    }

    // Run initial check
    checkMobile()

    // Set up event listener for screen size changes with debounce for performance
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(checkMobile, 100)
    }
    
    window.addEventListener("resize", handleResize)
    
    // Clean up event listener
    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isMobile
}

// More specific device type detection
export function useDeviceType() {
  const [deviceType, setDeviceType] = React.useState<'phone' | 'small-phone' | 'tablet' | 'desktop'>('desktop')

  React.useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth
      if (width < SMALL_MOBILE_BREAKPOINT) {
        setDeviceType('small-phone')
      } else if (width < 480) {
        setDeviceType('phone')
      } else if (width < MOBILE_BREAKPOINT) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }

    updateDeviceType()
    
    // Set up event listener with debounce for performance
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(updateDeviceType, 100)
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return deviceType
}

// Specific hook for orientation changes
export function useOrientation() {
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('portrait')

  React.useEffect(() => {
    const updateOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth
      setOrientation(isPortrait ? 'portrait' : 'landscape')
    }

    updateOrientation()
    
    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)
    
    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  return orientation
}
