import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function H1({ className, ...props }: ComponentProps<'h1'>) {
  return <h1 className={cn('text-2xl font-bold', className)} {...props} />;
}