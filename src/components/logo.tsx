import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <h1 className={cn("font-headline text-center text-4xl md:text-5xl", className)}>
      <span className="font-extrabold text-primary">Mobilemed</span>
      <span className="font-light text-foreground">Password</span>
    </h1>
  );
}
