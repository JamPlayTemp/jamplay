import { ArrowLeft } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import { Button } from '@/shared/ui/button';
import type { ButtonProps } from '@/shared/ui/button/button';
import { cn } from '@/shared/lib/utils';

interface BackButtonProps extends Omit<ButtonProps, 'children'> {
  label?: string;
}

export function BackButton({
  label = '',
  onClick,
  className,
  ...props
}: BackButtonProps) {
  const router = useRouter();
  const handleClick = onClick ?? (() => router.history.back());

  return (
    <Button
      variant="default"
      onClick={handleClick}
      {...props}
      className={cn('inline-flex items-center gap-1.5 p-2 rounded hover:bg-gray-100', className)}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
