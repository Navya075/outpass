import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/useAuth';
import { useDocumentsList } from '@/hooks/useDocuments';
import { StatusBadge } from '@/features/workflow/StatusBadge';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-provider';
import { BookCheck, ArrowRight, Search, Bookmark, Download, Clock, Lock } from 'lucide-react';

export const PublishedDocsView: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: documents = [], isLoading } = useDocumentsList(session);

  const [search, setSearch] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const publishedDocs = useMemo(() => {
    return documents.filter((d) => d.status === 'published');
  }, [documents]);

  const filteredDocs = useMemo(() => {
    if (!search.trim()) return publishedDocs;
    const q = search.toLowerCase();
    return publishedDocs.filter((d) => d.title.toLowerCase().includes(q) || d.body.toLowerCase().includes(q));
  }, [publishedDocs, search]);

  const toggleBookmark = (id: string, title: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast({ title: 'Bookmark Removed', description: `Unbookmarked "${title}".`, type: 'info' });
      } else {
        next.add(id);
        toast({ title: 'Bookmarked', description: `Saved "${title}" to your bookmarks.`, type: 'success' });
      }
      return next;
    });
  };

  const handleDownload = (title: string, body: string, version: number) => {
    const blob = new Blob([`TITLE: ${title}\nVERSION: v${version}\n\n${body}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-v${version}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Download Started', description: `Downloading text file for "${title}".`, type: 'success' });
  };

  const getAvatarInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const calculateReadingTime = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 40));
    return `${minutes} min read`;
  };

  return (
    <motion.div 
      className="w-full px-8 py-8 space-y-6 bg-[#F5F7FB]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#111827] flex items-center gap-2.5">
            <BookCheck className="h-6 w-6 text-[#059669]" />
            Published Knowledge Library
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">Approved, locked policies and specifications (Confluence-style read-only catalogue).</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold shadow-2xs">
          <Lock className="h-3.5 w-3.5" />
          <span>Read-Only Specifications</span>
        </div>
      </div>

      {/* Prominent Search Bar */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-[#64748B]" />
        <Input
          placeholder="Search published library specs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11 bg-white border-[#E2E8F0] text-[#111827] shadow-2xs h-11 rounded-2xl text-sm placeholder:text-[#64748B]"
        />
      </div>

      {isLoading ? (
        <SkeletonLoader variant="cards" count={6} />
      ) : filteredDocs.length === 0 ? (
        <EmptyState title="No Published Specifications" description="No published documents match your search criteria." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc) => {
            const initials = getAvatarInitials(doc.authorName);
            const readTime = calculateReadingTime(doc.body);
            const isBookmarked = bookmarkedIds.has(doc.id);

            return (
              <motion.div
                key={doc.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.15 }}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <StatusBadge status="published" />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#64748B] flex items-center gap-1 font-mono font-medium">
                        <Clock className="h-3 w-3" />
                        {readTime}
                      </span>
                      <span className="font-mono text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                        v{doc.version}
                      </span>
                    </div>
                  </div>

                  <h3 
                    className="text-base font-bold text-[#111827] hover:text-zinc-900 hover:underline cursor-pointer transition-colors line-clamp-1"
                    onClick={() => navigate(`/document/${doc.id}`)}
                  >
                    {doc.title}
                  </h3>

                  <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed font-sans min-h-[50px]">
                    {doc.body}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <span className="text-xs font-bold text-[#111827] truncate max-w-[100px]">
                      {doc.authorName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleBookmark(doc.id, doc.title)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isBookmarked ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700'
                      }`}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Specification'}
                    >
                      <Bookmark className="h-3.5 w-3.5 fill-current" />
                    </button>

                    <button
                      onClick={() => handleDownload(doc.title, doc.body, doc.version)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                      title="Download Specification (.txt)"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>

                    <Button
                      size="sm"
                      onClick={() => navigate(`/document/${doc.id}`)}
                      className="h-8 px-3 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer ml-1"
                    >
                      <span>Read</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
export default PublishedDocsView;
