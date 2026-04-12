import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search } from 'lucide-react';
import type { SearchFilterProps, SearchableItem, SearchHistoryEntry } from '@/lib/types';

const SearchFilterComponent = ({ data, onFilter, theme }: SearchFilterProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchableItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);
  const [displayValue, setDisplayValue] = useState('');

  
  const regexHelper = useCallback((str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }, []);

  
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(displayValue.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [displayValue]);

  
  useEffect(() => {
    if (query) {
      const lower = query.toLowerCase();

      const filtered = (data || []).filter((item: SearchableItem) => {
        const str = JSON.stringify(item).toLowerCase();
        return str.includes(lower);
      });

      setResults(filtered);

      if (onFilter) onFilter(filtered);

      const entry = { query, resultCount: filtered.length, time: Date.now() };
      const MAX_HISTORY = 50;
      setSearchHistory((prev) => [...prev, entry].slice(-MAX_HISTORY));

      const saved = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      const next = [...saved, entry];
      localStorage.setItem('searchHistory', JSON.stringify(next.slice(-MAX_HISTORY)));
    } else {
      setResults([]);
    }
  }, [query, data, onFilter]);

  const regexSearch = useCallback(
    (q: string) => {
      try {
        const safeQuery = regexHelper(q);
        const regex = new RegExp(safeQuery, 'i');

        return (data || []).filter((item: SearchableItem) =>
          regex.test(JSON.stringify(item))
        );
      } catch {
        return [];
      }
    },
    [data, regexHelper]
  );

  useEffect(() => {
    if (query.length > 2) {
      regexSearch(query);
    }
  }, [query, regexSearch]);

  
  const highlightText = useCallback(
    (text: string) => {
      if (!query) return text;

      const safe = regexHelper(query);
      const regex = new RegExp(`(${safe})`, 'gi');

      const parts = text.split(regex);

      return parts.map((part, i) =>
        regex.test(part) ? <mark key={i}>{part}</mark> : part
      );
    },
    [query, regexHelper]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDisplayValue(e.target.value);
    },
    []
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search & Filter
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            type="text"
            value={displayValue}
            onChange={handleChange}
            placeholder="Search across all data..."
            className="pl-9 text-base"
          />
        </div>

        <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
          {query && <Badge variant="outline">Found {results.length} results</Badge>}
          {searchHistory.length > 0 && (
            <Badge variant="secondary">
              History: {searchHistory.length} queries
            </Badge>
          )}
        </div>

        <div className="max-h-[300px] overflow-auto mt-2">
          {results.slice(0, 50).map((item: SearchableItem, index: number) => {
            const text =
              item.title ||
              item.name ||
              item.body ||
              JSON.stringify(item).slice(0, 100);

            return (
              <div
                key={index}
                className="px-2 py-1.5 border-b border-gray-100 text-xs hover:bg-muted/50"
              >
                {highlightText(text)}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(SearchFilterComponent);