import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";
import { ReloadIcon } from "@radix-ui/react-icons";

export function LoadingButton({
  buttonText,
  className,
  variant,
}: {
  buttonText?: string;
  className?: string;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "link"
    | "ghost";
}) {
  return (
    <Button variant={variant} className={cn(className)} disabled>
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      {buttonText}
    </Button>
  );
}
