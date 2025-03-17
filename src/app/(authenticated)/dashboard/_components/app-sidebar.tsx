"use client";
import { Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import menuItems from "src/app/(authenticated)/dashboard/menu-items";
import ScanwichLogo from "src/assets/logos/scanwich-logo.png";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "src/components/ui/tooltip";
import { PATH } from "src/constants/path.constants";
import { cn } from "src/lib/utils";

export default function AppSidebar() {
  const pathname = usePathname();
  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <Link
            href={PATH.HOMEPAGE}
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Image
              src={ScanwichLogo}
              alt="Scanwich Logo"
              className="transition-all group-hover:scale-110 w-auto h-auto"
            />
            <span className="sr-only">Scanwich</span>
          </Link>

          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip
                delayDuration={150}
                key={index}
              >
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                      {
                        "bg-accent text-accent-foreground": isActive,
                        "text-muted-foreground": !isActive,
                      },
                    )}
                  >
                    <item.Icon className="h-5 w-5" />
                    <span className="sr-only">{item.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={PATH.DASHBOARD_SETTINGS}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8",
                  {
                    "bg-accent text-accent-foreground": pathname === PATH.DASHBOARD_SETTINGS,
                    "text-muted-foreground": pathname !== PATH.DASHBOARD_SETTINGS,
                  },
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Cài đặt</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Cài đặt</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
