import React, { useState } from 'react'
import { getGeolocation } from '../services/ipGeolocation'
import { useGeolocation } from '../context/useGeolocation'
import iconArrowSVG from '../assets/icon-arrow.svg'

const SearchForm: React.FC = () => {
  const [ipAddress, setIpAddress] = useState<string>('')
  const { setGeoData } = useGeolocation()
  const [error, setError] = useState<string | null>(null)

  const validateIpAddress = (ip: string): boolean => {
    const ipPattern =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return ipPattern.test(ip)
  }

  const handleFetchGeolocation = async (
    event: React.FormEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()

    if (!validateIpAddress(ipAddress)) {
      setError('Please enter a valid IP address.')
      return
    }

    try {
      const data = await getGeolocation(ipAddress)
      setGeoData(data)
      setError(null)
    } catch (error) {
      setGeoData(null)
      setError('Could not fetch geolocation data.')
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleFetchGeolocation(event)
    }
  }

  return (
    <div className='relative flex flex-row justify-center'>
      <form className='flex w-full max-w-md md:max-w-lg'>
        <input
          type='text'
          placeholder='Search for any IP address or domain'
          required
          className='cursor-text w-4/5 border-transparent rounded-l-xl placeholder:text-lg text-lg p-4 font-normal focus:outline-none'
          value={ipAddress}
          onChange={(event) => setIpAddress(event.target.value)}
          onKeyDown={handleKeyPress}
          aria-label='IP address or domain'
        />
        <button
          onClick={handleFetchGeolocation}
          type='submit'
          className='bg-black text-white p-4 rounded-r-2xl transition ease-in-out duration-300 hover:bg-veryDarkGray'>
          <img src={iconArrowSVG} alt='icon arrow' />
        </button>
      </form>
      <div className='absolute top-20'>{error && <p>{error}</p>}</div>
    </div>
  )
}

export default SearchForm
