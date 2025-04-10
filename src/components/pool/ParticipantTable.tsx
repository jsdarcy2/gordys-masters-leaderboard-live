
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

  const formatScore = (score: number) => {
    if (score === 0) return "E";
    return score > 0 ? `+${score}` : score.toString();
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-masters-green">
            <TableHead className="masters-table-header rounded-tl-md w-[80px]">Pos</TableHead>
            <TableHead className="masters-table-header">Name</TableHead>
            <TableHead className="masters-table-header text-right w-[100px]">Points</TableHead>
            <TableHead className="masters-table-header hidden md:table-cell rounded-tr-md">Picks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayStandings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                {searchQuery 
                  ? "No participants match your search" 
                  : "No standings data available"}
              </TableCell>
            </TableRow>
          ) : (
            displayStandings.map((participant, index) => (
              <TableRow key={index} className={index % 2 === 0 ? "masters-table-row-even" : "masters-table-row-odd"}>
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
                  {participant.name}
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ParticipantTable;
