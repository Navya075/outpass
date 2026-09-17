import React from 'react';
import type { Document, UserSession } from '@/services/mockDb';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, FileCheck, Layers, ClipboardList, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface KPICardsProps {
  documents: Document[];
  session: UserSession | null;
}

export const KPICards: React.FC<KPICardsProps> = ({ documents, session }) => {
  const isAuthor = session?.role === 'author';
  const isReviewer = session?.role === 'reviewer';
  const isViewer = session?.role === 'viewer';

  const totalCount = documents.length;
  const publishedCount = documents.filter((d) => d.status === 'published').length;
  const submittedCount = documents.filter((d) => d.status === 'submitted').length;
  const myDraftsCount = documents.filter(
    (d) => d.status === 'draft' && d.authorEmail === session?.email
  ).length;

  const metrics = [
    {
      title: 'Total Accessible Files',
      value: totalCount,
      icon: Layers,
      subtitle: 'System repository total',
      cardBg: 'bg-white border-zinc-200 text-zinc-900 shadow-2xs',
      iconBg: 'bg-zinc-100 text-zinc-900 border-zinc-200 shadow-2xs',
      badgeBg: 'bg-zinc-100 text-zinc-800 font-semibold',
    },
    {
      title: 'Pending Review Queue',
      value: submittedCount,
      icon: ClipboardList,
      subtitle: isReviewer ? 'Action required by you' : 'In review pipeline',
      cardBg: 'bg-white border-zinc-200 text-zinc-900 shadow-2xs',
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200 shadow-2xs',
      badgeBg: 'bg-amber-50 text-amber-800 font-semibold border border-amber-200',
    },
    {
      title: 'Published Specifications',
      value: publishedCount,
      icon: FileCheck,
      subtitle: 'Verified public documents',
      cardBg: 'bg-white border-zinc-200 text-zinc-900 shadow-2xs',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs',
      badgeBg: 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200',
    },
    {
      title: 'My System Drafts',
      value: myDraftsCount,
      icon: FileText,
      subtitle: 'Work-in-progress drafts',
      cardBg: 'bg-white border-zinc-200 text-zinc-900 shadow-2xs',
      iconBg: 'bg-gray-100 text-gray-700 border-gray-300 shadow-2xs',
      badgeBg: 'bg-gray-100 text-gray-700 font-semibold border border-gray-300',
    },
  ];

  const displayedMetrics = isViewer
    ? metrics.filter((m) => m.title === 'Published Specifications')
    : metrics;

  return (
    <div className={`grid gap-5 ${isViewer ? 'grid-cols-1 max-w-md' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
      {displayedMetrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.title}
            className={`rounded-2xl p-6 border shadow-2xs flex flex-col justify-between space-y-4 transition-all duration-200 hover:shadow-xs ${m.cardBg}`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold tracking-wider uppercase opacity-80">{m.title}</span>
                <p className="text-3xl font-extrabold tracking-tight">{m.value}</p>
              </div>
              <div className={`p-3 rounded-xl border ${m.iconBg} shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${m.badgeBg}`}>
                {m.subtitle}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default KPICards;
