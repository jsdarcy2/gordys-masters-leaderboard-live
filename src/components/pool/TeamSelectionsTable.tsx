
import React, { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { getBaseSampleTeams } from "@/services/pool/teamData";

interface TeamSelection {
  id: number;
  name: string;
  picks: string[];
}

const TeamSelectionsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false);
  const [activeGolfer, setActiveGolfer] = useState<string | null>(null);
  
  // Get team data from our service
  const teamData = getBaseSampleTeams();
  
  // Convert the team data to the format we need
  const completeTeamSelections: TeamSelection[] = Object.entries(teamData).map(
    ([name, data], index) => ({
      id: index + 1,
      name,
      picks: data.picks
    })
  );
  
  // Filter teams based on search term and active golfer
  const filteredTeams = completeTeamSelections.filter(team => {
    const nameMatch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const golferMatch = activeGolfer ? team.picks.includes(activeGolfer) : true;
    return nameMatch && golferMatch;
  });
  
  // Create a map of golfer frequencies
  const golferFrequency: Record<string, number> = {};
  completeTeamSelections.forEach(team => {
    team.picks.forEach(golfer => {
      golferFrequency[golfer] = (golferFrequency[golfer] || 0) + 1;
    });
  });
  
  // Sort golfers by frequency
  const sortedGolfers = Object.entries(golferFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20); // Show top 20 golfers
  
  // Determine how many teams to display
  const displayCount = showAll ? filteredTeams.length : Math.min(50, filteredTeams.length);
  const displayTeams = filteredTeams.slice(0, displayCount);
  
  return (
    <div className="space-y-6">
      <div className="masters-card">
        <div className="masters-header">
          <h2 className="text-xl md:text-2xl font-serif">
            Complete Team Selections
          </h2>
          <p className="text-sm text-white/80 mt-1">
            {completeTeamSelections.length} teams registered for The Masters Pool
          </p>
        </div>
        
        <div className="p-4 bg-white">
          <div className="mb-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by participant name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-masters-green/30 focus-visible:ring-masters-green/30"
              />
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {activeGolfer ? (
                <div className="flex items-center">
                  <span>Showing teams with {activeGolfer}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2 h-6 text-xs"
                    onClick={() => setActiveGolfer(null)}
                  >
                    Clear filter
                  </Button>
                </div>
              ) : (
                <span>Showing {displayTeams.length} of {filteredTeams.length} teams</span>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead>Pick 1</TableHead>
                  <TableHead>Pick 2</TableHead>
                  <TableHead>Pick 3</TableHead>
                  <TableHead>Pick 4</TableHead>
                  <TableHead>Pick 5</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayTeams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No teams found matching your search
                    </TableCell>
                  </TableRow>
                ) : (
                  displayTeams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.id}</TableCell>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      {team.picks.map((pick, index) => (
                        <TableCell 
                          key={index}
                          className={`${activeGolfer === pick ? "bg-green-50 font-medium" : ""} cursor-pointer hover:bg-gray-50`}
                          onClick={() => setActiveGolfer(pick)}
                        >
                          {pick}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredTeams.length > displayCount && (
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowAll(!showAll)}
                className="text-masters-green border-masters-green hover:bg-masters-green/10"
              >
                {showAll ? (
                  <>
                    <span>Show Less</span>
                    <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Show All ({filteredTeams.length} Teams)</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="masters-card">
        <div className="masters-header">
          <h2 className="text-xl md:text-2xl font-serif">
            Most Popular Golfer Picks
          </h2>
        </div>
        
        <div className="p-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedGolfers.map(([golfer, count], index) => (
              <div 
                key={golfer} 
                className={`flex justify-between items-center py-2 px-3 border-b ${
                  index % 2 === 0 ? "" : "bg-masters-yellow bg-opacity-10"
                } cursor-pointer hover:bg-masters-green/5 transition-colors rounded`}
                onClick={() => setActiveGolfer(activeGolfer === golfer ? null : golfer)}
              >
                <span className="font-medium">
                  {golfer}
                  {activeGolfer === golfer && 
                    <span className="ml-2 text-xs text-masters-green">(filtering)</span>
                  }
                </span>
                <span className="bg-masters-green text-white px-2 py-1 rounded-full text-sm">
                  {count} pick{count !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSelectionsTable;
