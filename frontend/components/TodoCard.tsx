import { clsx } from "clsx";
import { Pencil, X, Check } from "lucide-react";
import type { Todo } from "../types/todo";
import { translateStatus } from "../lib/translateStatus";
import { formatDate } from "../lib/formatDate";

interface TodoCardProps {
  todo: Todo;
  onToggleComplete: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export default function TodoCard({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
}: TodoCardProps) {
  return (
    <div className="card p-4 hover:shadow-card-hover transition-all">
      {/* Checkbox and Title Row */}
      <div className="flex items-start gap-3 mb-2">
        {/* Custom Checkbox */}
        <button
          onClick={() => onToggleComplete(todo)}
          className={clsx("checkbox-custom", {
            "checkbox-custom-checked": todo.status === "done",
            "checkbox-custom-unchecked": todo.status !== "done",
          })}
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
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onEdit(todo)}
            className="btn-icon"
            aria-label="Edit todo"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(todo.id)}
            className="btn-icon-danger"
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
              "bg-yellow-600 text-yellow-100": todo.status === "in_progress",
              "bg-green-600 text-green-100": todo.status === "done",
            },
          )}
        >
          {translateStatus(todo.status)}
        </span>
      </div>
    </div>
  );
}
