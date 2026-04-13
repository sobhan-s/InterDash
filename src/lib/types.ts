import React from 'react';

export type SortOrder = 'asc' | 'desc';
export type ToastType = 'info' | 'success' | 'error';

export interface User {
  id: number;
  name?: string;
  username?: string;
  email?: string;
  [key: string]: unknown;
}

export interface AppUser {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  token?: string;
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

export interface AppNotification {
  id: number;
  email?: string;
  body?: string;
  [key: string]: unknown;
}

export interface AppDataShape {
  [key: string]: unknown;
}

export interface ErrorLogEntry {
  error: string;
  time: number;
}

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export interface NotificationFetchParams {
  userId?: number;
  theme: string;
}

export interface AppContextValue {
  theme: string;
  user: AppUser | null;
  notifications: AppNotification[];
  counter: number;
  sidebarOpen: boolean;
  globalSearchQuery: string;
  handleThemeToggle: () => void;
  name: React.Dispatch<React.SetStateAction<AppUser | null>>;
  setGlobalSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  addToast: (message: string, type?: ToastType) => void;
}

export interface HeaderSearchResult {
  id?: number;
  title?: string;
  body?: string;
  [key: string]: unknown;
}

export interface HeaderProps {
  theme: string;
  onThemeToggle: () => void;
  user: AppUser | null;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
  notifications: AppNotification[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  counter: number;
}

export interface FooterProps {
  theme: string;
  counter: number;
  notifications: AppNotification[];
}

export interface SearchableItem {
  id?: number;
  title?: string;
  name?: string;
  body?: string;
  [key: string]: unknown;
}

export interface SearchHistoryEntry {
  query: string;
  resultCount: number;
  time: number;
}

export interface SearchFilterProps {
  data: SearchableItem[];
  onFilter?: (result: SearchableItem[]) => void;
  theme: string;
}

export interface CryptoTrackerProps {
  theme: string;
  data?: CryptoData[];
  onSelect?: (item: CryptoData) => void;
}

export interface WeatherCurrent {
  temperature?: number;
  windspeed?: number;
  weathercode?: number;
  [key: string]: unknown;
}

export interface WeatherHourly {
  time?: string[];
  temperature_2m?: number[];
  relative_humidity_2m?: number[];
  wind_speed_10m?: number[];
  [key: string]: unknown;
}

export interface WeatherCityData {
  name: string;
  lat: number;
  lon: number;
  weather?: WeatherCurrent;
  hourly?: WeatherHourly;
  [key: string]: unknown;
}

export interface WeatherWidgetProps {
  theme: string;
  data?: WeatherCityData[];
  onCityClick?: (city: WeatherCityData) => void;
}

export interface UserAddressGeo {
  lat?: string;
  lng?: string;
}

export interface UserAddress {
  street?: string;
  suite?: string;
  city?: string;
  zipcode?: string;
  geo?: UserAddressGeo;
}

export interface UserCompany {
  name?: string;
  catchPhrase?: string;
  bs?: string;
}

export interface DetailedUser extends User {
  phone?: string;
  website?: string;
  address?: UserAddress;
  company?: UserCompany;
}

export interface UserListProps {
  theme: string;
  users?: DetailedUser[];
  posts?: Post[];
  globalSearchQuery?: string;
  onUserClick?: (user: DetailedUser) => void;
}

export interface PostsFeedProps {
  theme: string;
  posts?: Post[];
  comments?: Record<number, Comment[]>;
  onPostClick?: (post: Post) => void;
}

export interface ImageGalleryProps {
  photos?: Photo[];
  theme: string;
}

export interface AnalyticsUserActivity extends DetailedUser {
  postCount: number;
  todoCount: number;
  albumCount: number;
}

export interface AnalyticsStats {
  postsPerUser: Record<string, number>;
  commentsPerPost: Record<string, number>;
  avgWordCount: number;
  calculationTimestamp?: string;
  completionRates: Record<string, string>;
  userActivity: AnalyticsUserActivity[];
  postsChartData: Array<{ name: string; posts: number }>;
  todoChartData: Array<{ name: string; value: number }>;
  commentAuthors: Array<Comment & { postAuthor?: string; postTitle?: string }>;
}

export interface AnalyticsProps {
  posts: Post[];
  users: DetailedUser[];
  todos: Todo[];
  comments: Comment[];
  albums: Album[];
  photos: Photo[];
  theme: string;

}

export interface DataChartProps {
  posts: Post[];
  users: DetailedUser[];
  todos: Todo[];
  comments: Comment[];
  theme: string;
}

export interface FakeReportRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  department: string;
  jobTitle: string;
  salary: number;
  startDate: string;
  address: string;
  city: string;
  country: string;
  bio: string;
}

export interface ReportGeneratorProps {
  posts: Post[];
  users: DetailedUser[];
  theme: string;
}

export interface VirtualizedFeedItem {
  id?: number | string;
  uuid?: string;
  slug?: string;
  name?: string;
  title?: string;
  userId?: number;
  [key: string]: unknown;
}

export interface VirtualizedFeedProps {
  items: VirtualizedFeedItem[];
  itemHeight?: number;
  visibleCount?: number;
}

export interface MathPlaygroundProps {
  theme: string;
}

export interface Album {
  id: number;
  userId?: number;
  title?: string;
  [key: string]: unknown;
}

export interface Photo {
  id: number
  thumbnailUrl: string
  url: string
  title: string
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price?: number;
  market_cap?: number;
  price_change_percentage_24h?: number;
  [key: string]: unknown;
}

export interface WeatherData {
  name: string;
  lat: number;
  lon: number;
  weather: WeatherCurrent;
  [key: string]: unknown;
}

export interface DashboardProps {
  theme?: string;
  user: AppUser | null;
  notifications: unknown[];
  globalSearchQuery?: string;
  setGlobalSearchQuery?: (q: string) => void;
  sidebarOpen: boolean;
  getFilteredData?: (data: unknown[], query: string) => unknown[];
  appData: unknown;
  setAppData: (data: unknown) => void;
  handleThemeToggle?: () => void;
  counter?: number;
}

export interface DashboardModalProps {
  open: boolean;
  content: unknown;
  onClose: () => void;
}

export interface ProfileFormData {
  profileName?: string;
  profileEmail?: string;
  profileBio?: string;
}

export interface DashboardOverviewTabProps {
  theme: string;
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
  formData: ProfileFormData;
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
   formData: ProfileFormData;
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

export interface D3VisualizationProps {
  data: RawData[];
  theme: string;
}

export interface RawData {
  id?: number;
  title?: string;
  name?: string;
}

export interface GraphNode {
  id: number | string;
  name: string;
  value: number;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: GraphNode;
  target: GraphNode;
}

export interface MathPlaygroundResult {
  matrixProduct: number[][];
  determinant: number;
  mean: number;
  std: number;
  median: number;
  variance: number;
  expr1: number;
  expr2: number;
  expr3: number;
  fib: number[];
}