import { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import type { SortOrder, UseDashboardStateOptions } from '../../lib/types';



export const useDashboardState = ({
  posts,
  todos,
  users,
  comments,
  photos,
  albums,
  setTodos,
  addToast,
}: UseDashboardStateOptions) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filterText, setFilterText] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const toggleTimeoutsRef = useRef<number[]>([]);
  const itemsPerPage = 10;

  const openModal = useCallback((content: any) => {
    setModalContent(content);
    setModalOpen(true);
  }, []); // setters from useState are stable — no deps needed

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleAddTodo = useCallback((text: string) => {
    const newTodo = { id: todos.length + 1, title: text, completed: false, userId: 1 };
    setTodos((currentTodos) => [...currentTodos, newTodo]);
  }, [todos.length, setTodos]);

  const handleEditTodo = useCallback((id: number, text: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === id ? { ...todo, title: text } : todo)),
    );
  }, [setTodos]);

  const handleDeleteTodo = useCallback((id: number) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  }, [setTodos]);

  const handleToggleTodo = useCallback((id: number) => {
    const timeoutId = window.setTimeout(() => {
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    }, 500);

    toggleTimeoutsRef.current.push(timeoutId);
  }, [setTodos]);

  const handleSelectItem = useCallback((item: any) => {
    setSelectedItems((currentItems) => [...currentItems.slice(-50), item]);
  }, []);

  // Stable across renders as long as posts/filterText/sortOrder don't change.
  // Callers (e.g. DashboardOverviewTab) should wrap the call in useMemo keyed
  // on this function reference to avoid redundant recomputations.
  const getSortedAndFilteredPosts = useCallback(() => {
    let filteredPosts = posts;

    if (filterText) {
      const normalizedFilter = filterText.toLowerCase();
      filteredPosts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(normalizedFilter) ||
          post.body.toLowerCase().includes(normalizedFilter),
      );
    }

    return _.orderBy(filteredPosts, ['id'], [sortOrder]);
  }, [posts, filterText, sortOrder]);

  const getPaginatedData = useCallback((data: any[]) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [page, itemsPerPage]);

  const totalPages = useCallback((data: any[]) => {
    return Math.ceil(data.length / itemsPerPage);
  }, [itemsPerPage]);

  const handleFormChange = useCallback((field: string, value: any) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [field]: value,
    }));
  }, []);

  // Keep a ref to formData so validateForm/handleProfileSave can read the
  // latest value without being re-created every time formData changes.
  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const validateForm = useCallback(() => {
    const currentFormData = formDataRef.current;
    const errors: Record<string, string> = {};

    if (!currentFormData.profileName || currentFormData.profileName.trim().length < 2) {
      errors.profileName = 'Name must be at least 2 characters';
    }

    if (!currentFormData.profileEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentFormData.profileEmail)) {
      errors.profileEmail = 'Enter a valid email address';
    }

    if (!currentFormData.profileBio || currentFormData.profileBio.length > 200) {
      errors.profileBio = 'Bio must be between 1 and 200 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, []); // stable: reads via ref, writes only to setValidationErrors (stable setter)

  const handleProfileSave = useCallback(() => {
    const isValid = validateForm();

    if (isValid) {
      addToast('Profile saved!', 'success');
      return;
    }

    addToast('Please fix the errors', 'error');
  }, [validateForm, addToast]);

  useEffect(() => {
    return () => {
      toggleTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  useEffect(() => {
    const dashboardState = {
      todos,
      posts,
      users,
      comments,
      photos,
      albums,
      activeTab,
      page,
      filterText,
      sortOrder,
      selectedItems,
      formData,
    };

    localStorage.setItem('dashboardState', JSON.stringify(dashboardState));
  }, [
    todos,
    posts,
    users,
    comments,
    photos,
    albums,
    activeTab,
    page,
    filterText,
    sortOrder,
    selectedItems,
    formData,
  ]);

  return {
    activeTab,
    setActiveTab,
    sortOrder,
    setSortOrder,
    filterText,
    setFilterText,
    modalOpen,
    modalContent,
    openModal,
    closeModal,
    page,
    setPage,
    formData,
    validationErrors,
    handleAddTodo,
    handleEditTodo,
    handleDeleteTodo,
    handleToggleTodo,
    handleSelectItem,
    getSortedAndFilteredPosts,
    getPaginatedData,
    totalPages,
    handleFormChange,
    handleProfileSave,
  };
};