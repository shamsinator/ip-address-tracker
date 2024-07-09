import axios from 'axios'

const BASE_URL = 'https://geo.ipify.org/api/v2/country,city'
const API_KEY = import.meta.env.VITE_GEOLOCATION_API_KEY as string

export interface GeolocationData {
  ip: string
  location: {
    city?: string
    country: string
    region?: string
    lat?: number
    lng?: number
    timezone: string
  }
  domains?: string[]
  as?: {
    asn: number
    name: string
    route: string
    domain: string
    type: string
  }
  isp?: string
}

export const getGeolocation = async (
  ipAddress: string
): Promise<GeolocationData> => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        apiKey: API_KEY,
        ipAddress: ipAddress || undefined // Fetch user's IP if ipAddress is empty
      }
    })

    if (response.status !== 200) {
      throw new Error(`Request failed with status code ${response.status}`)
    }

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching geolocation data:', error.message)
    } else {
      console.error('Error fetching geolocation data:', error)
    }
    throw error
  }
}
