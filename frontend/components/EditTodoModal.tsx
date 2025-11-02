import { useState, useRef, useEffect } from "react";
import CustomSelect from "./CustomSelect";

interface Todo {
  id: number;
  title: string;
  description: string;
  status: string;
}

interface EditTodoModalProps {
  todo: Todo;
  onClose: () => void;
  onUpdate: (id: number, updatedTodo: Partial<Todo>) => void;
  statusOptions: { value: string; label: string }[];
}

export default function EditTodoModal({
  todo,
  onClose,
  onUpdate,
  statusOptions,
}: EditTodoModalProps) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [status, setStatus] = useState(todo.status);
  const [isClosing, setIsClosing] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Client-side validation
    if (!title.trim()) {
      setValidationError("Titel darf nicht leer sein.");
      return;
    }

    if (title.trim().length < 3) {
      setValidationError("Titel muss mindestens 3 Zeichen lang sein.");
      return;
    }

    if (title.length > 200) {
      setValidationError("Titel darf maximal 200 Zeichen lang sein.");
      return;
    }

    if (description.length > 1000) {
      setValidationError("Beschreibung darf maximal 1000 Zeichen lang sein.");
      return;
    }

    if (!status) {
      setValidationError("Bitte wählen Sie einen Status aus.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpdate(todo.id, { title: title.trim(), description, status });
      // Modal will close from parent component on success
    } catch {
      // Error is handled by useTodos hook and displayed in ErrorAlert
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${isClosing ? "backdrop-exit" : "backdrop-enter"} fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center`}
      >
        {/* Modal */}
        <div
          ref={modalRef}
          className={`${isClosing ? "modal-exit" : "modal-enter"} fixed top-1/2 left-1/2 
          w-full max-w-md bg-card/90 backdrop-blur-md rounded-2xl p-6 
          shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-gray-700 z-101`}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 
            transition-colors text-2xl font-bold outline-none hover:cursor-pointer"
            disabled={isSubmitting}
          >
            ✕
          </button>

          {/* Form */}
          <h2 className="text-2xl font-bold text-gray-100 mb-6">
            Aufgabe bearbeiten
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              className="input-field mb-3"
              placeholder="Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              maxLength={200}
              required
            />

            <textarea
              className="input-field mb-3 resize-none"
              placeholder="Beschreibung (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              maxLength={1000}
              rows={3}
            />

            <CustomSelect
              value={status}
              onChange={setStatus}
              options={statusOptions}
              placeholder="Status auswählen"
              className="mb-4"
            />

            {validationError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {validationError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-2xl bg-input text-gray-300 font-medium 
                shadow-input hover:bg-[#333333] active:translate-y-px transition-all duration-200 
                hover:cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-2xl bg-blue-600 text-white font-medium 
                shadow-[0_2px_8px_rgba(37,99,235,0.3)]
                hover:bg-blue-700 active:translate-y-px transition-all duration-200 
                hover:cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Wird gespeichert..." : "Speichern"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
