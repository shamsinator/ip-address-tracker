import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import iconLocation from '../assets/icon-location.svg'

const containerStyle = {
  width: '100vw',
  height: '100vh'
}

const center = {
  lat: 52.365539637430885,
  lng: 4.896404942533201
}

const MapSection = () => {
  return (
    <section className='relative w-full h-160 z-0'>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}>
        <Map
          defaultCenter={center}
          defaultZoom={10}
          style={containerStyle}
          mapId={'8f6b8e6e2f6b7d9b'}>
          <AdvancedMarker position={center}>
            <img src={iconLocation} width={32} height={32} />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </section>
  )
}

export default MapSection
