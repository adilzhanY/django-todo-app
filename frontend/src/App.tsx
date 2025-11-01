import { useState, useEffect } from "react";
import axios from "axios";
import { clsx } from "clsx";
import CustomSelect from "../components/CustomSelect";
import EditTodoModal from "../components/EditTodoModal";
import { Pencil, X } from "lucide-react";

interface Todo {
  id: number;
  title: string;
  description: string;
  status: string;
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

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

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

  useEffect(() => {
    fetchTodos();
  }, []);

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
        active:translate-y-[1px] transition-all duration-200 hover:cursor-pointer"
        >
          Aufgabe hinzufügen
        </button>
      </form>

      {/* Todo List */}
      <div className="w-full max-w-md space-y-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="bg-[#1e1e1e] p-4 rounded-2xl flex justify-between items-start 
          shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.25)]
          hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_4px_8px_rgba(0,0,0,0.5)]
          transition-all"
          >
            <div>
              <h2 className="font-semibold text-lg text-gray-100">
                {todo.title}
              </h2>
              <p className="text-gray-400 text-sm">{todo.description}</p>
              <span
                className={clsx(
                  "text-xs px-2 py-1 rounded-full font-medium mt-1 inline-block",
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
            <div className="flex gap-2">
              <button
                onClick={() => setEditingTodo(todo)}
                className="text-blue-400 hover:text-blue-500 cursor-pointer transition-all outline-none
                hover:scale-110 active:scale-95"
                aria-label="Edit todo"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-400 hover:text-red-500 cursor-pointer transition-all outline-none
                hover:scale-110 active:scale-95"
                aria-label="Delete todo"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
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
