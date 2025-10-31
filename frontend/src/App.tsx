import {useState, useEffect} from "react"
import axios from "axios"

interface Todo {
  id: number
  title: string
  description: string
  status: string
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("open")

  const API_URL = "http://127.0.0.1:8000/api/todos/"

  // Fetch all todos
  const fetchTodos = async () => {
    const res = await axios.get(API_URL)
    setTodos(res.data)
  }

  // Create new todo 
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    await axios.post(API_URL, {title, description, status})
    setTitle("")
    setDescription("")
    setStatus("open")
    fetchTodos()
  }

  // Delete a todo
  const deleteTodo = async (id: number) => {
    await axios.delete(`${API_URL}${id}/`)
    fetchTodos()
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        To-Do-Applikation
      </h1>

      <form onSubmit={addTodo} className="w-full max-w-md bg-white rounded-xl shadow p-4 mb-6">
        <input
          className="border rounded w-full p-2 mb-2"
          placeholder="Titel"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border rounded w-full p-2 mb-2"
          placeholder="Beschreibung (Optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <select
          className="border rounded w-full p-2 mb-2"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="open">Offen</option>
          <option value="in_progress">In Bearbeitung</option>
          <option value="done">Erledigt</option>
        </select>
        <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Aufgabe hinzufügen
        </button>
      </form>

      <div className="w-full max-w-md space-y-3">
        {todos.map(todo => (
          <div key={todo.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-start">
            <div>
              <h2 className="font-semibold text-lg">{todo.title}</h2>
              <p className="text-gray-600 text-sm">{todo.description}</p>
              <span className="text-xs text-blue-600">{todo.status}</span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700 font-bold"
            >✕</button>
          </div>
        
        ))}
      </div>
    </div>
  )
}

export default App
