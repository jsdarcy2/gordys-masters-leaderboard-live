
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "@/components/ui/image";

// Masters Golf Tournament Champions data
const MASTERS_CHAMPIONS = [
  { year: 2023, winner: "Jon Rahm", country: "Spain", score: "-12", runnerUp: "Brooks Koepka" },
  { year: 2022, winner: "Scottie Scheffler", country: "United States", score: "-10", runnerUp: "Rory McIlroy" },
  { year: 2021, winner: "Hideki Matsuyama", country: "Japan", score: "-10", runnerUp: "Will Zalatoris" },
  { year: 2020, winner: "Dustin Johnson", country: "United States", score: "-20", runnerUp: "Cameron Smith" },
  { year: 2019, winner: "Tiger Woods", country: "United States", score: "-13", runnerUp: "Dustin Johnson" },
  { year: 2018, winner: "Patrick Reed", country: "United States", score: "-15", runnerUp: "Rickie Fowler" },
  { year: 2017, winner: "Sergio Garcia", country: "Spain", score: "-9", runnerUp: "Justin Rose" },
  { year: 2016, winner: "Danny Willett", country: "England", score: "-5", runnerUp: "Jordan Spieth" },
  { year: 2015, winner: "Jordan Spieth", country: "United States", score: "-18", runnerUp: "Phil Mickelson" },
  { year: 2014, winner: "Bubba Watson", country: "United States", score: "-8", runnerUp: "Jonas Blixt" },
  { year: 2013, winner: "Adam Scott", country: "Australia", score: "-9", runnerUp: "Angel Cabrera" },
  { year: 2012, winner: "Bubba Watson", country: "United States", score: "-10", runnerUp: "Louis Oosthuizen" },
  { year: 2011, winner: "Charl Schwartzel", country: "South Africa", score: "-14", runnerUp: "Jason Day" },
  { year: 2010, winner: "Phil Mickelson", country: "United States", score: "-16", runnerUp: "Lee Westwood" },
  { year: 2009, winner: "Angel Cabrera", country: "Argentina", score: "-12", runnerUp: "Kenny Perry" },
  { year: 2008, winner: "Trevor Immelman", country: "South Africa", score: "-8", runnerUp: "Tiger Woods" },
  { year: 2007, winner: "Zach Johnson", country: "United States", score: "+1", runnerUp: "Tiger Woods" },
  { year: 2006, winner: "Phil Mickelson", country: "United States", score: "-7", runnerUp: "Tim Clark" },
  { year: 2005, winner: "Tiger Woods", country: "United States", score: "-12", runnerUp: "Chris DiMarco" },
  { year: 2004, winner: "Phil Mickelson", country: "United States", score: "-9", runnerUp: "Ernie Els" },
];

// Iconic Masters Champions with achievements
const ICONIC_CHAMPIONS = [
  { 
    name: "Tiger Woods", 
    wins: 5, 
    years: [1997, 2001, 2002, 2005, 2019], 
    achievement: "Youngest Masters champion in 1997, and oldest champion (at time of win) in 2019",
    image: "/lovable-uploads/d67f073e-cc05-44af-a4eb-2e7778b4c7be.png"
  },
  { 
    name: "Jack Nicklaus", 
    wins: 6, 
    years: [1963, 1965, 1966, 1972, 1975, 1986], 
    achievement: "Most Masters victories (6) and oldest champion at age 46 in 1986",
    image: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=800&q=80"
  },
  { 
    name: "Arnold Palmer", 
    wins: 4, 
    years: [1958, 1960, 1962, 1964], 
    achievement: "Won four times in a seven-year span, helped popularize the Masters globally",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80"
  },
  { 
    name: "Phil Mickelson", 
    wins: 3, 
    years: [2004, 2006, 2010], 
    achievement: "Left-handed champion with iconic leap after winning his first major in 2004",
    image: "https://images.unsplash.com/photo-1560089001-7a5f26afe81f?auto=format&fit=crop&w=800&q=80"
  },
];

const MastersChampions = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'iconic'>('recent');
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex-col space-y-1.5">
          <CardTitle className="text-xl md:text-2xl font-serif text-masters-green flex items-center">
            <Trophy size={24} className="text-masters-gold mr-2" />
            Masters Tournament Champions
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4">
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-4 py-2 rounded-md font-serif ${
                  activeTab === 'recent' 
                    ? "bg-masters-green text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Recent Champions
              </button>
              <button
                onClick={() => setActiveTab('iconic')}
                className={`px-4 py-2 rounded-md font-serif ${
                  activeTab === 'iconic' 
                    ? "bg-masters-green text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Iconic Champions
              </button>
            </div>
            
            {activeTab === 'recent' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-masters-green">
                      <TableHead className="font-serif font-medium text-masters-green">Year</TableHead>
                      <TableHead className="font-serif font-medium text-masters-green">Champion</TableHead>
                      <TableHead className="font-serif font-medium text-masters-green">Country</TableHead>
                      <TableHead className="font-serif font-medium text-masters-green">Score</TableHead>
                      <TableHead className="font-serif font-medium text-masters-green">Runner-Up</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MASTERS_CHAMPIONS.map((champion, index) => (
                      <TableRow 
                        key={index} 
                        className={`border-b ${index === 0 ? "bg-masters-light" : ""}`}
                      >
                        <TableCell className="font-medium">{champion.year}</TableCell>
                        <TableCell>
                          {index === 0 && (
                            <span className="inline-flex items-center">
                              <Trophy size={16} className="text-masters-gold mr-2" />
                              <span className="font-medium">{champion.winner}</span>
                            </span>
                          )}
                          {index !== 0 && champion.winner}
                        </TableCell>
                        <TableCell>{champion.country}</TableCell>
                        <TableCell>{champion.score}</TableCell>
                        <TableCell>{champion.runnerUp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {activeTab === 'iconic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ICONIC_CHAMPIONS.map((champion, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="flex flex-col h-full">
                      {champion.image && (
                        <div className="w-full h-56">
                          <Image 
                            src={champion.image} 
                            alt={`${champion.name} - Masters Champion`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-xl font-serif font-medium text-masters-green">{champion.name}</h3>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">{champion.wins} wins:</span>{" "}
                          {champion.years.join(", ")}
                        </p>
                        <p className="mt-2 text-gray-700">{champion.achievement}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-8 p-4 bg-masters-light rounded-md">
            <h3 className="text-lg font-serif font-medium text-masters-green mb-4">
              Tournament Facts
            </h3>
            <ul className="space-y-2">
              <li><span className="font-medium">First played:</span> 1934</li>
              <li><span className="font-medium">Most wins:</span> Jack Nicklaus (6)</li>
              <li><span className="font-medium">Youngest winner:</span> Tiger Woods (21 years, 3 months, 14 days in 1997)</li>
              <li><span className="font-medium">Oldest winner:</span> Jack Nicklaus (46 years, 2 months, 23 days in 1986)</li>
              <li><span className="font-medium">Lowest score:</span> Dustin Johnson (268, -20 in 2020)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MastersChampions;
