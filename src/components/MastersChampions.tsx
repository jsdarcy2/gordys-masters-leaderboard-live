import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Clock, History } from "lucide-react";
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

// Tournament History data with rich historical content and authentic Masters photos
const TOURNAMENT_HISTORY = [
  { 
    title: "Founding Legacy",
    year: "1934",
    description: "The Masters Tournament was founded by Bobby Jones and Clifford Roberts, with Horton Smith becoming the first champion.",
    image: "/lovable-uploads/986e7321-f375-4033-b344-533298c15ed9.png",
    caption: "Augusta National Golf Club during its early years, home of the Masters since 1934"
  },
  { 
    title: "Champions Dinner",
    year: "1952-Present",
    description: "The Champions Dinner tradition began in 1952 when Ben Hogan hosted a dinner for past champions. Each year, the defending champion selects the menu.",
    image: "/lovable-uploads/166641be-8071-4d12-8c62-62e4cc60c622.png",
    caption: "The exclusive Champions Dinner brings together Masters winners annually at Augusta National" 
  },
  { 
    title: "Green Jacket Tradition",
    year: "1949-Present",
    description: "The iconic green jacket was first awarded to Sam Snead in 1949, becoming the symbol of Masters victory and membership at Augusta National.",
    image: "/lovable-uploads/901c5e70-1860-4dee-9076-58f0c0284cf8.png", 
    caption: "Tiger Woods receives his fifth green jacket from 2018 champion Patrick Reed"
  },
  { 
    title: "Iconic Champions",
    year: "All-Time Greats",
    description: "Jack Nicklaus (6 wins), Tiger Woods (5), and Arnold Palmer (4) have defined the tournament's rich history with their remarkable achievements.",
    image: "/lovable-uploads/cc5f5185-a821-4142-88d3-584a41df9b56.png",
    caption: "Golf's 'Big Three': Jack Nicklaus, Arnold Palmer, and Gary Player at the ceremonial opening tee shot"
  },
];

// Iconic Masters Champions with achievements
const ICONIC_CHAMPIONS = [
  { 
    name: "Tiger Woods", 
    wins: 5, 
    years: [1997, 2001, 2002, 2005, 2019], 
    achievement: "Youngest Masters champion in 1997, and oldest champion (at time of win) in 2019",
    image: "/lovable-uploads/901c5e70-1860-4dee-9076-58f0c0284cf8.png"
  },
  { 
    name: "Jack Nicklaus", 
    wins: 6, 
    years: [1963, 1965, 1966, 1972, 1975, 1986], 
    achievement: "Most Masters victories (6) and oldest champion at age 46 in 1986",
    image: "/lovable-uploads/46d56b9a-f59d-4336-9503-64a0cdf20d88.png"
  },
  { 
    name: "Arnold Palmer", 
    wins: 4, 
    years: [1958, 1960, 1962, 1964], 
    achievement: "Won four times in a seven-year span, helped popularize the Masters globally",
    image: "/lovable-uploads/393fdaac-022a-4ace-beb2-de5133016b85.png"
  },
  { 
    name: "Phil Mickelson", 
    wins: 3, 
    years: [2004, 2006, 2010], 
    achievement: "Left-handed champion with iconic leap after winning his first major in 2004",
    image: "/lovable-uploads/d67f073e-cc05-44af-a4eb-2e7778b4c7be.png"
  },
];

const MastersChampions = () => {
  const [activeTab, setActiveTab] = useState<'champions' | 'history'>('champions');
  
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
                onClick={() => setActiveTab('champions')}
                className={`px-4 py-2 rounded-md font-serif ${
                  activeTab === 'champions' 
                    ? "bg-masters-green text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Past Masters Champions
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-md font-serif ${
                  activeTab === 'history' 
                    ? "bg-masters-green text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tournament History
              </button>
            </div>
            
            {activeTab === 'champions' && (
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
            
            {activeTab === 'history' && (
              <div className="space-y-8">
                {TOURNAMENT_HISTORY.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/2 h-64 md:h-auto">
                        <Image 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          overlay={
                            <div className="p-4 absolute bottom-0 left-0 text-white">
                              <h4 className="text-lg font-serif font-medium">{item.title}</h4>
                              <p className="text-sm opacity-90">{item.year}</p>
                            </div>
                          }
                          overlayClassName="bg-gradient-to-t from-black to-transparent"
                          overlayOpacity={70}
                        />
                      </div>
                      <div className="p-6 md:w-1/2">
                        <div className="mb-2 flex items-center">
                          <History size={18} className="text-masters-green mr-2" />
                          <h3 className="text-xl font-serif font-medium text-masters-green">{item.title}</h3>
                        </div>
                        <div className="mb-4">
                          <span className="inline-block bg-masters-light text-masters-green text-sm px-2 py-1 rounded font-medium">
                            {item.year}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{item.description}</p>
                        <p className="text-sm text-gray-500 italic">{item.caption}</p>
                      </div>
                    </div>
                  </Card>
                ))}

                <div className="mt-4 bg-masters-light rounded-lg p-5">
                  <h3 className="font-serif text-lg font-medium text-masters-green mb-3 flex items-center">
                    <Award className="mr-2 text-masters-gold" size={20} /> 
                    Multiple Champions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {ICONIC_CHAMPIONS.map((champion, index) => (
                      <div key={index} className="bg-white rounded-md overflow-hidden shadow-sm">
                        <div className="h-36 overflow-hidden">
                          <Image 
                            src={champion.image} 
                            alt={champion.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <div className="font-medium text-masters-green">{champion.name}</div>
                          <div className="text-sm text-gray-600">
                            <span className="text-masters-gold font-medium">{champion.wins} wins</span>: {champion.years.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 p-4 bg-masters-light rounded-md">
            <h3 className="text-lg font-serif font-medium text-masters-green mb-4 flex items-center">
              <Clock className="mr-2 text-masters-gold" size={18} />
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
