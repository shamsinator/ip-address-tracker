import React, { ReactNode, useEffect, useState } from 'react'

import { GeolocationData, getGeolocation } from '../services/ipGeolocation'
import { GeolocationContext } from './GeolocationContext'

/**
 * GeolocationProvider component that provides geolocation data to its children.
 *
 * @param {ReactNode} children - The children components to be wrapped by the GeolocationProvider.
 * @return {ReactElement} The GeolocationProvider component.
 */
export const GeolocationProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [geoData, setGeoData] = useState<GeolocationData | null>(null)

  useEffect(() => {
    const fetchInitialGeolocation = async () => {
      try {
        const data = await getGeolocation('')
        setGeoData(data)
      } catch (error) {
        console.error('Error fetching initial geolocation data:', error)
      }
    }

    fetchInitialGeolocation()
  }, [])

  return (
    <GeolocationContext.Provider value={{ geoData, setGeoData }}>
      {children}
    </GeolocationContext.Provider>
  )
}
