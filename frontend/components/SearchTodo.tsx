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
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        size={18}
      />
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2.5 bg-[#2a2a2a] text-gray-100 placeholder-gray-400 rounded-3xl 
        border border-transparent focus:border-gray-500 outline-none 
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.4)] 
        transition-all"
        placeholder="Aufgaben durchsuchen..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
