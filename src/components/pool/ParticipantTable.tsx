
import { PoolParticipant } from "@/types";
import { Award } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ParticipantTableProps {
  displayStandings: PoolParticipant[];
  searchQuery: string;
}

const ParticipantTable = ({ displayStandings, searchQuery }: ParticipantTableProps) => {
  const getScoreClass = (score: number) => {
    if (score < 0) return "text-masters-green font-bold";
    if (score > 0) return "text-red-600";
    return "";
  };

  const formatScore = (score: number | undefined) => {
    // Handle undefined or null scores
    if (score === undefined || score === null) return "E";
    
    if (score === 0) return "E";
    return score > 0 ? `+${score}` : score.toString();
  };

  // Function to highlight the searched text in participant names
  const highlightSearchText = (name: string, query: string) => {
    if (!query) return name;
    
    // Make case-insensitive comparison for search
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = name.split(regex);
    
    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <span key={i} className="bg-yellow-200 font-bold">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-masters-green">
            <TableHead className="masters-table-header rounded-tl-md w-[80px]">Pos</TableHead>
            <TableHead className="masters-table-header">Name</TableHead>
            <TableHead className="masters-table-header text-right w-[100px]">Points</TableHead>
            <TableHead className="masters-table-header hidden md:table-cell">Picks</TableHead>
            <TableHead className="masters-table-header hidden md:table-cell text-right rounded-tr-md">Today</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayStandings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                {searchQuery 
                  ? "No participants match your search" 
                  : "No standings data available"}
              </TableCell>
            </TableRow>
          ) : (
            displayStandings.map((participant, index) => (
              <TableRow 
                key={participant.name} // Use name as key instead of index for more stable rendering
                className={`${index % 2 === 0 ? "masters-table-row-even" : "masters-table-row-odd"} ${
                  searchQuery && participant.name.toLowerCase().includes(searchQuery.toLowerCase())
                    ? "bg-yellow-50"
                    : ""
                }`}
              >
                <TableCell className="py-3 font-medium">
                  {participant.position === 1 && (
                    <span className="inline-flex items-center">
                      <Award size={16} className="text-masters-yellow mr-1" />
                      {participant.position}
                    </span>
                  )}
                  {participant.position !== 1 && participant.position}
                </TableCell>
                <TableCell className="py-3 font-medium">
                  {searchQuery ? highlightSearchText(participant.name, searchQuery) : participant.name}
                  {!participant.paid && (
                    <span className="ml-2 text-xs text-red-500">(Unpaid)</span>
                  )}
                </TableCell>
                <TableCell className="py-3 text-right font-medium">
                  <span className={getScoreClass(participant.totalPoints)}>
                    {formatScore(participant.totalPoints)}
                  </span>
                </TableCell>
                <TableCell className="py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {participant.picks.map((pick, i) => (
                      <span 
                        key={i}
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          participant.pickScores && participant.pickScores[pick] < 0
                            ? "bg-green-100"
                            : participant.pickScores && participant.pickScores[pick] > 0
                            ? "bg-red-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {pick} 
                        {participant.pickScores && (
                          <span className={getScoreClass(participant.pickScores[pick])}>
                            {" "}({formatScore(participant.pickScores[pick])})
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="py-3 hidden md:table-cell text-right">
                  {participant.roundScores && participant.roundScores.round1 !== undefined && (
                    <span className={getScoreClass(participant.roundScores.round1)}>
                      {formatScore(participant.roundScores.round1)}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ParticipantTable;
