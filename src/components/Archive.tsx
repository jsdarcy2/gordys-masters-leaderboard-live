
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const PAST_WINNERS = [
  { year: 2023, winner: "David Wilson", golfer: "Jon Rahm" },
  { year: 2022, winner: "Sarah Williams", golfer: "Scottie Scheffler" },
  { year: 2021, winner: "Mike Johnson", golfer: "Hideki Matsuyama" },
  { year: 2020, winner: "Jessica Brown", golfer: "Dustin Johnson" },
  { year: 2019, winner: "Tom Davis", golfer: "Tiger Woods" },
  { year: 2018, winner: "Ryan Murphy", golfer: "Patrick Reed" },
  { year: 2017, winner: "John Smith", golfer: "Sergio Garcia" },
  { year: 2016, winner: "Laura White", golfer: "Danny Willett" },
  { year: 2015, winner: "Kevin Martin", golfer: "Jordan Spieth" },
  { year: 2014, winner: "Emily Clark", golfer: "Bubba Watson" },
  { year: 2013, winner: "David Wilson", golfer: "Adam Scott" },
  { year: 2012, winner: "Mike Johnson", golfer: "Bubba Watson" },
  { year: 2011, winner: "Tom Davis", golfer: "Charl Schwartzel" },
  { year: 2010, winner: "John Smith", golfer: "Phil Mickelson" },
  { year: 2009, winner: "Ryan Murphy", golfer: "Angel Cabrera" },
  { year: 2008, winner: "Kevin Martin", golfer: "Trevor Immelman" },
  { year: 2007, winner: "Laura White", golfer: "Zach Johnson" },
  { year: 2006, winner: "Sarah Williams", golfer: "Phil Mickelson" },
  { year: 2005, winner: "Jessica Brown", golfer: "Tiger Woods" },
  { year: 2004, winner: "Emily Clark", golfer: "Phil Mickelson" },
];

const Archive = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-serif text-masters-green">
          Past Champions Archive
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b-2 border-masters-green">
                <th className="px-4 py-3 font-serif font-medium text-masters-green">Year</th>
                <th className="px-4 py-3 font-serif font-medium text-masters-green">Pool Winner</th>
                <th className="px-4 py-3 font-serif font-medium text-masters-green">Masters Champion</th>
              </tr>
            </thead>
            <tbody>
              {PAST_WINNERS.map((record, index) => (
                <tr 
                  key={index} 
                  className={`border-b ${index === 0 ? "bg-masters-light" : ""}`}
                >
                  <td className="px-4 py-3 font-medium">{record.year}</td>
                  <td className="px-4 py-3">
                    {index === 0 && (
                      <span className="inline-flex items-center">
                        <Trophy size={16} className="text-masters-gold mr-2" />
                        <span className="font-medium">{record.winner}</span>
                      </span>
                    )}
                    {index !== 0 && record.winner}
                  </td>
                  <td className="px-4 py-3">{record.golfer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 p-4 bg-masters-light rounded-md">
          <h3 className="text-lg font-serif font-medium text-masters-green mb-4">
            Pool History Highlights
          </h3>
          <ul className="space-y-2">
            <li><span className="font-medium">Most wins:</span> David Wilson and Mike Johnson (2 each)</li>
            <li><span className="font-medium">Most common champion:</span> Phil Mickelson (3 times)</li>
            <li><span className="font-medium">Biggest payout:</span> $2,450 (2019)</li>
            <li><span className="font-medium">Original founding members:</span> John Smith, Sarah Williams, Tom Davis</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Archive;
