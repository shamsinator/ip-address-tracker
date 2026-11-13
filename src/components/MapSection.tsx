import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps'

import iconLocation from '../assets/icon-location.svg'
import { useGeolocation } from '../context/useGeolocation'

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 280px)' // 280px is the height of the header
}

const MapSection = () => {
  const { geoData } = useGeolocation()

  const zoomLevel = 12
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
            zoom={zoomLevel}
            style={containerStyle}
            mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string}>
            <AdvancedMarker position={center}>
              <img
                src={iconLocation}
                width={40}
                height={40}
                alt='Location marker'
              />
            </AdvancedMarker>
          </Map>
        ) : (
          <Map
            zoom={zoomLevel}
            style={containerStyle}
            mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string}></Map>
        )}
      </APIProvider>
    </section>
  )
}

export default MapSection
