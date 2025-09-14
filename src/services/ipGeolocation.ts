import axios, { AxiosRequestConfig } from 'axios'

const BASE_URL = 'https://geo.ipify.org/api/v2/country,city'
const API_KEY = import.meta.env.VITE_GEOLOCATION_API_KEY as string

// Security configuration constants
const MAX_RESPONSE_SIZE = 50 * 1024 // 50KB max response size
const REQUEST_TIMEOUT = 10000 // 10 seconds timeout
const MAX_REDIRECTS = 3 // Limit redirects to prevent redirect loops

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

/**
 * Validates if the provided string is a valid IP address (IPv4 or IPv6)
 * This helps prevent SSRF attacks by ensuring only valid IPs are processed
 * @param ip - The IP address string to validate
 * @returns boolean indicating if the IP is valid
 */
const isValidIpAddress = (ip: string): boolean => {
  if (!ip || typeof ip !== 'string') return false

  // IPv4 validation
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

  // IPv6 validation (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/

  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

/**
 * Creates a secure Axios request configuration with size and timeout limits
 * @param ipAddress - The IP address to lookup
 * @returns AxiosRequestConfig with security measures
 */
const createSecureRequestConfig = (ipAddress: string): AxiosRequestConfig => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'IP-Address-Tracker/1.0'
    },
    params: {
      apiKey: API_KEY,
      ipAddress: ipAddress || undefined
    },
    timeout: REQUEST_TIMEOUT,
    maxRedirects: MAX_REDIRECTS,
    maxContentLength: MAX_RESPONSE_SIZE,
    maxBodyLength: MAX_RESPONSE_SIZE,
    // Validate response size during streaming
    onDownloadProgress: (progressEvent) => {
      if (progressEvent.total && progressEvent.total > MAX_RESPONSE_SIZE) {
        throw new Error(
          `Response size too large: ${progressEvent.total} bytes exceeds ${MAX_RESPONSE_SIZE} bytes limit`
        )
      }
    }
  }
}

export const getGeolocation = async (
  ipAddress: string
): Promise<GeolocationData> => {
  try {
    // Validate IP address if provided to prevent SSRF attacks
    if (ipAddress && !isValidIpAddress(ipAddress)) {
      throw new Error('Invalid IP address format provided')
    }

    // Create secure request configuration
    const config = createSecureRequestConfig(ipAddress)

    const response = await axios.get(BASE_URL, config)

    if (response.status !== 200) {
      throw new Error(`Request failed with status code ${response.status}`)
    }

    // Validate response data size as additional security measure
    const responseSize = JSON.stringify(response.data).length
    if (responseSize > MAX_RESPONSE_SIZE) {
      throw new Error(
        `Response data too large: ${responseSize} bytes exceeds ${MAX_RESPONSE_SIZE} bytes limit`
      )
    }

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific Axios errors
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout:', error.message)
        throw new Error('Request timed out. Please try again.')
      } else if (error.code === 'ERR_FR_TOO_MANY_REDIRECTS') {
        console.error('Too many redirects:', error.message)
        throw new Error(
          'Too many redirects detected. Request blocked for security.'
        )
      } else if (
        error.message.includes('Response size too large') ||
        error.message.includes('maxContentLength')
      ) {
        console.error('Response size limit exceeded:', error.message)
        throw new Error('Response too large. Request blocked for security.')
      } else {
        console.error('Error fetching geolocation data:', error.message)
        throw new Error(
          'Failed to fetch geolocation data. Please check your network connection.'
        )
      }
    } else if (error instanceof Error) {
      console.error('Error fetching geolocation data:', error.message)
      throw error
    } else {
      console.error('Unknown error fetching geolocation data:', error)
      throw new Error(
        'An unexpected error occurred while fetching geolocation data.'
      )
    }
  }
}
