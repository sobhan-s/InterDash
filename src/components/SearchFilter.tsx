import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search } from 'lucide-react';

interface SearchFilterProps {
  data: any[];
  onFilter?: (result: any[]) => void;
  theme: string;
  counter: number;
}

const SearchFilter = ({ data, onFilter, theme, counter }: SearchFilterProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // ISSUE-058: displayValue controls the input's visible text.
  // The onChange handler updates it immediately, then a setTimeout fires and
  // calls setDisplayValue a second time with the same value. That second
  // setState schedules a fresh render; React re-applies the controlled value
  // prop to the DOM input element, which resets the cursor to the end of the
  // string — even if the user was typing in the middle of the text.
  const [displayValue, setDisplayValue] = useState('');

  console.log('SearchFilter render', counter);

  useEffect(() => {
    if (query) {
      const filtered = (data || []).filter((item: any) => {
        const str = JSON.stringify(item).toLowerCase();
        return str.includes(query.toLowerCase());
      });
      setResults(filtered);
      onFilter && onFilter(filtered);

      setSearchHistory((prev) => [
        ...prev,
        { query, resultCount: filtered.length, time: Date.now() },
      ]);
      const MAX_HISTORY = 50; //added the search history for last 50 entries
      const saved = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      const next = [...saved, { query, resultCount: filtered.length, time: Date.now() }];
      localStorage.setItem('searchHistory', JSON.stringify(next.slice(-MAX_HISTORY)));
    } else {
      setResults([]);
    }
  }, [query, data]);

  const regexSearch = (q: string) => {
    try {
      const regex = new RegExp(q, 'i');
      return (data || []).filter((item: any) => regex.test(JSON.stringify(item)));
    } catch (e) {
      return [];
    }
  };

  useEffect(() => {
    if (query.length > 2) {
      const regexResults = regexSearch(query);
      console.log('Regex search found', regexResults.length, 'results');
    }
  }, [query, counter]);

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
          {/* ISSUE-058: Input is controlled by displayValue.
              onChange updates displayValue immediately (so the character
              appears), then a setTimeout re-calls setDisplayValue with the
              same string. That second setState triggers a new render which
              re-applies the value prop to the DOM node — moving the cursor
              to the end of the string regardless of where the caret was.
              Typing in the middle of a word is broken: each keystroke
              teleports the cursor to the rightmost position. */}
          <Input
            type="text"
            value={displayValue}
            onChange={(e) => {
              const val = e.target.value;
              setDisplayValue(val); // immediate echo
              setTimeout(() => {
                setDisplayValue(val); // BUG: redundant setState resets cursor
                setQuery(val); // triggers search
              }, 0);
            }}
            placeholder="Search across all data..."
            className="pl-9 text-base"
          />
        </div>
        <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
          {query && <Badge variant="outline">Found {results.length} results</Badge>}
          {searchHistory.length > 0 && (
            <Badge variant="secondary">History: {searchHistory.length} queries</Badge>
          )}
        </div>
        <div className="max-h-[300px] overflow-auto mt-2">
          {results.slice(0, 50).map((item: any, index: number) => (
            <div
              key={index}
              className="px-2 py-1.5 border-b border-gray-100 text-xs hover:bg-muted/50"
            >
              //fix the xss issue
              <span>
                {item.title ||
                  item.name ||
                  item.body ||
                  JSON.stringify(item)
                    .slice(0, 100)
                    .replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>')}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilter;
