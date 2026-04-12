import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, Mail, Building, Phone, Globe, Info } from 'lucide-react';
import { API_ENDPOINTS } from '../utils/constants';
import type { DetailedUser, Post, UserListProps } from '@/lib/types';

const UserListComponent = ({
  users: propUsers,
  posts: propPosts,
  globalSearchQuery,
  onUserClick,
}: UserListProps) => {
  const [users, setUsers] = useState<DetailedUser[]>(propUsers || []);
  const [posts, setPosts] = useState<Post[]>(propPosts || []);
  const [sortField, setSortField] = useState('name');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (propUsers && propUsers.length > 0) return;
    const cancel=new AbortController();
    fetch(API_ENDPOINTS.users,{signal:cancel.signal})
      .then((r) => r.json())
      .then((data) => setUsers(data))
      .catch((error) => {if(!cancel.signal.aborted){
        console.error('Failed to fetch users',error)
      } });
      return ()=>cancel.abort();
  }, [propUsers]);

  useEffect(() => {
    if (propPosts && propPosts.length > 0) return;
    const cancel=new AbortController();
    fetch(API_ENDPOINTS.posts,{signal:cancel.signal})
      .then((r) => r.json())
      .then((data) => setPosts(data))
      .catch((error) => {if(!cancel.signal.aborted){
        console.error('Failed to fetch posts',error)
      } });
      return ()=>cancel.abort();
  }, [propPosts]);


  const filteredUsers = useMemo(() => {
    if (!globalSearchQuery) return users;
    const q = globalSearchQuery.toLowerCase();

    return users.filter((u: DetailedUser) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.company?.name?.toLowerCase().includes(q)
    );
  }, [users, globalSearchQuery]);

  const sorted = useMemo(() => [...filteredUsers].sort((a, b) => {
    const aVal = String((a as any)[sortField] ?? '').toLowerCase();
    const bVal = String((b as any)[sortField] ?? '').toLowerCase();
    return aVal.localeCompare(bVal);
  }), [filteredUsers, sortField]);

  const selectedUser = useMemo(
    () => sorted.find((u: any) => u.id === selectedId) ?? null,
    [sorted, selectedId]
  );

  const tooltipRoot = document.getElementById('tooltip-root') || document.body;


  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(e.target.value);
  }, []);

  const handleUserClick = useCallback((user: any) => {
    setSelectedId(user.id);
    if (onUserClick) onUserClick(user);
  }, [onUserClick]);

  const handleUserKeyDown = useCallback((e: React.KeyboardEvent, user: any) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedId(user.id);
      if (onUserClick) onUserClick(user);
    }
  }, [onUserClick]);

  const handleInfoKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
    }
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent, user: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth=200;
    let top = rect.bottom + window.scrollY + 6;

    if (rect.bottom + 100 > window.innerHeight) {
      top = rect.top + window.scrollY - 110;
    }

    let left = rect.left + window.scrollX + rect.width / 2 -tooltipWidth/2;
    if(left+tooltipWidth>window.innerWidth+window.scrollX){
      left=window.innerWidth+window.scrollX-tooltipWidth-10;
    }
    if(left<window.scrollX){
      left=window.scrollX+10
    }

    setTooltip({ top, left });
    setHoveredUserId(user.id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredUserId(null);
  }, []);

  const handleStopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

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
            onChange={handleSortChange}
            className="text-sm border rounded px-2 py-1 bg-background"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="username">Username</option>
          </select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="max-h-[400px] overflow-auto space-y-2">
          {sorted.map((user: DetailedUser) => (
            <button
              key={user.id}
              className={`relative w-full text-left p-3 border rounded-lg ${selectedId === user.id
                  ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20'
                  : 'hover:bg-muted/50'
                }`}
              onClick={() => handleUserClick(user)}
              onKeyDown={(e) => handleUserKeyDown(e, user)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="font-semibold text-sm">{user.name}</div>

                  <div className="text-xs text-muted-foreground flex gap-1 mt-0.5">
                    <Mail className="h-3 w-3" /> {user.email}
                  </div>

                  <div className="text-xs text-muted-foreground flex gap-1 mt-0.5">
                    <Building className="h-3 w-3" /> {user.company?.name} | {user.address?.city}
                  </div>

                  <div className="text-[11px] text-muted-foreground flex gap-3 mt-0.5">
                    <span className="flex gap-1">
                      <Phone className="h-3 w-3" /> {user.phone}
                    </span>
                    <span className="flex gap-1">
                      <Globe className="h-3 w-3" /> {user.website}
                    </span>
                  </div>
                </div>

                <div
                  className="relative"
                  onMouseEnter={(e) => handleMouseEnter(e, user)}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleStopPropagation}
                  onKeyDown={handleInfoKeyDown}
                >
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />

                  {hoveredUserId === user.id &&
                    ReactDOM.createPortal(
                      <div
                        className="absolute z-50 bg-popover border rounded-md shadow-lg p-2 text-xs w-[200px]"
                        style={{ top: tooltip.top, left: tooltip.left }}
                      >
                        <p className="font-medium mb-1">{user.name}</p>
                        <p>{user.address?.street}, {user.address?.suite}</p>
                        <p>{user.address?.city}, {user.address?.zipcode}</p>
                      </div>,
                      tooltipRoot
                    )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


export default React.memo(UserListComponent);