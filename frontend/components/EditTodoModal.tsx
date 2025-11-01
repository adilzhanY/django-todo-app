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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(todo.id, { title, description, status });
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes scaleOut {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
        }
        
        .backdrop-enter {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        .backdrop-exit {
          animation: fadeOut 0.2s ease-in forwards;
        }
        
        .modal-enter {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        .modal-exit {
          animation: scaleOut 0.2s ease-in forwards;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className={`${isClosing ? "backdrop-exit" : "backdrop-enter"} fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center`}
      >
        {/* Modal */}
        <div
          ref={modalRef}
          className={`${isClosing ? "modal-exit" : "modal-enter"} fixed top-1/2 left-1/2 
          w-full max-w-md bg-[#1e1e1e]/90 backdrop-blur-md rounded-2xl p-6 
          shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-gray-700 z-[101]`}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 
            transition-colors text-2xl font-bold outline-none hover:cursor-pointer"
          >
            ✕
          </button>

          {/* Form */}
          <h2 className="text-2xl font-bold text-gray-100 mb-6">
            Aufgabe bearbeiten
          </h2>

          <form onSubmit={handleSubmit}>
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
              shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.4)] 
              transition-all resize-none"
              placeholder="Beschreibung (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />

            <CustomSelect
              value={status}
              onChange={setStatus}
              options={statusOptions}
              placeholder="Status auswählen"
              className="mb-4"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-2xl bg-[#2a2a2a] text-gray-300 font-medium 
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.4)]
                hover:bg-[#333333] active:translate-y-[1px] transition-all duration-200 
                hover:cursor-pointer outline-none"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl bg-blue-600 text-white font-medium 
                shadow-[0_2px_8px_rgba(37,99,235,0.3)]
                hover:bg-blue-700 active:translate-y-[1px] transition-all duration-200 
                hover:cursor-pointer outline-none"
              >
                Speichern
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
