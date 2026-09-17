import React from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DocumentStatus } from '@/services/mockDb';
import { Search } from 'lucide-react';

interface DashboardFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  authorFilter: string;
  setAuthorFilter: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  showStatusFilter?: boolean;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  authorFilter,
  setAuthorFilter,
  sortBy,
  setSortBy,
  showStatusFilter = true,
}) => {
  const { session } = useAuth();
  const shouldHideArchived = session?.role === 'author' || session?.role === 'reviewer';

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between py-2">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by title or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 shadow-2xs"
        />
      </div>

      {/* Select filters */}
      <div className="flex flex-wrap items-center gap-2">
        {showStatusFilter && (
          <div className="w-[140px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white border-slate-200 shadow-2xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                {!shouldHideArchived && <SelectItem value="archived">Archived</SelectItem>}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="w-[140px]">
          <Select value={authorFilter} onValueChange={setAuthorFilter}>
            <SelectTrigger className="bg-white border-slate-200 shadow-2xs">
              <SelectValue placeholder="Author" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authors</SelectItem>
              <SelectItem value="alice@example.com">Alice Thorne</SelectItem>
              <SelectItem value="bob@example.com">Bob Jenkins</SelectItem>
              <SelectItem value="admin@example.com">Charlie Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-[160px]">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-white border-slate-200 shadow-2xs">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
              <SelectItem value="updatedAt-asc">Oldest Updated</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              <SelectItem value="version-desc">Highest Version</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
export default DashboardFilters;
