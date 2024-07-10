import './App.css'
import Header from './components/Header'
import DataSection from './components/DataSection'
import MapSection from './components/MapSection'
import { GeolocationProvider } from './context/GeolocationProvider'

export default function App() {
  return (
    <GeolocationProvider>
      <div className='App'>
        <div className='box-border min-h-screen overflow-y-scroll font-rubik'>
          <main className='flex w-full flex-col items-center justify-center'>
            <Header />
            <DataSection />
            <MapSection />
          </main>
        </div>
      </div>
    </GeolocationProvider>
  )
}
