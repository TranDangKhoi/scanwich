import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NavItems from "src/app/(guest)/components/nav-items";
import ScanwichLogo from "src/assets/logos/scanwich-logo.png";
import { Button } from "src/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "src/components/ui/sheet";
import { PATH } from "src/constants/path.constants";
export default function NavigationBar() {
  return (
    <>
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href={PATH.HOMEPAGE}
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Image
            src={ScanwichLogo}
            alt="Scanwich Logo"
            width={24}
            height={24}
            quality={100}
          ></Image>
          <span className="sr-only">Scanwich</span>
        </Link>
        <NavItems className="text-muted-foreground transition-colors hover:text-foreground flex-shrink-0" />
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader className="sr-only">
            <SheetTitle />
            <SheetDescription />
          </SheetHeader>
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href={PATH.HOMEPAGE}
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={ScanwichLogo}
                  alt="Scanwich Logo"
                  width={24}
                  height={24}
                  quality={100}
                ></Image>
                <span className="text-xl font-semibold">Scanwich</span>
              </div>
              <span className="sr-only">Scanwich</span>
            </Link>

            <NavItems className="text-muted-foreground transition-colors hover:text-foreground" />
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
