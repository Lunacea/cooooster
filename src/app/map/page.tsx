import { MapWidget } from '@/widgets/MapWidget'

export default function MapPage() {
  return (
    <div className="w-full h-screen p-4">
      <div className="w-full h-full rounded-lg shadow-lg overflow-hidden">
        <MapWidget />
      </div>
    </div>
  )
}
