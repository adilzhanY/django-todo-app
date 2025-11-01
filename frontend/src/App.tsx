import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { clsx } from "clsx";
import { Pencil, X, Check } from "lucide-react";
import CustomSelect from "../components/CustomSelect";
import EditTodoModal from "../components/EditTodoModal";
import SearchTodo from "../components/SearchTodo";
import FilterSort from "../components/FilterSort";
import { useDebounce } from "../hooks/useDebounce";

interface Todo {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

function translateStatus(status: string): string {
  switch (status) {
    case "open":
      return "Offen";
    case "in_progress":
      return "In Bearbeitung";
    case "done":
      return "Erledigt";
    default:
      return "Unbekannt";
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const statusOptions = [
    { value: "open", label: "Offen" },
    { value: "in_progress", label: "In Bearbeitung" },
    { value: "done", label: "Erledigt" },
  ];

  const API_URL = "http://127.0.0.1:8000/api/todos/";

  // Fetch all todos
  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  // Filter and sort todos
  const filteredAndSortedTodos = useMemo(() => {
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

  // Create new todo
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(API_URL, { title, description, status });
    setTitle("");
    setDescription("");
    setStatus("");
    fetchTodos();
  };

  // Update a todo
  const updateTodo = async (id: number, updatedTodo: Partial<Todo>) => {
    await axios.put(`${API_URL}${id}/`, updatedTodo);
    fetchTodos();
    setEditingTodo(null);
  };

  // Delete a todo
  const deleteTodo = async (id: number) => {
    await axios.delete(`${API_URL}${id}/`);
    fetchTodos();
  };

  // Toggle todo completion
  const toggleTodoComplete = async (todo: Todo) => {
    const newStatus = todo.status === "done" ? "open" : "done";
    await updateTodo(todo.id, { ...todo, status: newStatus });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const resultText =
    filteredAndSortedTodos.length === 1 ? "Ergebnis" : "Ergebnisse";

  return (
    <div className="min-h-screen bg-[#121212] p-6 flex flex-col items-center text-gray-200">
      <h1 className="text-3xl font-bold mb-8 text-gray-100">
        To-Do-Applikation
      </h1>

      {/* Form */}
      <form
        onSubmit={addTodo}
        className="w-full max-w-md bg-[#1e1e1e] rounded-2xl p-5 mb-8 
      shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.25)]"
      >
        <input
          className="w-full mb-3 p-2.5 bg-[#2a2a2a] text-gray-100 placeholder-gray-400 rounded-xl 
        border border-transparent focus:border-gray-500 outline-none 
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.4)] transition-all"
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full mb-3 p-2.5 bg-[#2a2a2a] text-gray-100 placeholder-gray-400 rounded-xl 
        border border-transparent focus:border-gray-500 outline-none 
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.4)] transition-all"
          placeholder="Beschreibung (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <CustomSelect
          value={status}
          onChange={setStatus}
          options={statusOptions}
          placeholder="Status auswählen"
          className="mb-4"
        />
        <button
          className="w-full py-2.5 rounded-2xl bg-[#1e1e1e] text-gray-100 font-medium 
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_1px_2px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.25)]
        hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_2px_4px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)]
        active:translate-y-[1px] transition-all duration-200 hover:cursor-pointer
        hover:scale-105 active:scale-98"
        >
          Aufgabe hinzufügen
        </button>
      </form>

      {/* Search and Filter/Sort Row */}
      <div className="w-full max-w-md flex gap-2 mb-4">
        <SearchTodo
          value={searchQuery}
          onChange={setSearchQuery}
          className="flex-1"
        />
        <FilterSort
          selectedStatuses={selectedStatuses}
          onStatusChange={setSelectedStatuses}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Results Count */}
      <div className="w-full max-w-md mb-4">
        <p className="text-sm text-gray-400">
          {filteredAndSortedTodos.length} {resultText}
        </p>
      </div>

      {/* Todo List */}
      <div className="w-full max-w-md space-y-4">
        {filteredAndSortedTodos.length > 0 ? (
          filteredAndSortedTodos.map((todo) => (
            <div
              key={todo.id}
              className="bg-[#1e1e1e] p-4 rounded-2xl
            shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.25)]
            hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_4px_8px_rgba(0,0,0,0.5)]
            transition-all"
            >
              {/* Checkbox and Title Row */}
              <div className="flex items-start gap-3 mb-2">
                {/* Custom Checkbox */}
                <button
                  onClick={() => toggleTodoComplete(todo)}
                  className={clsx(
                    "flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 outline-none",
                    "shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.4)]",
                    "hover:scale-110 active:scale-95",
                    {
                      "border-green-500 bg-green-500": todo.status === "done",
                      "border-gray-500 bg-transparent hover:border-gray-400":
                        todo.status !== "done",
                    },
                  )}
                  aria-label="Toggle complete"
                >
                  <Check
                    size={16}
                    className={clsx("text-white transition-all duration-300", {
                      "opacity-100 scale-100": todo.status === "done",
                      "opacity-0 scale-50": todo.status !== "done",
                    })}
                    strokeWidth={3}
                  />
                </button>

                {/* Title */}
                <h2 className="font-semibold text-lg text-gray-100 break-words flex-1 min-w-0">
                  {todo.title}
                </h2>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setEditingTodo(todo)}
                    className="p-2.5 rounded-2xl bg-[#1e1e1e] text-gray-100 font-medium 
                    shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_1px_2px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.25)]
                    hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_2px_4px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)]
                    active:translate-y-[1px] transition-all duration-200 hover:cursor-pointer
                    hover:scale-110 active:scale-95"
                    aria-label="Edit todo"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2.5 rounded-2xl bg-[#1e1e1e] text-red-400 font-medium 
                    shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_1px_2px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.25)]
                    hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_2px_4px_rgba(0,0,0,0.5),0_6px_12px_rgba(0,0,0,0.3)]
                    active:translate-y-[1px] transition-all duration-200 hover:cursor-pointer hover:text-red-500
                    hover:scale-110 active:scale-95"
                    aria-label="Delete todo"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Description - Full Width */}
              <p className="text-gray-400 text-sm break-words mb-2 ml-9">
                {todo.description}
              </p>

              {/* Date */}
              <p className="text-gray-500 text-xs mb-2 ml-9">
                {formatDate(todo.created_at)}
              </p>

              {/* Status Badge */}
              <div className="ml-9">
                <span
                  className={clsx(
                    "text-xs px-2 py-1 rounded-full font-medium inline-block",
                    {
                      "bg-blue-600 text-blue-100": todo.status === "open",
                      "bg-yellow-600 text-yellow-100":
                        todo.status === "in_progress",
                      "bg-green-600 text-green-100": todo.status === "done",
                    },
                  )}
                >
                  {translateStatus(todo.status)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div
            className="bg-[#1e1e1e] p-8 rounded-2xl text-center 
          shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.25)]"
          >
            <p className="text-gray-400 text-lg">
              Keine Ergebnisse für diese Suche
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTodo && (
        <EditTodoModal
          todo={editingTodo}
          onClose={() => setEditingTodo(null)}
          onUpdate={updateTodo}
          statusOptions={statusOptions}
        />
      )}
    </div>
  );
}

export default App;
