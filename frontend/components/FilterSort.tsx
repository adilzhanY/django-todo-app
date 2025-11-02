import { useState, useRef, useEffect } from "react";
import { Filter, ArrowUpDown, Check } from "lucide-react";

interface FilterSortProps {
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
  selectedDate: string | null;
  onDateChange: (date: string | null) => void;
  sortBy: "newest" | "oldest";
  onSortChange: (sort: "newest" | "oldest") => void;
}

export default function FilterSort({
  selectedStatuses,
  onStatusChange,
  selectedDate,
  onDateChange,
  sortBy,
  onSortChange,
}: FilterSortProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterClosing, setIsFilterClosing] = useState(false);
  const [isSortClosing, setIsSortClosing] = useState(false);
  const [date, setDate] = useState("");

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const statusOptions = [
    { value: "open", label: "Offen" },
    { value: "in_progress", label: "In Bearbeitung" },
    { value: "done", label: "Erledigt" },
  ];

  // Sync local date with prop
  useEffect(() => {
    setDate(selectedDate || "");
  }, [selectedDate]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        handleFilterClose();
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        handleSortClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterClose = () => {
    if (isFilterOpen) {
      setIsFilterClosing(true);
      setTimeout(() => {
        setIsFilterOpen(false);
        setIsFilterClosing(false);
      }, 150);
    }
  };

  const handleSortClose = () => {
    if (isSortOpen) {
      setIsSortClosing(true);
      setTimeout(() => {
        setIsSortOpen(false);
        setIsSortClosing(false);
      }, 150);
    }
  };

  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  const applyFilters = () => {
    if (date) {
      onDateChange(date);
    }
    handleFilterClose();
  };

  const clearAllFilters = () => {
    onStatusChange([]);
    setDate("");
    onDateChange(null);
    handleFilterClose();
  };

  return (
    <>
      <div className="flex gap-2">
        {/* Filter Button */}
        <div ref={filterRef} className="relative">
          <button
            onClick={() => {
              if (isFilterOpen) {
                handleFilterClose();
              } else {
                setIsFilterOpen(true);
                setIsSortOpen(false);
              }
            }}
            className="btn-icon"
            aria-label="Filter"
          >
            <Filter size={18} />
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div
              className={`${isFilterClosing ? "dropdown-slide-out" : "dropdown-slide-in"} 
              absolute right-0 mt-2 w-72 bg-card/95 backdrop-blur-md rounded-2xl 
              shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-gray-700 p-4 z-50`}
            >
              <h3 className="text-sm font-semibold text-gray-100 mb-3">
                Filter
              </h3>

              {/* Status Filter */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Status</p>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <button
                        type="button"
                        onClick={() => toggleStatus(option.value)}
                        className={`checkbox-custom ${selectedStatuses.includes(option.value)
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-500 bg-transparent group-hover:border-gray-400"
                          } w-5 h-5`}
                      >
                        <Check
                          size={14}
                          className={`text-white transition-all duration-300 ${selectedStatuses.includes(option.value)
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-50"
                            }`}
                          strokeWidth={3}
                        />
                      </button>
                      <span className="text-sm text-gray-200">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Filter */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Erstellungsdatum</p>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field w-full text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-2 rounded-xl bg-input text-gray-300 text-sm font-medium 
                  shadow-input hover:bg-[#333333] active:translate-y-px transition-all duration-200 
                  hover:cursor-pointer outline-none"
                >
                  Zurücksetzen
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium 
                  shadow-[0_2px_8px_rgba(37,99,235,0.3)]
                  hover:bg-blue-700 active:translate-y-px transition-all duration-200 
                  hover:cursor-pointer outline-none"
                >
                  Anwenden
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sort Button */}
        <div ref={sortRef} className="relative">
          <button
            onClick={() => {
              if (isSortOpen) {
                handleSortClose();
              } else {
                setIsSortOpen(true);
                setIsFilterOpen(false);
              }
            }}
            className="btn-icon"
            aria-label="Sort"
          >
            <ArrowUpDown size={18} />
          </button>

          {/* Sort Dropdown */}
          {isSortOpen && (
            <div
              className={`${isSortClosing ? "dropdown-slide-out" : "dropdown-slide-in"} 
              absolute right-0 mt-2 w-48 bg-card/95 backdrop-blur-md rounded-2xl 
              shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-gray-700 p-3 z-50`}
            >
              <h3 className="text-sm font-semibold text-gray-100 mb-3">
                Sortieren
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onSortChange("newest");
                    handleSortClose();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm
                  ${sortBy === "newest"
                      ? "bg-blue-600 text-white"
                      : "text-gray-200 hover:bg-[#2a2a2a]"
                    }`}
                >
                  Neueste zuerst
                </button>
                <button
                  onClick={() => {
                    onSortChange("oldest");
                    handleSortClose();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm
                  ${sortBy === "oldest"
                      ? "bg-blue-600 text-white"
                      : "text-gray-200 hover:bg-[#2a2a2a]"
                    }`}
                >
                  Älteste zuerst
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
