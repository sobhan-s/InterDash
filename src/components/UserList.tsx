import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, Mail, Building, Phone, Globe, Info } from 'lucide-react';

interface UserListProps {
  theme: string;
  counter: number;
  users?: any[];
  posts?: any[];
  globalSearchQuery?: string;
  onUserClick?: (user: any) => void;
}

const UserList = ({
  theme,
  counter,
  users,
  posts,
  globalSearchQuery,
  onUserClick,
}: UserListProps) => {
  const [sortField, setSortField] = useState('name');

  // ISSUE-056 fix: use stable item id instead of array index
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [hoveredTooltipIndex, setHoveredTooltipIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState({ top: 0, left: 0 });

  const displayUsers = users || [];

  const filteredUsers = displayUsers.filter((u: any) => {
    if (!globalSearchQuery) return true;
    return (
      u.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      u.company?.name?.toLowerCase().includes(globalSearchQuery.toLowerCase())
    );
  });

  const sorted = _.sortBy(filteredUsers, [sortField]);

  // ISSUE-056 fix: look up selected user by id after every sort/filter
  const selectedUser = sorted.find((u: any) => u.id === selectedId) ?? null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users ({sorted.length})
          </CardTitle>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="text-sm border rounded px-2 py-1 bg-background"
            aria-label='Sort Users'
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="username">Username</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-auto space-y-2">
          {sorted.map((user: any, index: number) => (
            <button
              key={user.id}
              // ISSUE-056 fix: highlight keyed to stable user.id, not array index
              className={`relative p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedId === user.id
                  ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => {
                setSelectedId(user.id);
                onUserClick && onUserClick(user);
              }}
              aria-label={`Select user ${user.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedId(user.id);
                  onUserClick && onUserClick(user);
                }
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{user.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Mail className="h-3 w-3" /> {user.email}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Building className="h-3 w-3" /> {user.company?.name} | {user.address?.city}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {user.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" /> {user.website}
                    </span>
                  </div>
                </div>

                <div
                  className="relative shrink-0"
                  role="button"
                  tabIndex={0}
                  aria-label="View user details"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                    }
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    let top = rect.bottom + window.scrollY + 6;
                    if (rect.bottom + 100 > window.innerHeight) {
                      top = rect.top + window.scrollY - 6;
                    }
                    const left = rect.left + window.scrollX + rect.width / 2;
                    setTooltip({ top, left });
                    setHoveredTooltipIndex(index);
                  }}
                  onMouseLeave={() => setHoveredTooltipIndex(null)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  {hoveredTooltipIndex === index &&
                    ReactDOM.createPortal(
                      <div
                        className="absolute z-50 bg-popover border rounded-md shadow-lg p-2 text-xs w-[200px]"
                        style={{ top: tooltip.top, left: tooltip.left, marginTop: '4px' }}
                      >
                        <p className="font-medium mb-1">{user.name}</p>
                        <p>
                          {user.address?.street}, {user.address?.suite}
                        </p>
                        <p>
                          {user.address?.city}, {user.address?.zipcode}
                        </p>
                        <p className="mt-1 text-muted-foreground">
                          lat {user.address?.geo?.lat}, lng {user.address?.geo?.lng}
                        </p>
                      </div>,
                      document.getElementById('tooltip-root')!,
                    )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* ISSUE-056 fix: detail panel uses selectedUser looked up by id */}
        {selectedUser && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">
              {selectedUser.name}'s Posts (
              {(posts || []).filter((p: any) => p.userId === selectedUser.id).length})
            </h4>
            {(posts || [])
              .filter((p: any) => p.userId === selectedUser.id)
              .map((post: any, i: number) => (
                <div key={i} className="py-1.5 border-b border-gray-200 last:border-0">
                  <strong className="text-xs">{post.title}</strong>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {post.body.slice(0, 100)}...
                  </p>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserList;