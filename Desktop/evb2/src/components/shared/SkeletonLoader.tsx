import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "rounded-md skeleton-shimmer bg-zinc-800/40",
        className
      )}
    />
  );
};

export const SkeletonLoader: React.FC<{ variant?: 'list' | 'cards' | 'details'; count?: number }> = ({
  variant = 'list',
  count = 3,
}) => {
  const items = Array.from({ length: count });

  if (variant === 'cards') {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((_, i) => (
          <div key={i} className="glass-panel border-border p-6 rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
            <div className="flex items-center justify-between pt-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'details') {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/6" />
        </div>
        <Skeleton className="h-[2px] w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((_, i) => (
        <div key={i} className="glass-panel border-border p-4 rounded-lg flex items-center justify-between">
          <div className="space-y-2 flex-1 max-w-xl">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};
export default SkeletonLoader;
