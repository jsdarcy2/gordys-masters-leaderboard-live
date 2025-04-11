
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

interface TeamSelection {
  id: number;
  name: string;
  picks: string[];
}

const completeTeamSelections: TeamSelection[] = [
  { id: 1, name: "Ben Applebaum", picks: ["Rory McIlroy", "Xander Schauffele", "Shane Lowry", "Tommy Fleetwood", "Robert MacIntyre"] },
  { id: 2, name: "Elia Ayaz", picks: ["Jon Rahm", "Bryson DeChambeau", "Cameron Smith", "Sergio Garcia", "Joaquín Niemann"] },
  { id: 3, name: "Mike Baker", picks: ["Rory McIlroy", "Scottie Scheffler", "Sepp Straka", "Russell Henley", "Joaquín Niemann"] },
  { id: 4, name: "Louis Baker", picks: ["Scottie Scheffler", "Collin Morikawa", "Shane Lowry", "Joaquín Niemann", "Min Woo Lee"] },
  { id: 5, name: "Ross Baker", picks: ["Jon Rahm", "Rory McIlroy", "Brooks Koepka", "Justin Thomas", "Russell Henley"] },
  { id: 6, name: "Peter Bassett", picks: ["Joaquín Niemann", "Bryson DeChambeau", "Sepp Straka", "Akshay Bhatia", "Rory McIlroy"] },
  { id: 7, name: "Ted Beckman", picks: ["Scottie Scheffler", "Bryson DeChambeau", "Keegan Bradley", "Wyndham Clark", "Sahith Theegala"] },
  { id: 8, name: "Hilary Beckman", picks: ["Rory McIlroy", "Collin Morikawa", "Justin Thomas", "Sepp Straka", "Will Zalatoris"] },
  { id: 9, name: "Oliver Beckman", picks: ["Rory McIlroy", "Jon Rahm", "Min Woo Lee", "Justin Thomas", "Tony Finau"] },
  { id: 10, name: "Jimmy Beltz", picks: ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Cameron Smith", "Min Woo Lee"] },
  { id: 11, name: "Peter Beugg", picks: ["Adam Scott", "Dustin Johnson", "Rory McIlroy", "Jon Rahm", "Tommy Fleetwood"] },
  { id: 12, name: "James Carlson", picks: ["Scottie Scheffler", "Bryson DeChambeau", "Tommy Fleetwood", "Hideki Matsuyama", "Shane Lowry"] },
  { id: 13, name: "Nate Carlson", picks: ["Scottie Scheffler", "Collin Morikawa", "Tommy Fleetwood", "Cameron Smith", "Justin Thomas"] },
  { id: 14, name: "Annie Carlson", picks: ["Rory McIlroy", "Xander Schauffele", "Brooks Koepka", "Patrick Cantlay", "Justin Thomas"] },
  { id: 15, name: "Hadley Carlson", picks: ["Scottie Scheffler", "Rory McIlroy", "Tommy Fleetwood", "Cameron Smith", "Russell Henley"] },
  { id: 16, name: "Quinn Carlson", picks: ["Rory McIlroy", "Ludvig Åberg", "Sepp Straka", "Robert MacIntyre", "Matthieu Pavon"] },
  { id: 17, name: "Ed Corbett", picks: ["Scottie Scheffler", "Rory McIlroy", "Shane Lowry", "Will Zalatoris", "Sepp Straka"] },
  { id: 18, name: "Chuck Corbett Sr", picks: ["Rory McIlroy", "Scottie Scheffler", "Will Zalatoris", "Joaquín Niemann", "Tommy Fleetwood"] },
  { id: 19, name: "Chris Crawford", picks: ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Cameron Smith", "Tyrrell Hatton"] },
  { id: 20, name: "Justin Darcy", picks: ["Rory McIlroy", "Collin Morikawa", "Shane Lowry", "Robert MacIntyre", "Sepp Straka"] },
  { id: 21, name: "Holland Darcy", picks: ["Jordan Spieth", "Collin Morikawa", "Xander Schauffele", "Viktor Hovland", "Jose Luis Ballester (a)"] },
  { id: 22, name: "Audrey Darcy", picks: ["Scottie Scheffler", "Rory McIlroy", "Cameron Smith", "Cameron Young", "Zach Johnson"] },
  { id: 23, name: "Ava Rose Darcy", picks: ["Wyndham Clark", "Justin Rose", "Jon Rahm", "Scottie Scheffler", "Viktor Hovland"] },
  { id: 24, name: "Jay Despard", picks: ["Scottie Scheffler", "Collin Morikawa", "Min Woo Lee", "Russell Henley", "Robert MacIntyre"] },
  { id: 25, name: "Pete Drago", picks: ["Scottie Scheffler", "Collin Morikawa", "Patrick Cantlay", "Sergio Garcia", "Sepp Straka"] },
  { id: 26, name: "Alexa Drago", picks: ["Xander Schauffele", "Scottie Scheffler", "Patrick Cantlay", "Jordan Spieth", "Hideki Matsuyama"] },
  { id: 27, name: "Ollie Drago", picks: ["Scottie Scheffler", "Jon Rahm", "Patrick Cantlay", "Sergio Garcia", "Patrick Reed"] },
  { id: 28, name: "Charlie Drago", picks: ["Jon Rahm", "Collin Morikawa", "Patrick Cantlay", "Patrick Reed", "Jordan Spieth"] },
  { id: 29, name: "Adam Duff", picks: ["Scottie Scheffler", "Collin Morikawa", "Brooks Koepka", "Viktor Hovland", "Cameron Smith"] },
  { id: 30, name: "Tilly Duff", picks: ["Rory McIlroy", "Bryson DeChambeau", "Shane Lowry", "Brooks Koepka", "Tommy Fleetwood"] },
  { id: 31, name: "Gretchen Duff", picks: ["Ludvig Åberg", "Xander Schauffele", "Tommy Fleetwood", "Hideki Matsuyama", "Russell Henley"] },
  { id: 32, name: "Charles Elder", picks: ["Scottie Scheffler", "Rory McIlroy", "Robert MacIntyre", "Joaquín Niemann", "Hideki Matsuyama"] },
  { id: 33, name: "Eric Fox", picks: ["Bryson DeChambeau", "Rory McIlroy", "Wyndham Clark", "Viktor Hovland", "Sepp Straka"] },
  { id: 34, name: "Kyle Flippen", picks: ["Scottie Scheffler", "Rory McIlroy", "Min Woo Lee", "Jordan Spieth", "Brian Harman"] },
  { id: 35, name: "J.J. Furst", picks: ["Scottie Scheffler", "Xander Schauffele", "Will Zalatoris", "Hideki Matsuyama", "Joaquín Niemann"] },
  { id: 36, name: "Brian Ginkel", picks: ["Scottie Scheffler", "Ludvig Åberg", "Justin Thomas", "Min Woo Lee", "Brooks Koepka"] },
  { id: 37, name: "Grayson Ginkel", picks: ["Scottie Scheffler", "Rory McIlroy", "Patrick Cantlay", "Hideki Matsuyama", "Jordan Spieth"] },
  { id: 38, name: "Mik Gusenius", picks: ["Collin Morikawa", "Xander Schauffele", "Brooks Koepka", "Justin Thomas", "Jordan Spieth"] },
  { id: 39, name: "John Gustafson", picks: ["Rory McIlroy", "Ludvig Åberg", "Jordan Spieth", "Justin Thomas", "Hideki Matsuyama"] },
  { id: 40, name: "Andy Gustafson", picks: ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Brooks Koepka", "Hideki Matsuyama"] },
  { id: 41, name: "Lily Gustafson", picks: ["Collin Morikawa", "Bryson DeChambeau", "Cameron Smith", "Justin Thomas", "Russell Henley"] },
  { id: 42, name: "David Hardt", picks: ["Rory McIlroy", "Scottie Scheffler", "Will Zalatoris", "Joaquín Niemann", "Brooks Koepka"] },
  { id: 43, name: "Brack Herfurth", picks: ["Jon Rahm", "Xander Schauffele", "Joaquín Niemann", "Tommy Fleetwood", "Sungjae Im"] },
  { id: 44, name: "Darby Herfurth", picks: ["Rory McIlroy", "Ludvig Åberg", "Patrick Cantlay", "Corey Conners", "Sepp Straka"] },
  { id: 45, name: "Henry Herfurth", picks: ["Collin Morikawa", "Hideki Matsuyama", "Wyndham Clark", "Cameron Smith", "Chris Kirk"] },
  { id: 46, name: "Jess Herfurth", picks: ["Rory McIlroy", "Xander Schauffele", "Russell Henley", "Justin Thomas", "Tommy Fleetwood"] },
  { id: 47, name: "Decker Herfurth", picks: ["Rory McIlroy", "Ludvig Åberg", "Russell Henley", "Sepp Straka", "Hideki Matsuyama"] },
  { id: 48, name: "Rachel Herfurth", picks: ["Rory McIlroy", "Collin Morikawa", "Viktor Hovland", "Justin Thomas", "Tommy Fleetwood"] },
  { id: 49, name: "Amy Jones", picks: ["Rory McIlroy", "Jon Rahm", "Justin Thomas", "Brooks Koepka", "Tommy Fleetwood"] },
  { id: 50, name: "Jim Jones", picks: ["Scottie Scheffler", "Collin Morikawa", "Joaquín Niemann", "Jordan Spieth", "Will Zalatoris"] },
  { id: 51, name: "Carter Jones", picks: ["Tony Finau", "Bryson DeChambeau", "Viktor Hovland", "Hideki Matsuyama", "Xander Schauffele"] },
  { id: 52, name: "Davis Jones", picks: ["Scottie Scheffler", "Bryson DeChambeau", "Justin Thomas", "Patrick Cantlay", "Shane Lowry"] },
  { id: 53, name: "Sargent Johnson", picks: ["Rory McIlroy", "Collin Morikawa", "Robert MacIntyre", "Cameron Smith", "Justin Thomas"] },
  { id: 54, name: "Sargent Johnson, Jr.", picks: ["Scottie Scheffler", "Xander Schauffele", "Russell Henley", "Justin Thomas", "Jordan Spieth"] },
  { id: 55, name: "Chris Kelley", picks: ["Scottie Scheffler", "Rory McIlroy", "Cameron Smith", "Sepp Straka", "Russell Henley"] },
  { id: 56, name: "Paul Kelley", picks: ["Rory McIlroy", "Akshay Bhatia", "Tom Hoge", "Jordan Spieth", "Ludvig Åberg"] },
  { id: 57, name: "Peter Kepic Jr.", picks: ["Rory McIlroy", "Bryson DeChambeau", "Shane Lowry", "Jordan Spieth", "Dustin Johnson"] },
  { id: 58, name: "Sarah Kepic", picks: ["Brooks Koepka", "Tommy Fleetwood", "Will Zalatoris", "Cameron Smith", "Dustin Johnson"] },
  { id: 59, name: "Peter Kepic Sr.", picks: ["Scottie Scheffler", "Rory McIlroy", "Justin Thomas", "Hideki Matsuyama", "Min Woo Lee"] },
  { id: 60, name: "Owen Kepic", picks: ["Scottie Scheffler", "Min Woo Lee", "Will Zalatoris", "Ludvig Åberg", "Brooks Koepka"] },
  { id: 61, name: "Max Kepic", picks: ["Scottie Scheffler", "Bryson DeChambeau", "Justin Thomas", "Viktor Hovland", "Hideki Matsuyama"] },
  { id: 62, name: "Greg Kevane", picks: ["Rory McIlRoy", "Collin Morikawa", "Sepp Straka", "Corey Conners", "Russell Henley"] },
  { id: 63, name: "Rory Kevane", picks: ["Collin Morikawa", "Rory McIlroy", "Shane Lowry", "Russell Henley", "Min Woo Lee"] },
  { id: 64, name: "Andy Koch", picks: ["Bryson DeChambeau", "Jon Rahm", "Patrick Cantlay", "Shane Lowry", "Brooks Koepka"] },
  { id: 65, name: "Chad Kollar", picks: ["Collin Morikawa", "Justin Thomas", "Brooks Koepka", "Hideki Matsuyama", "Patrick Cantlay"] },
  { id: 66, name: "Pete Kostroski", picks: ["Rory McIlroy", "Ludvig Åberg", "Joaquín Niemann", "Tommy Fleetwood", "Shane Lowry"] },
  { id: 67, name: "Dan Lenmark", picks: ["Xander Schauffele", "Scottie Scheffler", "Cameron Smith", "Justin Thomas", "Will Zalatoris"] },
  { id: 68, name: "Jack Lenmark", picks: ["Xander Schauffele", "Rory McIlroy", "Patrick Cantlay", "Shane Lowry", "Matt Fitzpatrick"] },
  { id: 69, name: "Jamie Lockhart", picks: ["Scottie Scheffler", "Jon Rahm", "Will Zalatoris", "Brooks Koepka", "Joaquín Niemann"] },
  { id: 70, name: "Rollie Logan", picks: ["Tony Finau", "Viktor Hovland", "Justin Thomas", "Scottie Scheffler", "Rory McIlroy"] },
  { id: 71, name: "Bo Massopust", picks: ["Scottie Scheffler", "Rory McIlroy", "Brooks Koepka", "Justin Thomas", "Tom Kim"] },
  { id: 72, name: "Elle McClintock", picks: ["Rory McIlroy", "Collin Morikawa", "Hideki Matsuyama", "Jordan Spieth", "Brooks Koepka"] },
  { id: 73, name: "Jenny McClintock", picks: ["Collin Morikawa", "Rory McIlroy", "Justin Thomas", "Hideki Matsuyama", "Russell Henley"] },
  { id: 74, name: "Peggy McClintock", picks: ["Scottie Scheffler", "Collin Morikawa", "Wyndham Clark", "Will Zalatoris", "Sepp Straka"] },
  { id: 75, name: "Kevin McClintock", picks: ["Rory McIlroy", "Collin Morikawa", "Justin Thomas", "Will Zalatoris", "Russell Henley"] },
  { id: 76, name: "Rich McClintock", picks: ["Rory McIlroy", "Scottie Scheffler", "Hideki Matsuyama", "Shane Lowry", "Billy Horschel"] },
  { id: 77, name: "Johnny McWhite", picks: ["Scottie Scheffler", "Jon Rahm", "Jordan Spieth", "Hideki Matsuyama", "Justin Thomas"] },
  { id: 78, name: "Charles Meech Jr", picks: ["Dustin Johnson", "Scottie Scheffler", "Viktor Hovland", "Brooks Koepka", "Bryson DeChambeau"] },
  { id: 79, name: "Jon Moseley", picks: ["Rory McIlroy", "Collin Morikawa", "Robert MacIntyre", "Shane Lowry", "Russell Henley"] },
  { id: 80, name: "Chad Murphy", picks: ["Joaquín Niemann", "Ludvig Åberg", "Min Woo Lee", "Justin Thomas", "Rory McIlroy"] },
  { id: 81, name: "C.J. Nibbe", picks: ["Rory McIlroy", "Jon Rahm", "Justin Thomas", "Robert MacIntyre", "Min Woo Lee"] },
  { id: 82, name: "Nash Nibbe", picks: ["Rory McIlroy", "Scottie Scheffler", "Min Woo Lee", "Shane Lowry", "Viktor Hovland"] },
  { id: 83, name: "Knox Nibbe", picks: ["Scottie Scheffler", "Jon Rahm", "Justin Thomas", "Patrick Cantlay", "Brooks Koepka"] },
  { id: 84, name: "Julie Nibbe", picks: ["Rory McIlroy", "Collin Morikawa", "Justin Thomas", "Brooks Koepka", "Jordan Spieth"] },
  { id: 85, name: "Jay Perlmutter", picks: ["Russell Henley", "Corey Conners", "Sepp Straka", "Rory McIlroy", "Collin Morikawa"] },
  { id: 86, name: "Les Perry", picks: ["Bryson DeChambeau", "Rory McIlroy", "Sergio Garcia", "Brooks Koepka", "Viktor Hovland"] },
  { id: 87, name: "James Petrikas Sr.", picks: ["Scottie Scheffler", "Rory McIlroy", "Brooks Koepka", "Jordan Spieth", "Justin Thomas"] },
  { id: 88, name: "James Petrikas Jr.", picks: ["Scottie Scheffler", "Ludvig Åberg", "Will Zalatoris", "Brooks Koepka", "Shane Lowry"] },
  { id: 89, name: "Davey Phelps", picks: ["Scottie Scheffler", "Rory McIlroy", "Akshay Bhatia", "Will Zalatoris", "Sepp Straka"] },
  { id: 90, name: "Will Phelps", picks: ["Rory McIlroy", "Scottie Scheffler", "Justin Thomas", "Brooks Koepka", "Shane Lowry"] },
  { id: 91, name: "Phil Present Jr.", picks: ["Scottie Scheffler", "Rory McIlroy", "Cameron Smith", "Russell Henley", "Joaquín Niemann"] },
  { id: 92, name: "Phil Present III", picks: ["Scottie Scheffler", "Ludvig Åberg", "Brooks Koepka", "Tommy Fleetwood", "Justin Thomas"] },
  { id: 93, name: "Ravi Ramalingam", picks: ["Xander Schauffele", "Rory McIlroy", "Sepp Straka", "Shane Lowry", "Will Zalatoris"] },
  { id: 94, name: "Charlotte Ramalingam", picks: ["Scottie Scheffler", "Rory McIlroy", "Jordan Spieth", "Justin Thomas", "Justin Rose"] },
  { id: 95, name: "Matt Rogers", picks: ["Scottie Scheffler", "Bryson DeChambeau", "Shane Lowry", "Jason Day", "Dustin Johnson"] },
  { id: 96, name: "Roth Sanner", picks: ["Scottie Scheffler", "Collin Morikawa", "Patrick Cantlay", "Cameron Smith", "Akshay Bhatia"] },
  { id: 97, name: "John Saunders", picks: ["Scottie Scheffler", "Rory McIlroy", "Joaquín Niemann", "Tommy Fleetwood", "Sahith Theegala"] },
  { id: 98, name: "Jackson Saunders", picks: ["Scottie Scheffler", "Xander Schauffele", "Will Zalatoris", "Cameron Smith", "Viktor Hovland"] },
  { id: 99, name: "Donny Schmitt", picks: ["Rory McIlroy", "Tom Hoge", "Collin Morikawa", "Sepp Straka", "Justin Thomas"] },
  { id: 100, name: "Ryan Schmitt", picks: ["Rory McIlroy", "Scottie Scheffler", "Justin Thomas", "Wyndham Clark", "Russell Henley"] },
  { id: 101, name: "Jon Schwingler", picks: ["Rory McIlroy", "Scottie Scheffler", "Jordan Spieth", "Tommy Fleetwood", "Akshay Bhatia"] },
  { id: 102, name: "Toby Schwingler", picks: ["Collin Morikawa", "Rory McIlroy", "Shane Lowry", "Viktor Hovland", "Russell Henley"] },
  { id: 103, name: "Jack Simmons", picks: ["Jon Rahm", "Rory McIlroy", "Shane Lowry", "Sepp Straka", "Sergio Garcia"] },
  { id: 104, name: "Hayden Simmons", picks: ["Scottie Scheffler", "Xander Schauffele", "Russell Henley", "Billy Horschel", "Justin Thomas"] },
  { id: 105, name: "Tommy Simmons", picks: ["Shane Lowry", "Collin Morikawa", "Will Zalatoris", "J.J. Spaun", "Denny McCarthy"] },
  { id: 106, name: "Victoria Simmons", picks: ["Russell Henley", "Brooks Koepka", "Robert MacIntyre", "Xander Schauffele", "Rory McIlroy"] },
  { id: 107, name: "Tyler Smith", picks: ["Rory McIlroy", "Brooks Koepka", "Danny Willett", "Scottie Scheffler", "Hideki Matsuyama"] },
  { id: 108, name: "Stuie Snyder", picks: ["Rory McIlroy", "Scottie Scheffler", "Cameron Smith", "Justin Thomas", "Denny McCarthy"] },
  { id: 109, name: "Steve Sorenson", picks: ["Rory McIlroy", "Ludvig Åberg", "Keegan Bradley", "Tommy Fleetwood", "Justin Rose"] },
  { id: 110, name: "Katie Stephens", picks: ["Ludvig Åberg", "Wyndham Clark", "Nick Dunlap", "Brooks Koepka", "Scottie Scheffler"] },
  { id: 111, name: "Reven Stephens", picks: ["Rory McIlroy", "Collin Morikawa", "Joaquín Niemann", "Tommy Fleetwood", "Shane Lowry"] },
  { id: 112, name: "Winfield Stephens", picks: ["Xander Schauffele", "Rory McIlroy", "Russell Henley", "Jordan Spieth", "Justin Thomas"] },
  { id: 113, name: "Caelin Stephens", picks: ["Rory McIlroy", "Bryson DeChambeau", "Min Woo Lee", "Jordan Spieth", "Justin Thomas"] },
  { id: 114, name: "Bette Stephens", picks: ["Viktor Hovland", "Scottie Scheffler", "Zach Johnson", "Rory McIlroy", "Denny McCarthy"] },
  { id: 115, name: "Debbie Stofer", picks: ["Rory McIlroy", "Collin Morikawa", "Shane Lowry", "Russell Henley", "Joaquín Niemann"] },
  { id: 116, name: "Gordon Stofer Jr.", picks: ["Scottie Scheffler", "Bryson DeChambeau", "Tony Finau", "Justin Thomas", "Min Woo Lee"] },
  { id: 117, name: "Jimmy Stofer", picks: ["Collin Morikawa", "Rory McIlroy", "Justin Thomas", "Hideki Matsuyama", "Tommy Fleetwood"] },
  { id: 118, name: "Teddy Stofer", picks: ["Rory McIlroy", "Collin Morikawa", "Hideki Matsuyama", "Shane Lowry", "Russell Henley"] },
  { id: 119, name: "Eileen Stofer", picks: ["Bryson DeChambeau", "Ludvig Åberg", "Tommy Fleetwood", "Jordan Spieth", "Robert MacIntyre"] },
  { id: 120, name: "Cora Stofer", picks: ["Bryson DeChambeau", "Jon Rahm", "Joaquín Niemann", "Brooks Koepka", "Tyrrell Hatton"] },
  { id: 121, name: "Gordon Stofer III", picks: ["Rory McIlroy", "Ludvig Åberg", "Brooks Koepka", "Max Homa", "Jordan Spieth"] },
  { id: 122, name: "Addie Stofer", picks: ["Scottie Scheffler", "Rory McIlroy", "Shane Lowry", "Cameron Smith", "Robert MacIntyre"] },
  { id: 123, name: "Ford Stofer", picks: ["Rory McIlroy", "Collin Morikawa", "Jordan Spieth", "Joaquín Niemann", "Tom Kim"] },
  { id: 124, name: "Sylas Stofer", picks: ["Scottie Scheffler", "Bryson DeChambeau", "Akshay Bhatia", "Jordan Spieth", "Russell Henley"] },
  { id: 125, name: "Robby Stofer", picks: ["Rory McIlroy", "Ludvig Åberg", "Will Zalatoris", "Robert MacIntyre", "Russell Henley"] },
  { id: 126, name: "Jon Sturgis", picks: ["Rory McIlroy", "Collin Morikawa", "Corey Conners", "Russell Henley", "Shane Lowry"] },
  { id: 127, name: "Avery Sturgis", picks: ["Scottie Scheffler", "Rory McIlroy", "Hideki Matsuyama", "Sergio Garcia", "Jason Day"] },
  { id: 128, name: "Ethan Sturgis", picks: ["Collin Morikawa", "Ludvig Åberg", "Tom Kim", "Will Zalatoris", "Phil Mickelson"] },
  { id: 129, name: "Sarah Sturgis", picks: ["Bryson DeChambeau", "Scottie Scheffler", "Shane Lowry", "Brooks Koepka", "Jordan Spieth"] },
  { id: 130, name: "Scott Tande", picks: ["Scottie Scheffler", "Collin Morikawa", "Russell Henley", "Justin Thomas", "Sepp Straka"] },
  { id: 131, name: "Jess Troyak", picks: ["Rory McIlroy", "Ludvig Åberg", "Hideki Matsuyama", "Will Zalatoris", "Akshay Bhatia"] },
  { id: 132, name: "Chris Willette", picks: ["Collin Morikawa", "Ludvig Åberg", "Justin Thomas", "Joaquín Niemann", "Russell Henley"] }
];

const TeamSelectionsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAll, setShowAll] = useState<boolean>(false);
  const [activeGolfer, setActiveGolfer] = useState<string | null>(null);
  
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
