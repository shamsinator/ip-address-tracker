const DataSection = () => {
  return (
    <section className='absolute z-10 top-1/4 flex flex-col bg-white rounded-lg w-4/5 text-center gap-6 p-4 shadow-lg sm:flex-row sm:w-11/12 sm:max-w-5xl sm:justify-between sm:items-center sm:text-left sm:py-2 sm:px-8'>
      {/* IP Address */}
      <article className='flex-1 sm:w-64'>
        <h2 className='text-dark-gray text-xs uppercase'>IP Address</h2>
        <p className='text-very-dark-gray text-3xl font-bold sm:text-2xl ipAddressField'>
          192.168.0.01
        </p>
      </article>
      {/* Divider */}
      <div className='hidden sm:block h-16 border-l border-gray-300 mx-4'></div>
      {/* Location */}
      <article className='flex-1'>
        <h2 className='text-dark-gray text-xs uppercase'>Location</h2>
        <p className='text-very-dark-gray text-3xl font-bold sm:text-2xl locationInput'>
          Amsterdam, Netherlands
        </p>
      </article>
      {/* Divider */}
      <div className='hidden sm:block h-16 border-l border-gray-300 mx-4'></div>
      {/* Timezone */}
      <article className='flex-1'>
        <h2 className='text-dark-gray text-xs uppercase'>Timezone</h2>
        <p className='text-very-dark-gray text-3xl font-bold sm:text-2xl timezoneInput'>
          UT-05:00
        </p>
      </article>
      {/* Divider */}
      <div className='hidden sm:block h-16 border-l border-gray-300 mx-4'></div>
      {/* ISP */}
      <article className='flex-1'>
        <h2 className='text-dark-gray text-xs uppercase'>ISP</h2>
        <p className='text-very-dark-gray text-3xl font-bold sm:text-2xl ispInput'>
          Ziggo, Netherlands
        </p>
      </article>
    </section>
  )
}

export default DataSection
