import React from 'react';
import { FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No documents found',
  description = 'Try adjusting your keywords or filters to locate what you are looking for.',
  className,
  action,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 py-16 rounded-xl border border-dashed border-zinc-800/80 bg-zinc-950/10 max-w-md mx-auto",
        className
      )}
    >
      <div className="p-4 bg-zinc-900/60 rounded-full border border-border text-zinc-500 mb-4 shrink-0">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h3 className="text-base font-semibold text-zinc-200 tracking-tight">{title}</h3>
      <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
export default EmptyState;
