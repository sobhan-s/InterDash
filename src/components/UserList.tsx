import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Users, Mail, Building, Phone, Globe, Info } from 'lucide-react'

interface UserListProps {
  theme: string
  counter: number
  users?: any[]
  posts?: any[]
  globalSearchQuery?: string
  onUserClick?: (user: any) => void
}

const UserList = ({ theme, counter, users, posts, globalSearchQuery, onUserClick }: UserListProps) => {
  const [sortField, setSortField] = useState('name')

  // ISSUE-056: Selection stored as an array index, not a stable item id.
  // When sortField changes, _.sortBy reorders the array and the index no
  // longer refers to the same user — the highlight silently jumps to a
  // different row (or off the end entirely) without any user action.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)


  // ISSUE-057: Tooltip is positioned at top:'100%', left:0 relative to the
  // row — a fixed offset that never accounts for how close the row is to the
  // bottom or right edge of the viewport. Users near the end of the list see
  // a clipped or fully off-screen tooltip they cannot read.
  const [hoveredTooltipIndex, setHoveredTooltipIndex] = useState<number | null>(null)

  console.log('UserList render', counter)

  const displayUsers = users || []

  const filteredUsers = displayUsers.filter((u: any) => {
    if (!globalSearchQuery) return true
    return u.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      u.company?.name?.toLowerCase().includes(globalSearchQuery.toLowerCase())
  })

  const sorted = _.sortBy(filteredUsers, [sortField])

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
            onChange={(e) => {
              setSortField(e.target.value)
              // ISSUE-056: selectedIndex is NOT reset here — after reorder it
              // points at a completely different user in the new sorted array.
            }}
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
          {sorted.map((user: any, index: number) => (
            <div
              key={index}
              // ISSUE-056: Highlight driven by index — jumps when sort changes
              className={`relative p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedIndex === index
                ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20'
                : 'hover:bg-muted/50'
                }`}
              onClick={() => {
                setSelectedIndex(index)
                onUserClick && onUserClick(user)
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
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {user.phone}</span>
                    <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {user.website}</span>
                  </div>
                </div>

                {/* ISSUE-057: Info icon triggers a tooltip positioned at top:'100%'
                    with no getBoundingClientRect() check. Rows near the bottom of
                    the viewport produce tooltips that render below the fold and
                    are invisible to the user. */}
                <div
                  className="relative shrink-0"
                  onMouseEnter={() => setHoveredTooltipIndex(index)}
                  onMouseLeave={() => setHoveredTooltipIndex(null)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                  {hoveredTooltipIndex === index && (
                    // BUG ISSUE-057: Always positioned below-left; no viewport
                    // boundary check — clipped off-screen for bottom-edge rows.
                    <div
                      className="absolute z-50 bg-popover border rounded-md shadow-lg p-2 text-xs w-[200px]"
                      style={{ top: '100%', left: 0, marginTop: '4px' }}
                    >
                      <p className="font-medium mb-1">{user.name}</p>
                      <p>{user.address?.street}, {user.address?.suite}</p>
                      <p>{user.address?.city}, {user.address?.zipcode}</p>
                      <p className="mt-1 text-muted-foreground">lat {user.address?.geo?.lat}, lng {user.address?.geo?.lng}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedIndex !== null && sorted[selectedIndex] && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">
              {sorted[selectedIndex].name}'s Posts ({(posts || []).filter((p: any) => p.userId === sorted[selectedIndex!].id).length})
            </h4>
            {(posts || []).filter((p: any) => p.userId === sorted[selectedIndex!].id).map((post: any, i: number) => (
              <div key={i} className="py-1.5 border-b border-gray-200 last:border-0">
                <strong className="text-xs">{post.title}</strong>
                <p className="text-[11px] text-muted-foreground mt-0.5">{post.body.slice(0, 100)}...</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UserList
