import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openExternal } from "@/lib/open-external";
import { SUPPORT_LABEL, SUPPORT_URL } from "@/lib/support";

export function SupportButton({
  variant = "outline",
  className,
}: {
  variant?: "outline" | "ghost";
  className?: string;
}) {
  return (
    <Button asChild variant={variant} className={className}>
      <a
        href={SUPPORT_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) =>
          openExternal(
            e,
            "Shfletuesi bllokoi hapjen e Buy Me a Coffee këtu. Linku u kopjua — hapeni në shfletues.",
          )
        }
      >
        <Coffee className="h-4 w-4 shrink-0" /> <span>{SUPPORT_LABEL}</span>
      </a>
    </Button>
  );
}
