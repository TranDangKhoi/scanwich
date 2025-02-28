import AppSidebar from "src/app/dashboard/components/app-sidebar";
import DropdownAvatar from "src/app/dashboard/components/dropdown-avatar";
import MobileSidebar from "src/app/dashboard/components/mobile-sidebar";
import { ThemeToggle } from "src/components/ui/theme-toggle";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AppSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <MobileSidebar />
          <div className="relative ml-auto flex-1 md:grow-0">
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
          </div>
          <DropdownAvatar />
        </header>
        {children}
      </div>
    </div>
  );
}
