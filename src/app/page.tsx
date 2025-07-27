'use client'

import { MapWidget } from '@/widgets/MapWidget'
import Menu from '@/shared/components/layouts/Menu'
import { AuthWrapper } from '@/shared/components/auth/AuthWrapper'

export default function Home() {
  return (
    <AuthWrapper>
      <div className="w-screen h-screen overflow-hidden">
        {/* Map */}
        <div className="w-full h-full">
          <MapWidget />
        </div>

        {/* Menu */}
        <div className="absolute bottom-4 left-4 right-4 z-0">
          <Menu />
        </div>
      </div>
    </AuthWrapper>
  );
}
