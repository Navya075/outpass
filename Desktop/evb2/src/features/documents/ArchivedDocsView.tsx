import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { useDocumentsList } from '@/hooks/useDocuments';
import { StatusBadge } from '@/features/workflow/StatusBadge';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Archive, Eye } from 'lucide-react';

export const ArchivedDocsView: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const { data: documents = [], isLoading } = useDocumentsList(session);

  const archivedDocs = useMemo(() => {
    return documents.filter((d) => d.status === 'archived');
  }, [documents]);

  const getAvatarInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          <Archive className="h-6 w-6 text-amber-600" />
          Archived Files ({archivedDocs.length})
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">Terminal documents soft-deleted from active workflows. Kept for historical audit retention.</p>
      </div>

      {isLoading ? (
        <SkeletonLoader variant="list" count={4} />
      ) : archivedDocs.length === 0 ? (
        <EmptyState title="No Archived Files" description="There are currently no archived documents in the database." />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <Table>
            <TableHeader className="bg-slate-50/70">
              <TableRow className="border-slate-200">
                <TableHead className="w-1/2 text-slate-700 font-semibold">Title</TableHead>
                <TableHead className="text-slate-700 font-semibold">Status</TableHead>
                <TableHead className="text-slate-700 font-semibold">Version</TableHead>
                <TableHead className="text-slate-700 font-semibold">Author</TableHead>
                <TableHead className="text-right text-slate-700 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {archivedDocs.map((doc) => {
                const initials = getAvatarInitials(doc.authorName);
                return (
                  <TableRow key={doc.id} className="border-slate-200 hover:bg-slate-50/60 opacity-80">
                    <TableCell className="font-semibold text-slate-900 max-w-[280px]">
                      <span className="truncate block hover:text-zinc-900 hover:underline cursor-pointer" onClick={() => navigate(`/document/${doc.id}`)}>
                        {doc.title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status="archived" />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">
                      <span className="bg-zinc-100 border border-zinc-300 px-2 py-0.5 rounded-md font-semibold text-zinc-700">
                        v{doc.version}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <span className="text-xs font-medium text-slate-700 truncate max-w-[110px]">
                          {doc.authorName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-slate-900 cursor-pointer"
                        onClick={() => navigate(`/document/${doc.id}`)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
export default ArchivedDocsView;
