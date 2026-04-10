import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Bell, Menu, Moon, Sun, Search } from 'lucide-react'

interface HeaderProps {
  theme: string;
  onThemeToggle: () => void;
  user: any;
  setUser: (user: any) => void;
  notifications: any[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  counter: number;
}

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
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  // ISSUE-051: showSettingsMenu toggled by button click only.
  // There is no document.addEventListener('mousedown', ...) to close this
  // dropdown when the user clicks anywhere outside it.
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement | null>(null)
  const notificationsRef = useRef<HTMLDivElement | null>(null)
  const settingsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format('HH:mm:ss'));
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (globalSearchQuery.length > 0) {
      fetch(`https://jsonplaceholder.typicode.com/posts?q=${globalSearchQuery}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data);
          setShowDropdown(true);
        });
    }
  }, [globalSearchQuery]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node

      if (showDropdown && searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setShowDropdown(false)
      }

      if (showNotifPanel && notificationsRef.current && !notificationsRef.current.contains(target)) {
        setShowNotifPanel(false)
      }

      if (showSettingsMenu && settingsRef.current && !settingsRef.current.contains(target)) {
        setShowSettingsMenu(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [showDropdown, showNotifPanel, showSettingsMenu])

  useEffect(() => {
    if (searchResults.length > 0) {
      const MAX_HISTORY = 50; //added the search cache for last 50 entries
      const existing = JSON.parse(localStorage.getItem('searchCache') || '[]');
      existing.push({ query: globalSearchQuery, results: searchResults, time: Date.now() });
      localStorage.setItem('searchCache', JSON.stringify(existing.slice(-MAX_HISTORY)));
      //console.log('Search cache size:', JSON.stringify(existing).length, 'bytes')
    }
  }, [searchResults]);

  console.log('Header rendering', counter);

  return (
    <header
      className={`flex justify-between items-center px-5 py-2.5 border-b h-[60px] ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'}`}
    >
      <div className="flex items-center gap-2.5">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
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
            placeholder="Search everything..."
            className="pl-9 w-[300px]"
          />
        </div>
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 max-h-[200px] overflow-auto z-100 rounded-md shadow-lg">
            {searchResults.map((result: any, idx: number) => (
              <div
                key={idx}
                className="p-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 text-sm"
                onClick={() => {
                  console.log(result);
                  setShowDropdown(false);
                }}
              >
                {result.title}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onThemeToggle}>
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <div className="relative" ref={notificationsRef}>
          <div className="cursor-pointer" onClick={() => setShowNotifPanel(!showNotifPanel)}>
            <Bell className="h-5 w-5" />
            <Badge
              className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center text-[10px] p-0"
              variant="destructive"
            >
              {notifications.length}
            </Badge>
          </div>
          {showNotifPanel && (
            <div className="absolute top-full right-0 w-[300px] bg-white border border-gray-200 rounded-md shadow-lg z-200 mt-2 max-h-[300px] overflow-auto">
              <div className="p-3 border-b font-semibold text-sm">
                Notifications ({notifications.length})
              </div>
              {notifications.map((notif: any, i: number) => (
                <div
                  key={i}
                  className="p-2 border-b border-gray-100 text-xs hover:bg-gray-50 cursor-pointer"
                >
                  //fix the contrast issues
                  <div>{notif.body?.slice(0, 80)} </div>
                  {/* ISSUE-052: #aaa on #fff ≈ 2.3:1 contrast — fails WCAG AA */}
                  <div style={{ color: '#aaa', backgroundColor: '#fff' }} className="mt-1">
                    {notif.email}
                  </div>
                  <div style={{ color: '#bbb', fontSize: '10px' }}>just now</div>
                </div>
              ))}
              <div className="p-2 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => console.log('TODO: mark read')}
                >
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
          >
            ⚙ Settings
          </button>
          {showSettingsMenu && (
            <div
              className="absolute top-full right-0 mt-1 w-[180px] rounded-md shadow-lg border z-50"
              style={{ backgroundColor: '#ffffff' }}
            >
              {/* ISSUE-052: Hardcoded low-contrast color pairs on menu items.
                  Label text uses #bbb on #fff (contrast ratio ≈ 1.9:1, below
                  the WCAG AA minimum of 4.5:1 for normal-size text).
                  Status and caption lines use #c0c0c0 on #f8f8f8 — similarly
                  failing contrast requirements. */}
              {[
                { label: 'Account', status: 'Active' },
                { label: 'Preferences', status: 'Default' },
                { label: 'Integrations', status: 'None' },
                { label: 'Billing', status: 'Free tier' },
                { label: 'Sign out', status: '' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                  onClick={() => {
                    console.log(item.label);
                    setShowSettingsMenu(false);
                  }}
                >
                  <div style={{ color: '#bbb', fontSize: '13px' }}>{item.label}</div>
                  {item.status && (
                    <div style={{ color: '#c0c0c0', fontSize: '11px', backgroundColor: '#f8f8f8' }}>
                      {item.status}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ISSUE-052: Notification item timestamps rendered with #aaa on #fff */}
        <span className="text-xs text-muted-foreground">Counter: {counter}</span>
      </div>
    </header>
  );
};

export default Header;
