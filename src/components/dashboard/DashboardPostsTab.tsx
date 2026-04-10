import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { SortOrder, DashboardPostsTabProps } from '../../lib/types';

const DashboardPostsTab = ({
  filterText,
  onFilterTextChange,
  sortOrder,
  onSortOrderChange,
  page,
  onPageChange,
  getPaginatedData,
  totalPages,
  getSortedAndFilteredPosts,
}: DashboardPostsTabProps) => {
  const sortedPosts = getSortedAndFilteredPosts();
  const paginatedPosts = getPaginatedData(sortedPosts);
  const pageCount = totalPages(sortedPosts);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Posts</h2>

      {filterText && (
        <div className="text-sm text-muted-foreground">
          Filtering by: <span className="font-medium">{filterText}</span>
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={filterText}
          onChange={(e) => onFilterTextChange(e.target.value)}
          placeholder="Filter posts..."
          className="max-w-[300px]"
        />
        <select
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
          className="border rounded px-2 py-1 text-sm bg-background"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="space-y-2">
        {paginatedPosts.map((post: any) => (
          <Card key={post.id}>
            <CardContent className="p-3">
              <h4 className="font-semibold text-sm">{post.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{post.body}</p>
              <div className="text-[11px] text-muted-foreground mt-1">
                Post ID: {post.id} | User: {post.userId}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Prev
        </Button>
        <span className="text-sm">
          Page {page} of {pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DashboardPostsTab;
