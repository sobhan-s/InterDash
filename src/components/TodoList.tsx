import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { API_ENDPOINTS, ITEMS_PER_PAGE } from '../utils/constants';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId?: number;
}

interface TodoListProps {
  todos?: Todo[];
  onAdd?: (text: string) => void;
  onDelete?: (id: number) => void;
  onToggle?: (id: number) => void;
  onEdit?: (id: number, text: string) => void;
  theme: string;
}

const TodoList = ({ todos: propTodos, onAdd, onDelete, onToggle, onEdit }: TodoListProps) => {
  const [todos, setTodos] = useState<Todo[]>(propTodos || []);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (propTodos && propTodos.length > 0) return;
    const cancel = new AbortController();
    setLoading(true);
    fetch(`${API_ENDPOINTS.todos}?_limit=${ITEMS_PER_PAGE}`, { signal: cancel.signal })
      .then((r) => r.json())
      .then((data) => {
        if (!cancel.signal.aborted) setTodos(data);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      })
      .finally(() => {
        if (!cancel.signal.aborted) setLoading(false);
      });

    return () => cancel.abort();
  }, []);

  useEffect(() => {
    if (editingId !== null) editInputRef.current?.focus();
  }, [editingId]);

  useEffect(() => {
    if (todos.length === 0) return;
    localStorage.setItem('todos_backup', JSON.stringify(todos));
    localStorage.setItem('todos_timestamp', new Date().toISOString());
  }, [todos]);

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.filter((t) => !t.completed).length;

  const filteredTodos = todos.filter((t) => {
    if (filter === 'completed') return t.completed;
    if (filter === 'active') return !t.completed;
    return true;
  });

  const handleAdd = (text: string) => {
    const newItem: Todo = {
      id: Date.now(),
      title: text,
      completed: false,
    };
    setTodos((prev) => [newItem, ...prev]);
    onAdd?.(text);
  };

  const handleToggle = (id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    onToggle?.(id);
  };

  const handleDelete = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    onDelete?.(id);
  };

  const saveEdit = (id: number) => {
    const trimmed = editText.trim();
    const original = todos.find((t) => t.id === id);
    if (trimmed && original && trimmed !== original.title) {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t)));
      onEdit?.(id, trimmed);
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground text-center">Loading todos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CheckSquare className="h-4 w-4" />
          Todos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-3">
          <Input
            aria-label="Add a todo"
            ref={inputRef}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a todo..."
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTodo.trim()) {
                handleAdd(newTodo.trim());
                setNewTodo('');
              }
            }}
          />
          <Button
            aria-label="Add todo"
            size="sm"
            className="h-8"
            onClick={() => {
              if (newTodo.trim()) {
                handleAdd(newTodo.trim());
                setNewTodo('');
              }
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex gap-1 mb-3">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <Button
              key={f}
              aria-label={`Filter ${f} todos`}
              aria-pressed={filter === f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              className="h-6 text-xs"
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>

        <div className="max-h-[300px] overflow-auto space-y-1">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              role="button"
              tabIndex={0}
              aria-label={`Edit todo ${todo.title}`}
              aria-pressed={todo.completed}
              className={`flex justify-between items-center p-2 border rounded text-sm ${
                todo.completed ? 'bg-green-50 dark:bg-green-900/10' : 'bg-background'
              }`}
              onDoubleClick={() => {
                setEditingId(todo.id);
                setEditText(todo.title);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === '') {
                  e.preventDefault();
                  setEditingId(todo.id);
                  setEditText(todo.title);
                }
              }}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Button
                  aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 shrink-0"
                  onClick={() => handleToggle(todo.id)}
                >
                  {todo.completed ? (
                    <CheckSquare className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Square className="h-3.5 w-3.5" />
                  )}
                </Button>

                {editingId === todo.id ? (
                  <input
                    ref={editInputRef}
                    aria-label="Edit todo"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border rounded px-1 text-sm flex-1 min-w-0"
                    onBlur={() => saveEdit(todo.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        e.preventDefault();
                        cancelEdit();
                      }
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        saveEdit(todo.id);
                      }
                    }}
                  />
                ) : (
                  <span
                    className={`truncate ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {todo.title}
                  </span>
                )}
              </div>

              <Button
                aria-label={`Delete todo ${todo.title}`}
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-red-500 hover:text-red-700 shrink-0"
                onClick={() => handleDelete(todo.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {filteredTodos.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              No {filter === 'all' ? '' : filter} todos
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          {activeCount} items left · {completedCount} completed · {format(new Date(), 'HH:mm:ss')}
        </p>
      </CardContent>
    </Card>
  );
};

export default TodoList;
