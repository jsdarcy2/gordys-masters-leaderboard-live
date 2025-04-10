
import { Search, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCount: number;
}

const SearchBar = ({ searchQuery, setSearchQuery, filteredCount }: SearchBarProps) => {
  return (
    <div className="mb-4 relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-masters-green border-opacity-50 focus-visible:ring-masters-green"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setSearchQuery("")}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        )}
      </div>
      {searchQuery && (
        <p className="text-sm text-gray-500 mt-1">
          Found {filteredCount} {filteredCount === 1 ? 'participant' : 'participants'}
        </p>
      )}
    </div>
  );
};

export default SearchBar;
