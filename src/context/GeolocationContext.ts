import { createContext } from 'react'
import { GeolocationData } from '../services/ipGeolocation'

export interface GeolocationContextType {
  geoData: GeolocationData | null
  setGeoData: (data: GeolocationData | null) => void
}

export const defaultValue: GeolocationContextType = {
  geoData: null,
  setGeoData: () => {}
}

export const GeolocationContext =
  createContext<GeolocationContextType>(defaultValue)
