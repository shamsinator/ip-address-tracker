import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { useGeolocation } from '../context/useGeolocation'
import iconLocation from '../assets/icon-location.svg'

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 280px)' // 280px is the height of the header
}

const MapSection = () => {
  const { geoData } = useGeolocation()

  const center =
    geoData?.location.lat && geoData?.location.lng
      ? {
          lat: geoData.location.lat,
          lng: geoData.location.lng
        }
      : null

  return (
    <section className='h-160 relative z-0 w-full'>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}>
        {center ? (
          <Map
            center={center}
            zoom={12}
            style={containerStyle}
            mapId={'8f6b8e6e2f6b7d9b'}>
            <AdvancedMarker position={center}>
              <img src={iconLocation} width={40} height={40} />
            </AdvancedMarker>
          </Map>
        ) : (
          <Map
            zoom={12}
            style={containerStyle}
            mapId={'8f6b8e6e2f6b7d9b'}></Map>
        )}
      </APIProvider>
    </section>
  )
}

export default MapSection
