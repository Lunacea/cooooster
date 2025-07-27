import { BarChart3Icon, MapPinIcon, MessageCircleIcon, PlusIcon } from "lucide-react";
import { ChatDrawer } from '@/features/chat/components/ChatDrawer';
import { Button } from "@/shared/components/ui/button";
import { ProgressDashboard } from '@/features/progress/components/ProgressDashboard';

interface MenuProps {
  onPinButtonClick?: () => void;
  isPinButtonDisabled?: boolean;
}

export default function Menu({ onPinButtonClick, isPinButtonDisabled = false }: MenuProps) {
  const handlePinButtonClick = () => {
    console.log('Menu: ピン投稿ボタンがクリックされました');
    console.log('Menu: onPinButtonClick:', !!onPinButtonClick);
    console.log('Menu: isPinButtonDisabled:', isPinButtonDisabled);

    if (onPinButtonClick && !isPinButtonDisabled) {
      onPinButtonClick();
    } else {
      console.log('Menu: ボタンが無効またはコールバックが未設定');
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* メインメニュー */}
      <div className="flex-1 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 p-4">
        <div className="grid grid-cols-3 gap-2">
          <ProgressDashboard
            trigger={
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <BarChart3Icon className="h-4 w-4" />
                進捗
              </Button>
            }
          />
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

      {/* ピン投稿ボタン（右側に配置） */}
      {onPinButtonClick && (
        <Button
          onClick={handlePinButtonClick}
          disabled={isPinButtonDisabled}
          className="bg-ut-orange-500 hover:bg-ut-orange-600 text-white rounded-full p-6 shadow-lg min-w-[56px] min-h-[56px]"
          size="icon"
        >
          <PlusIcon className="h-16 w-16" />
        </Button>
      )}
    </div>
  );
}
