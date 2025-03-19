import DropdownAvatar from "src/app/(authenticated)/dashboard/_components/dropdown-avatar";
import NavigationBar from "src/app/(guest)/(auth)/login/components/navigation-bar";
import { ThemeToggle } from "src/components/ui/theme-toggle";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/75 px-4 md:px-6">
        <NavigationBar />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
    </div>
  );
}
