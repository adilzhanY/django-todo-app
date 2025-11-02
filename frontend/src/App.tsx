import { useState } from "react";
import EditTodoModal from "../components/EditTodoModal";
import ErrorAlert from "../components/ErrorAlert";
import SearchFilterSection from "../components/SearchFilterSection";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { useTodos } from "../hooks/useTodos";
import { useFilteredTodos } from "../hooks/useFilteredTodos";
import { STATUS_OPTIONS } from "../constants/statusOptions";
import type { Todo } from "../types/todo";

function App() {
  const {
    todos,
    loading,
    error,
    clearError,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  } = useTodos();

  const {
    filteredTodos,
    searchQuery,
    setSearchQuery,
    selectedStatuses,
    setSelectedStatuses,
    selectedDate,
    setSelectedDate,
    sortBy,
    setSortBy,
  } = useFilteredTodos(todos);

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Handle update from modal
  const handleUpdate = async (id: number, data: Partial<Todo>) => {
    try {
      await updateTodo(id, data);
      setEditingTodo(null);
    } catch {
      // Error is already handled in useTodos, just prevent modal from closing
    }
  };

  // Handle delete with error handling
  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
    } catch {
      // Error is already handled in useTodos
    }
  };

  // Handle toggle with error handling
  const handleToggleComplete = async (todo: Todo) => {
    try {
      await toggleComplete(todo);
    } catch {
      // Error is already handled in useTodos
    }
  };

  return (
    <div className="min-h-screen bg-dark p-6 flex flex-col items-center text-gray-200">
      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={clearError} />}

      <h1 className="text-4xl font-bold mb-8 text-gray-100">
        To-Do-Applikation
      </h1>

      {/* Form */}
      <TodoForm onSubmit={addTodo} statusOptions={STATUS_OPTIONS} />

      {/* Search and Filter Section */}
      <SearchFilterSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatuses={selectedStatuses}
        onStatusChange={setSelectedStatuses}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultsCount={filteredTodos.length}
      />

      {/* Loading State */}
      {loading && (
        <div className="w-full max-w-3xl text-center py-8">
          <p className="text-gray-400">Lade Aufgaben...</p>
        </div>
      )}

      {/* Todo List */}
      {!loading && (
        <TodoList
          todos={filteredTodos}
          onToggleComplete={handleToggleComplete}
          onEdit={setEditingTodo}
          onDelete={handleDelete}
        />
      )}

      {/* Edit Modal */}
      {editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          onClose={() => setEditingTodo(null)}
          onUpdate={handleUpdate}
          statusOptions={STATUS_OPTIONS}
        />
      )}
    </div>
  );
}

export default App;
