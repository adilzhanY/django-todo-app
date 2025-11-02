import { useState, useMemo } from "react";
import type { Todo } from "../types/todo";
import { useDebounce } from "./useDebounce";
import { translateStatus } from "../lib/translateStatus";

export function useFilteredTodos(todos: Todo[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter and sort todos
  const filteredTodos = useMemo(() => {
    let result = [...todos];

    // Apply search filter
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter((todo) => {
        const titleMatch = todo.title.toLowerCase().includes(query);
        const descriptionMatch = todo.description.toLowerCase().includes(query);
        const statusMatch = translateStatus(todo.status)
          .toLowerCase()
          .includes(query);
        return titleMatch || descriptionMatch || statusMatch;
      });
    }

    // Apply status filter
    if (selectedStatuses.length > 0) {
      result = result.filter((todo) => selectedStatuses.includes(todo.status));
    }

    // Apply date filter (exact date match)
    if (selectedDate) {
      result = result.filter((todo) => {
        if (!todo.created_at) return false;
        const todoDate = new Date(todo.created_at).toISOString().split("T")[0];
        return todoDate === selectedDate;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [todos, debouncedSearchQuery, selectedStatuses, selectedDate, sortBy]);

  return {
    filteredTodos,
    searchQuery,
    setSearchQuery,
    selectedStatuses,
    setSelectedStatuses,
    selectedDate,
    setSelectedDate,
    sortBy,
    setSortBy,
  };
}
