import React, { useEffect, useState } from 'react'
import desktopImage from '../assets/pattern-bg-desktop.png'
import mobileImage from '../assets/pattern-bg-mobile.png'
import SearchForm from './SearchForn'

const Header: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState(
    window.innerWidth <= 768 ? mobileImage : desktopImage
  )

  useEffect(() => {
    const handleResize = () => {
      setBackgroundImage(window.innerWidth <= 768 ? mobileImage : desktopImage)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const styles = {
    backgroundImage: `url(${backgroundImage})`
  }

  return (
    <section
      className='relative flex h-[280px] w-full flex-col gap-6 bg-dark-gray bg-cover bg-center bg-no-repeat text-center'
      style={styles}>
      <h1
        className='mt-8 text-2xl font-medium text-white'
        style={{ wordSpacing: '9px' }}>
        IP Address Tracker
      </h1>
      <SearchForm />
    </section>
  )
}

export default Header
