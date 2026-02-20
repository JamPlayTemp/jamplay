import { ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/shared/ui/button";
import type { ButtonProps } from "@/shared/ui/button/button";

interface BackButtonProps extends Omit<ButtonProps, "children"> {
  label?: string;
}

export function BackButton({ label = "", onClick, ...props }: BackButtonProps) {
  const router = useRouter();
  const handleClick = onClick ?? (() => router.history.back());

  return (
    <Button variant="default" onClick={handleClick} {...props}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
