import ChartWindowLayout from "@/components/chat/ChartWindowLayout";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const HomePage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex">
        <ChartWindowLayout />
      </div>
    </SidebarProvider>
  );
};

export default HomePage;
