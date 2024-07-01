import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'

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
      {/* <div id='map' className='h-full'></div> */}
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}>
        <Map defaultCenter={center} defaultZoom={12} style={containerStyle}>
          <Marker position={center} />
        </Map>
      </APIProvider>
    </section>
  )
}

export default MapSection
