import './App.css'
import Header from './components/Header'
import DataSection from './components/DataSection'
import MapSection from './components/MapSection'
import { GeolocationProvider } from './context/GeolocationProvider'

export default function App() {
  return (
    <GeolocationProvider>
      <div className='App'>
        <div className='min-h-screen overflow-y-scroll box-border font-rubik'>
          <main className='w-full flex flex-col justify-center items-center'>
            <Header />
            <DataSection />
            <MapSection />
          </main>
        </div>
      </div>
    </GeolocationProvider>
  )
}
