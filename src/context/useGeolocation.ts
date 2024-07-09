import { useContext } from 'react'
import {
  GeolocationContext,
  GeolocationContextType,
  defaultValue
} from './GeolocationContext'

/**
 * Custom hook to access the geolocation context.
 *
 * @return {GeolocationContextType} The geolocation context type.
 * @throws Will throw an error if the hook is used outside a GeolocationProvider.
 */
export const useGeolocation = (): GeolocationContextType => {
  const context = useContext(GeolocationContext)
  if (context === defaultValue) {
    throw new Error('useGeolocation must be used within a GeolocationProvider')
  }
  return context
}
