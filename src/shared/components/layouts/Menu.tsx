import { HomeIcon, MapPinIcon, MessageCircleIcon } from "lucide-react";
import { ChatDrawer } from '@/features/chat/components/ChatDrawer';
import { Button } from "@/shared/components/ui/button";

export default function Menu() {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 p-4">
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
  );
}
