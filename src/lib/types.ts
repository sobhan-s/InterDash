import React from 'react';

export type SortOrder = 'asc' | 'desc';

export interface User {
  id: number;
  name?: string;
  username?: string;
  email?: string;
  [key: string]: unknown;
}

export interface Post {
  id: number;
  userId?: number;
  title: string;
  body: string;
  [key: string]: unknown;
}

export interface Todo {
  id: number;
  userId?: number;
  title: string;
  completed: boolean;
  [key: string]: unknown;
}

export interface Comment {
  id: number;
  postId: number;
  name?: string;
  email?: string;
  body?: string;
  [key: string]: unknown;
}

export interface Album {
  id: number;
  userId?: number;
  title?: string;
  [key: string]: unknown;
}

export interface Photo {
  id: number;
  albumId?: number;
  title?: string;
  url?: string;
  thumbnailUrl?: string;
  [key: string]: unknown;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price?: number;
  [key: string]: unknown;
}

export interface WeatherData {
  name: string;
  lat: number;
  lon: number;
  weather: unknown;
}

export interface DashboardProps {
  theme: string;
  user: User;
  notifications: unknown[];
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  sidebarOpen: boolean;
  getFilteredData: (data: unknown[], query: string) => unknown[];
  appData: unknown;
  setAppData: (data: unknown) => void;
  handleThemeToggle: () => void;
  counter:number;
}

export interface DashboardModalProps {
  open: boolean;
  content: unknown;
  onClose: () => void;
}

export interface DashboardOverviewTabProps {
  theme: string;
  counter: number;
  globalSearchQuery: string;
  lastUpdated: string | null;
  cryptoData: CryptoData[];
  weatherData: WeatherData[];
  users: User[];
  posts: Post[];
  todos: Todo[];
  comments: Comment[];
  albums: Album[];
  photos: Photo[];
  formData: Record<string, unknown>;
  validationErrors: Record<string, string>;
  onSelectItem: (item: unknown) => void;
  onOpenModal: (content: unknown) => void;
  onAddTodo: (text: string) => void;
  onDeleteTodo: (id: number) => void;
  onToggleTodo: (id: number) => void;
  onEditTodo: (id: number, text: string) => void;
  onProfileFieldChange: (field: string, value: unknown) => void;
  onProfileSave: () => void;
  getSortedAndFilteredPosts: () => Post[];
}

export interface DashboardPostsTabProps {
  filterText: string;
  onFilterTextChange: (value: string) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (value: SortOrder) => void;
  page: number;
  onPageChange: (page: number) => void;
  getPaginatedData: (data: Post[]) => Post[];
  totalPages: (data: Post[]) => number;
  getSortedAndFilteredPosts: () => Post[];
}

export interface DashboardProfileFormProps {
  formData: Record<string, unknown>;
  validationErrors: Record<string, string>;
  onFieldChange: (field: string, value: unknown) => void;
  onSave: () => void;
}

export interface UseDashboardDataOptions {
  theme: string;
  refreshCount: number;
}

export interface UseDashboardStateOptions {
  posts: Post[];
  todos: Todo[];
  users: User[];
  comments: Comment[];
  photos: Photo[];
  albums: Album[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  addToast: (message: string, type?: 'info' | 'success' | 'error') => void;
}
