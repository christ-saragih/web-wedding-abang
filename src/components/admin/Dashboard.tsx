import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuestManager from "./GuestManager";
import TemplateManager from "./TemplateManager";

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto">
      <Tabs defaultValue="guests" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="guests">Tamu Undangan</TabsTrigger>
            <TabsTrigger value="templates">Template Chat</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="guests">
          <GuestManager />
        </TabsContent>
        <TabsContent value="templates">
          <TemplateManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
