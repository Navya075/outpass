import React from 'react';
import type { DocumentStatus } from '@/services/mockDb';
import { cn } from '@/lib/utils';

export type WorkflowKey = 
  | 'create' 
  | 'draft' 
  | 'edit' 
  | 'update' 
  | 'submit' 
  | 'submitted' 
  | 'review' 
  | 'approve' 
  | 'approved' 
  | 'publish' 
  | 'published' 
  | 'reject' 
  | 'rejected' 
  | 'archive' 
  | 'archived' 
  | 'restore' 
  | 'reopen';

export interface WorkflowBadgeStyle {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  className: string;
}

export const WORKFLOW_CONFIG: Record<string, WorkflowBadgeStyle> = {
  create: {
    label: 'Create',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    dot: 'bg-slate-500',
    className: 'bg-slate-100 text-slate-700 border-slate-300',
  },
  draft: {
    label: 'Draft',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    dot: 'bg-gray-500',
    className: 'bg-gray-100 text-gray-700 border-gray-300',
  },
  edit: {
    label: 'Edit',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    dot: 'bg-slate-500',
    className: 'bg-slate-100 text-slate-700 border-slate-300',
  },
  update: {
    label: 'Update',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    dot: 'bg-slate-500',
    className: 'bg-slate-100 text-slate-700 border-slate-300',
  },
  submit: {
    label: 'Submit',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    className: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  submitted: {
    label: 'Submitted',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    className: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  review: {
    label: 'Review',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    dot: 'bg-violet-500',
    className: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  approve: {
    label: 'Approve',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  approved: {
    label: 'Approved',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  publish: {
    label: 'Publish',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  published: {
    label: 'Published',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  reject: {
    label: 'Reject',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  archive: {
    label: 'Archive',
    bg: 'bg-zinc-100',
    text: 'text-zinc-700',
    border: 'border-zinc-300',
    dot: 'bg-zinc-500',
    className: 'bg-zinc-100 text-zinc-700 border-zinc-300',
  },
  archived: {
    label: 'Archived',
    bg: 'bg-zinc-100',
    text: 'text-zinc-700',
    border: 'border-zinc-300',
    dot: 'bg-zinc-500',
    className: 'bg-zinc-100 text-zinc-700 border-zinc-300',
  },
  restore: {
    label: 'Restore',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    dot: 'bg-cyan-500',
    className: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  reopen: {
    label: 'Reopen',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    dot: 'bg-cyan-500',
    className: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
};

export function getWorkflowBadgeStyle(key: string): string {
  const config = WORKFLOW_CONFIG[key.toLowerCase()];
  if (config) {
    return config.className;
  }
  return 'bg-slate-100 text-slate-700 border-slate-300';
}

interface StatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = WORKFLOW_CONFIG[status] || {
    label: status,
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    dot: 'bg-slate-500',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-2xs transition-all",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
