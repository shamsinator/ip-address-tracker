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
    <section className='absolute top-1/4 z-10 flex w-4/5 flex-col gap-6 rounded-lg bg-white p-4 text-center leading-10 shadow-lg sm:w-11/12 sm:max-w-5xl sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-8 sm:text-left'>
      <DataItem title='IP Address' data={geoData?.ip} />
      <div className='mx-4 hidden h-16 border-l border-gray-300 sm:block'></div>
      <DataItem
        title='Location'
        data={
          geoData
            ? `${geoData.location.city}, ${geoData.location.country}`
            : undefined
        }
      />
      <div className='mx-4 hidden h-16 border-l border-gray-300 sm:block'></div>
      <DataItem title='Timezone' data={geoData?.location.timezone} />
      <div className='mx-4 hidden h-16 border-l border-gray-300 sm:block'></div>
      <DataItem title='ISP' data={geoData?.isp} />
    </section>
  )
}

export default DataSection
