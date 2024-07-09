import React from 'react'
import { useGeolocation } from '../context/useGeolocation'
import DataItem from './DataItem'

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
    <section className='absolute z-10 top-1/4 flex flex-col bg-white rounded-lg w-4/5 text-center gap-6 p-4 shadow-lg sm:flex-row sm:w-11/12 sm:max-w-5xl sm:justify-between sm:items-center sm:text-left sm:py-2 sm:px-8'>
      <DataItem title='IP Address' data={geoData?.ip} />
      <div className='hidden sm:block h-16 border-l border-gray-300 mx-4'></div>
      <DataItem
        title='Location'
        data={
          geoData
            ? `${geoData.location.city}, ${geoData.location.country}`
            : undefined
        }
      />
      <div className='hidden sm:block h-16 border-l border-gray-300 mx-4'></div>
      <DataItem title='Timezone' data={geoData?.location.timezone} />
      <div className='hidden sm:block h-16 border-l border-gray-300 mx-4'></div>
      <DataItem title='ISP' data={geoData?.isp} />
    </section>
  )
}

export default DataSection
