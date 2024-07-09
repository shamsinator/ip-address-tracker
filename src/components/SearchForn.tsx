import React, { useState } from 'react'
import { getGeolocation } from '../services/ipGeolocation'
import { useGeolocation } from '../context/useGeolocation'
import iconArrowSVG from '../assets/icon-arrow.svg'

const SearchForm: React.FC = () => {
  const [ipAddress, setIpAddress] = useState<string>('')
  const { setGeoData } = useGeolocation()
  const [error, setError] = useState<string | null>(null)

  const handleFetchGeolocation = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const data = await getGeolocation(ipAddress)
      setGeoData(data)
      setError(null)
    } catch (error) {
      setGeoData(null)
      setError('Could not fetch geolocation data')
    }
  }

  return (
    <div className='relative flex flex-row justify-center'>
      <input
        type='text'
        placeholder='Search for any IP address or domain'
        required
        className='cursor-text w-4/5 max-w-md border-transparent rounded-l-lg placeholder:text-lg text-lg p-4 font-normal'
        value={ipAddress}
        onChange={(event) => setIpAddress(event.target.value)}
        aria-label='IP address or domain'
      />
      <button
        onClick={handleFetchGeolocation}
        type='submit'
        className='bg-black text-white p-4 rounded-r-2xl transition ease-in-out duration-300 hover:bg-veryDarkGray'>
        <img srcSet={iconArrowSVG} alt='icon arrow' />
      </button>
      <div>{error && <p>{error}</p>}</div>
    </div>
  )
}

export default SearchForm
