import DropdownAvatar from "src/app/(authenticated)/dashboard/_components/dropdown-avatar";
import NavigationBar from "src/app/(guest)/(auth)/login/components/navigation-bar";
import { ThemeToggle } from "src/components/ui/theme-toggle";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <NavigationBar />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <DropdownAvatar />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
    </div>
  );
}
