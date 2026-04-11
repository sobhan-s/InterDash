import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { List } from 'lucide-react'

interface VirtualizedFeedProps {
  items: any[]
  counter: number
  itemHeight?: number
  visibleCount?: number
}

const VirtualizedFeedComponent = ({
  items,
  counter,
  itemHeight = 56,
  visibleCount = 8,
}: VirtualizedFeedProps) => {
  const [scrollTop, setScrollTop] = useState(0)

  const maxScrollTop = Math.max(0, items.length * itemHeight - visibleCount * itemHeight)
  const clampedScrollTop = Math.min(scrollTop, maxScrollTop)

  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(0, Math.floor(clampedScrollTop / itemHeight) - 1)
  const endIndex = Math.min(startIndex + visibleCount + 3, items.length)
  const visibleItems = items.slice(startIndex, endIndex)
  const offsetY = startIndex * itemHeight


  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

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
          onScroll={handleScroll}
        >
          <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
            <div style={{ transform: `translateY(${offsetY}px)` }}>
              {visibleItems.map((item: any, i: number) => {
                const stableKey =
                  item.id ??
                  item.uuid ??
                  item.slug ??
                  item.name ??
                  `${item.title ?? 'item'}-${item.userId ?? startIndex + i}`

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

export default React.memo(VirtualizedFeedComponent)