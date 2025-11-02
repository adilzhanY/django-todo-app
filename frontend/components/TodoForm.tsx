import { useState } from "react";
import CustomSelect from "./CustomSelect";

interface TodoFormProps {
  onSubmit: (title: string, description: string, status: string) => Promise<void>;
  statusOptions: Array<{ value: string; label: string }>;
}

export default function TodoForm({ onSubmit, statusOptions }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await onSubmit(title.trim(), description, status);
      // Clear form on success
      setTitle("");
      setDescription("");
      setStatus("");
      setValidationError("");
    } catch {
      // Error is handled by useTodos hook and displayed in ErrorAlert
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md card p-5 mb-8"
    >
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
        className="input-field mb-3"
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

      <button
        type="submit"
        className="btn-primary w-full py-2.5"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Wird hinzugefügt..." : "Aufgabe hinzufügen"}
      </button>
    </form>
  );
}
