import { AnimatedGridPattern } from "src/components/magicui/animated-grid-pattern";
import { cn } from "src/lib/utils";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <AnimatedGridPattern
        numSquares={60}
        maxOpacity={0.25}
        duration={2}
        repeatDelay={0.2}
        className={cn(
          "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
          "inset-x-0 h-[140%] skew-y-12",
        )}
      />
      {children}
    </section>
  );
}
