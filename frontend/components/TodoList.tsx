import type { Todo } from "../types/todo";
import TodoCard from "./TodoCard";

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export default function TodoList({
  todos,
  onToggleComplete,
  onEdit,
  onDelete,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-400 text-lg">
          Keine Ergebnisse für diese Suche
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4">
      {todos.map((todo) => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
