
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShowMoreButtonProps {
  showAll: boolean;
  setShowAll: (show: boolean) => void;
  totalCount: number;
}

const ShowMoreButton = ({ showAll, setShowAll, totalCount }: ShowMoreButtonProps) => {
  return (
    <div className="mt-4 text-center">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowAll(!showAll)}
        className="text-masters-green border-masters-green hover:bg-masters-green/10 focus:ring-2 focus:ring-masters-green/30"
      >
        {showAll ? (
          <>
            <span>Show Preview</span>
            <ChevronUp className="ml-1 h-4 w-4" />
          </>
        ) : (
          <>
            <span>Show All {totalCount} Participants</span>
            <ChevronDown className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default ShowMoreButton;
