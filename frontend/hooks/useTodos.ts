import { useState, useEffect, useCallback } from "react";
import type { Todo } from "../types/todo";
import { fetchTodos, createTodo, updateTodo, deleteTodo, ApiError } from "../src/api/todos";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos from API
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : "Failed to load todos. Please try again.";
      setError(errorMessage);
      console.error("Error loading todos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Add a new todo
  const addTodo = useCallback(async (title: string, description: string, status: string) => {
    try {
      setError(null);
      await createTodo({ title, description, status });
      await loadTodos();
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : "Failed to add todo. Please try again.";
      setError(errorMessage);
      console.error("Error adding todo:", err);
      throw err; // Re-throw so the component can handle it
    }
  }, [loadTodos]);

  // Update an existing todo
  const updateTodoItem = useCallback(async (id: number, data: Partial<Todo>) => {
    try {
      setError(null);
      await updateTodo(id, data);
      await loadTodos();
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : "Failed to update todo. Please try again.";
      setError(errorMessage);
      console.error("Error updating todo:", err);
      throw err; // Re-throw so the component can handle it
    }
  }, [loadTodos]);

  // Delete a todo
  const deleteTodoItem = useCallback(async (id: number) => {
    try {
      setError(null);
      await deleteTodo(id);
      await loadTodos();
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : "Failed to delete todo. Please try again.";
      setError(errorMessage);
      console.error("Error deleting todo:", err);
      throw err; // Re-throw so the component can handle it
    }
  }, [loadTodos]);

  // Toggle todo completion status
  const toggleComplete = useCallback(async (todo: Todo) => {
    const newStatus = todo.status === "done" ? "open" : "done";
    await updateTodoItem(todo.id, { ...todo, status: newStatus });
  }, [updateTodoItem]);

  // Clear error manually
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    todos,
    loading,
    error,
    clearError,
    addTodo,
    updateTodo: updateTodoItem,
    deleteTodo: deleteTodoItem,
    toggleComplete,
  };
}
