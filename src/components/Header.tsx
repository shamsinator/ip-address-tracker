import React, { useEffect, useState } from 'react'
import desktopImage from '../assets/pattern-bg-desktop.png'
import mobileImage from '../assets/pattern-bg-mobile.png'
import SearchForm from './SearchForn'

const Header: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = React.useState(
    window.innerWidth <= 768 ? mobileImage : desktopImage
  )

  React.useEffect(() => {
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
      className='bg-dark-gray relative w-full bg-center bg-no-repeat bg-cover text-center flex flex-col gap-6 h-80'
      style={styles}>
      <h1
        className='text-2xl text-white mt-8 font-medium'
        style={{ wordSpacing: '9px' }}>
        IP Address Tracker
      </h1>
      <SearchForm />
    </section>
  )
}

export default Header
