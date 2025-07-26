import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { HomeIcon, MapPinIcon, MessageCircleIcon } from "lucide-react";

export default function Menu() {
  return (
    <div>
      <Tabs>
        <TabsList>
          <TabsTrigger value="home">
            <HomeIcon />
          </TabsTrigger>
          <TabsTrigger value="spot">
            <MapPinIcon />
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageCircleIcon />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
