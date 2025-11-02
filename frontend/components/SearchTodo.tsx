import { Search } from "lucide-react";

interface SearchTodoProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SearchTodo({
  value,
  onChange,
  className = "",
}: SearchTodoProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        size={18}
      />
      <input
        type="text"
        className="input-field w-full rounded-3xl"
        style={{ paddingLeft: '2.75rem', paddingRight: '1rem' }}
        placeholder="Aufgaben durchsuchen..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
