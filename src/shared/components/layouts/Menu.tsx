import { HomeIcon, MapPinIcon, MessageCircleIcon, GlobeIcon } from "lucide-react";
import { RegionSelector } from '@/features/map/RegionSelector';
import { ChatDrawer } from '@/features/chat/components/ChatDrawer';
import { Button } from "@/shared/components/ui/button";

interface MenuProps {
  selectedRegion: string | null;
  onRegionChange: (regionName: string | null) => void;
  onRegionCenterChange: (center: [number, number]) => void;
}

export default function Menu({ selectedRegion, onRegionChange, onRegionCenterChange }: MenuProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-700">地方選択</h2>
        <GlobeIcon className="h-4 w-4 text-gray-500" />
      </div>

      <RegionSelector
        currentRegion={selectedRegion}
        onRegionChange={onRegionChange}
        onRegionCenterChange={onRegionCenterChange}
      />

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <HomeIcon className="h-4 w-4" />
            ホーム
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            スポット
          </Button>
          <ChatDrawer
            trigger={
              <Button variant="outline" className="flex items-center justify-center gap-2 w-full">
                <MessageCircleIcon className="h-4 w-4" />
                チャット
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
