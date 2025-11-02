import SearchTodo from "./SearchTodo";
import FilterSort from "./FilterSort";

interface SearchFilterSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
  selectedDate: string | null;
  onDateChange: (date: string | null) => void;
  sortBy: "newest" | "oldest";
  onSortChange: (sort: "newest" | "oldest") => void;
  resultsCount: number;
}

export default function SearchFilterSection({
  searchQuery,
  onSearchChange,
  selectedStatuses,
  onStatusChange,
  selectedDate,
  onDateChange,
  sortBy,
  onSortChange,
  resultsCount,
}: SearchFilterSectionProps) {
  const resultText = resultsCount === 1 ? "Ergebnis" : "Ergebnisse";

  return (
    <>
      {/* Search and Filter/Sort Row */}
      <div className="w-full max-w-md flex gap-2 mb-4">
        <SearchTodo
          value={searchQuery}
          onChange={onSearchChange}
          className="flex-1"
        />
        <FilterSort
          selectedStatuses={selectedStatuses}
          onStatusChange={onStatusChange}
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />
      </div>

      {/* Results Count */}
      <div className="w-full max-w-md mb-4">
        <p className="text-sm text-gray-400">
          {resultsCount} {resultText}
        </p>
      </div>
    </>
  );
}
