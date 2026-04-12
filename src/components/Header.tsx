import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bell, Menu, Moon, Sun, Search, Signal } from 'lucide-react';
import { HeaderProps, HeaderSearchResult } from '@/lib/types';

const Header = ({
  theme,
  onThemeToggle,
  user,
  setUser,
  notifications,
  sidebarOpen,
  setSidebarOpen,
  globalSearchQuery,
  setGlobalSearchQuery,
  counter,
}: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState(moment().format('HH:mm:ss'));
  const [searchResults, setSearchResults] = useState<HeaderSearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  // ISSUE-051: showSettingsMenu toggled by button click only.
  // There is no document.addEventListener('mousedown', ...) to close this
  // dropdown when the user clicks anywhere outside it.
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(globalSearchQuery)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format('HH:mm:ss'));
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(globalSearchQuery)
    }, 300)

    return () => clearTimeout(handler)
  }, [globalSearchQuery])


  useEffect(() => {
      if (!debouncedQuery) return;
    
      const controller = new AbortController(); 
    
      fetch(`https://jsonplaceholder.typicode.com/posts?q=${debouncedQuery}`, {
        signal: controller.signal, 
      })
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data);
          setShowDropdown(true);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') console.error(err);
        });
    
      return () => controller.abort(); 
    }, [debouncedQuery]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        showDropdown &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setShowDropdown(false);
      }

      if (
        showNotifPanel &&
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setShowNotifPanel(false);
      }

      if (showSettingsMenu && settingsRef.current && !settingsRef.current.contains(target)) {
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [showDropdown, showNotifPanel, showSettingsMenu]);

  useEffect(() => {
    if (searchResults.length > 0) {
      const MAX_HISTORY = 50; 
      const existing = JSON.parse(localStorage.getItem('searchCache') || '[]');
      existing.push({ query: globalSearchQuery, results: searchResults, time: Date.now() });
      localStorage.setItem('searchCache', JSON.stringify(existing.slice(-MAX_HISTORY)));
    }
  }, [searchResults]);

  return (
    <header
      className={`flex justify-between items-center px-5 py-2.5 border-b h-[60px] ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'}`}
    >
      <div className="flex items-center gap-2.5">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label='Toggle sidebar'>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="m-0 text-lg font-bold">InternDash</h1>
        <span className="text-xs text-muted-foreground">{currentTime}</span>
      </div>

      <div className="relative" ref={searchContainerRef}>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
             role="combobox"
            aria-expanded={showDropdown}
            aria-controls="search-listbox"
            aria-autocomplete="list"

            onKeyDown={(e) => {
              const items = document.querySelectorAll('[role="option"]');

              if (e.key === 'ArrowDown') {
                e.preventDefault();
                (items[0] as HTMLElement)?.focus();
              }
            }}
            placeholder="Search everything..."
            className="pl-9 w-[300px]"
          />
        </div>
        {showDropdown && searchResults.length > 0 && (
          <div id="search-listbox" role="listbox" className="absolute top-full left-0 right-0 bg-white border border-gray-200 max-h-[200px] overflow-auto z-100 rounded-md shadow-lg">
            {searchResults.map((result: HeaderSearchResult, idx: number) => (
              <button
                key={idx}
                role='option'
                tabIndex={0}
                onKeyDown={(e) => { 
                  if (e.key === 'Enter') {
                    setShowDropdown(false);
                  }
                }}
                className="p-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 text-sm"
                onClick={() => {
                  setShowDropdown(false);
                }}
                aria-label={`Search result ${result.title}`}
              >
                {result.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onThemeToggle} aria-label='Toggle theme'>
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <div className="relative" ref={notificationsRef}>
          <button 
          className="cursor-pointer" 
          onClick={() => setShowNotifPanel(!showNotifPanel)} 
            aria-haspopup="true"
            aria-expanded={showNotifPanel}
            aria-label='Open notifications'
            >
            <Bell className="h-5 w-5" />
            <Badge
              className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center text-[10px] p-0"
              variant="destructive"
            >
              {notifications.length}
            </Badge>
          </button>
          {showNotifPanel && (
            <div
              className={`absolute top-full right-0 z-50 mt-2 max-h-75 w-75 overflow-auto rounded-md border shadow-lg ${theme === 'dark'
                ? 'border-gray-700 bg-gray-800 text-gray-100'
                : 'border-gray-200 bg-white text-gray-900'
                }`}
            >
              <div
                className={`p-3 border-b font-semibold text-sm ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}
              >
                Notifications ({notifications.length})
              </div>
              {notifications.map((notif, i: number) => (
                <button
                  key={i}
                  className={`cursor-pointer p-2 text-xs border-b ${theme === 'dark'
                    ? 'border-gray-700 hover:bg-gray-700/60'
                    : 'border-gray-100 hover:bg-gray-50'
                    }`}
                >
                  <div>{notif.body?.slice(0, 80)}</div>
                  {/* ISSUE-052: #aaa on #fff ≈ 2.3:1 contrast — fails WCAG AA */}
                  <div className="mt-1 text-foreground bg-muted">{notif.email}</div>
                  <div className="text-[10px] text-muted-foreground bg-muted">just now</div>
                </button>
              ))}
              <div className="p-2 text-center">
                <Button variant="ghost" size="sm" className="text-xs">
                  Mark all as read
                </Button>
              </div>
            </div>
          )}
        </div>
        {/* ISSUE-051: Settings dropdown — only toggle-closes via button click.
            No document event listener is added to dismiss it when the user
            clicks anywhere outside the menu, so it stays open indefinitely. */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="text-xs px-2 py-1 rounded border hover:bg-muted transition-colors"
            aria-haspopup="menu"
            aria-expanded={showSettingsMenu}
          >
            ⚙ Settings
          </button>
          {showSettingsMenu && (
            <div 
            role='menu'
            className="absolute top-full right-0 mt-1 w-[180px] rounded-md shadow-lg border z-50 bg-popover">
              {[
                { label: 'Account', status: 'Active' },
                { label: 'Preferences', status: 'Default' },
                { label: 'Integrations', status: 'None' },
                { label: 'Billing', status: 'Free tier' },
                { label: 'Sign out', status: '' },
              ].map((item) => (
                <button
                  key={item.label}
                  role='menuitem'
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                  onClick={() => {
                    setShowSettingsMenu(false);
                  }}
                  aria-label={item.label}
                >
                  <div className="text-[13px] text-foreground bg-background">{item.label}</div>
                  {item.status && (
                    <div className="text-[11px] text-muted-foreground bg-muted">{item.status}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-xs text-muted-foreground">Counter: {counter}</span>
      </div>
    </header>
  );
};

export default Header;
