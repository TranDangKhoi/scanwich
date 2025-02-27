import { Menu, Package2 } from "lucide-react";
import Link from "next/link";
import NavItems from "src/app/(public)/components/nav-items";
import { Button } from "src/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "src/components/ui/sheet";

export default function NavigationBar() {
  return (
    <>
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
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
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Scanwich</span>
            </Link>

            <NavItems className="text-muted-foreground transition-colors hover:text-foreground" />
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
