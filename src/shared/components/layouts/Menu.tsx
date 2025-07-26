import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { HomeIcon, MapPinIcon, MessageCircleIcon, GlobeIcon } from "lucide-react";
import { RegionSelector } from '@/features/map/RegionSelector';

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
        <Tabs>
          <TabsList className="bg-gray-100 w-full">
            <TabsTrigger value="home" className="flex-1 data-[state=active]:bg-white">
              <HomeIcon className="h-4 w-4 mr-2" />
              ホーム
            </TabsTrigger>
            <TabsTrigger value="spot" className="flex-1 data-[state=active]:bg-white">
              <MapPinIcon className="h-4 w-4 mr-2" />
              スポット
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1 data-[state=active]:bg-white">
              <MessageCircleIcon className="h-4 w-4 mr-2" />
              チャット
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
