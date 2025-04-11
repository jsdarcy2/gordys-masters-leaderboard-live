
import * as React from "react"

// Adjusted mobile breakpoint to match common device sizes
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check function
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(isMobileDevice)
    }

    // Run initial check
    checkMobile()

    // Set up event listener for screen size changes
    window.addEventListener("resize", checkMobile)
    
    // Clean up event listener
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile === undefined ? false : isMobile
}

// Additional function to get more specific device type
export function useDeviceType() {
  const [deviceType, setDeviceType] = React.useState<'phone' | 'tablet' | 'desktop'>('desktop')

  React.useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth
      if (width < 480) {
        setDeviceType('phone')
      } else if (width < 768) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }

    updateDeviceType()
    window.addEventListener('resize', updateDeviceType)
    
    return () => window.removeEventListener('resize', updateDeviceType)
  }, [])

  return deviceType
}
