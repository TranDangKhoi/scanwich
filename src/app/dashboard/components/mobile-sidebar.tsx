"use client";
import menuItems from "src/app/dashboard/menu-items";
import { Button } from "src/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "src/components/ui/sheet";
import { cn } from "src/lib/utils";
import { PanelLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import ScanwichLogo from "src/assets/logos/scanwich-logo.png";
import { PATH } from "src/constants/path.constants";

export default function MobileSidebar() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="sm:hidden"
        >
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="sm:max-w-xs"
      >
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href={PATH.DASHBOARD}
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Image
              src={ScanwichLogo}
              alt="Scanwich Logo"
              width={20}
              height={20}
              className="transition-all group-hover:scale-110"
            />
            <span className="sr-only">Scanwich</span>
          </Link>
          {menuItems.map((Item, index) => {
            const isActive = pathname === Item.href;
            return (
              <Link
                key={index}
                href={Item.href}
                className={cn("flex items-center gap-4 px-2.5  hover:text-foreground", {
                  "text-foreground": isActive,
                  "text-muted-foreground": !isActive,
                })}
              >
                <Item.Icon className="h-5 w-5" />
                {Item.title}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
