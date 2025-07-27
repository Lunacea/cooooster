'use client'

import { MapWidget } from '@/widgets/MapWidget'
import { AuthWrapper } from '@/shared/components/auth/AuthWrapper'

export default function Home() {
  return (
    <AuthWrapper>
      <div className="w-screen h-screen overflow-hidden">
        {/* Map */}
        <div className="w-full h-full">
          <MapWidget />
        </div>
      </div>
    </AuthWrapper>
  );
}
