import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { List } from 'lucide-react'

interface VirtualizedFeedProps {
  items: any[]
  counter: number
  itemHeight?: number
  visibleCount?: number
}

// ISSUE-060: Two scroll-related bugs co-exist in this component.
//
// Bug A — scroll position reset:
//   The useEffect below runs whenever `items` or `counter` changes and forcibly
//   sets scrollTop back to 0. Any scroll position the user had is lost on every
//   poll cycle. The fix is to capture the current offset before the update and
//   restore it after, or to stop resetting it altogether.
//
// Bug B — index-keyed rows:
//   Visible rows are keyed by their array index (startIndex + i). When the
//   data array is sorted or filtered the indices of existing items change, so
//   React unmounts and remounts every visible row instead of reusing them.
//   Rows should be keyed by a stable item identifier (e.g. item.id).
const VirtualizedFeed = ({
  items,
  counter,
  itemHeight = 56,
  visibleCount = 8,
}: VirtualizedFeedProps) => {
  const [scrollTop, setScrollTop] = useState(0)

  // Natively handle scroll bounds to prevent gap without relying on useLayoutEffect
  const maxScrollTop = Math.max(0, items.length * itemHeight - visibleCount * itemHeight)
  const clampedScrollTop = Math.min(scrollTop, maxScrollTop)

  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(0, Math.floor(clampedScrollTop / itemHeight) - 1)
  const endIndex = Math.min(startIndex + visibleCount + 3, items.length)
  const visibleItems = items.slice(startIndex, endIndex)
  const offsetY = startIndex * itemHeight

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <List className="h-4 w-4" />
          Activity Feed ({items.length} items)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="relative overflow-auto border rounded bg-muted/20"
          style={{ height: `${visibleCount * itemHeight}px` }}
          onScroll={(e) =>
            setScrollTop((e.target as HTMLDivElement).scrollTop)
          }
        >
          <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
            <div style={{ transform: `translateY(${offsetY}px)` }}>
              {visibleItems.map((item: any, i: number) => {
                const stableKey = item.id ?? item.uuid ?? item.slug ?? item.name ?? `${item.title ?? 'item'}-${item.userId ?? startIndex + i}`
                return (
                  <div
                    key={stableKey}
                    style={{ height: `${itemHeight}px` }}
                    className="flex items-center px-3 border-b text-sm gap-3 bg-background"
                  >
                    <span className="text-muted-foreground text-xs w-8 shrink-0 text-right">
                      {startIndex + i + 1}
                    </span>
                    <span className="truncate flex-1">
                      {item.title || item.name || JSON.stringify(item).slice(0, 70)}
                    </span>
                    {item.userId && (
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        u/{item.userId}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          Rows {startIndex + 1}–{endIndex} of {items.length} visible
        </p>
      </CardContent>
    </Card>
  )
}

export default VirtualizedFeed
