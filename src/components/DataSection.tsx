import React from 'react'
import { useGeolocation } from '../context/useGeolocation'

// some hardcoded data for testing
// const geoData = {
//   ip: '89.99.111.79',
//   location: {
//     country: 'NL',
//     region: 'Provincie Gelderland',
//     timezone: '+02:00'
//   },
//   as: {
//     asn: 33915,
//     name: 'TNF-AS',
//     route: '89.99.0.0/16',
//     domain: 'http://www.vodafone.nl/zakelijk/',
//     type: 'Cable/DSL/ISP'
//   },
//   isp: 'Vodafone Libertel B.V.'
// }

const DataSection: React.FC = () => {
  const { geoData } = useGeolocation()

  return (
    <section className='absolute z-10 top-1/4 flex flex-col bg-white rounded-xl w-4/5 text-center gap-6 p-4 shadow-lg sm:flex-row sm:w-11/12 sm:max-w-5xl sm:justify-between sm:items-center sm:text-left sm:py-2 sm:px-8'>
      {/* IP Address */}
      <article className='flex-1 sm:w-64'>
        <h2 className='text-dark-gray text-xs uppercase'>IP Address</h2>
        <p className='text-very-dark-gray text-3xl font-bold sm:text-2xl ipAddressField'>
          {geoData?.ip ?? 'N/A'}
        </p>
      </article>
      {/* Divider */}
      <div className='hidden sm:block h-16 border-l border-gray-300 mx-4'></div>
      {/* Location */}
      <article className='flex-1'>
        <h2 className='text-dark-gray text-xs uppercase'>Location</h2>
        <p className='text-very-dark-gray text-3xl font-bold sm:text-2xl locationInput'>
          {geoData?.location.country ?? 'N/A'},{' '}
          {geoData?.location.region ?? 'N/A'}
        </p>
      </article>
      {/* Divider */}
      <div className='hidden sm:block h-16 border-l border-gray-300 mx-4'></div>
      {/* Timezone */}
      <article className='flex-1'>
        <h2 className='text-dark-gray text-xs uppercase'>Timezone</h2>
        <p className='text-very-dark-gray text-3xl font-bold sm:text-2xl timezoneInput'>
          {geoData?.location.timezone ?? 'N/A'}
        </p>
      </article>
      {/* Divider */}
      <div className='hidden sm:block h-16 border-l border-gray-300 mx-4'></div>
      {/* ISP */}
      <article className='flex-1'>
        <h2 className='text-dark-gray text-xs uppercase'>ISP</h2>
        <p className='text-very-dark-gray text-3xl font-bold sm:text-2xl ispInput'>
          {geoData?.isp ?? 'N/A'}
        </p>
      </article>
    </section>
  )
}

export default DataSection
