import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';

interface TodoListProps {
  todos: any[];
  onAdd: (text: string) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number, text: string) => void;
  theme: string;
  counter: number;
}

const TodoList = ({ todos, onAdd, onDelete, onToggle, onEdit, theme, counter }: TodoListProps) => {
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (editingId !== null) editInputRef.current?.focus();
  }, [editingId]);

  useEffect(() => {
    localStorage.setItem('todos_backup', JSON.stringify(todos));
    localStorage.setItem('todos_timestamp', new Date().toISOString());
  }, [todos]); //remove counter added todos in deps

  const [completedCount, setCompletedCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  useEffect(() => {
    setCompletedCount(todos.filter((t) => t.completed).length);
    setActiveCount(todos.filter((t) => !t.completed).length);
  }, [todos, counter]);

  const filteredTodos = todos.filter((t: any) => {
    if (filter === 'completed') return t.completed;
    if (filter === 'active') return !t.completed;
    return true;
  });

  const saveEdit = (id: number) => {
    const trimEditedText = editText.trim();
    if (trimEditedText && trimEditedText !== todos.find((t) => t.id === id).title) {
      onEdit(id, trimEditedText);
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

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
            ref={inputRef}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a todo..."
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTodo.trim()) {
                onAdd(newTodo.trim());
                setNewTodo('');
              }
            }}
          />
          <Button
            size="sm"
            className="h-8"
            onClick={() => {
              if (newTodo.trim()) {
                onAdd(newTodo.trim());
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
          {filteredTodos.map((todo: any, index: number) => (
            <div
              role="button"
              tabIndex={0}    
              className={`flex justify-between items-center p-2 border rounded text-sm ${todo.completed ? 'bg-green-50 dark:bg-green-900/10' : 'bg-background'}`}
              onDoubleClick={() => {
                setEditingId(todo.id);
                setEditText(todo.title);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setEditingId(todo.id);
                  setEditText(todo.title);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => onToggle(todo.id)}
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
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border rounded px-1 text-sm"
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
                  <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                    //fix the xss issue
                    <span>{todo.title}</span>
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-red-500 hover:text-red-700"
                onClick={() => onDelete(todo.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {activeCount} items left | {completedCount} completed | Rendered at:{' '}
          {moment().format('HH:mm:ss')}
        </p>
      </CardContent>
    </Card>
  );
};

export default TodoList;
