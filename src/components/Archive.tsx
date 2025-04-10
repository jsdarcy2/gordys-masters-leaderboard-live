
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

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

const GREEN_ROBE_WINNERS = [
  { year: 2024, winner: "Sarah Kepic", quote: "Girls Just Wanna Green Ro-obe!" },
  { year: 2023, winner: "Elia Eyaz", quote: "Beeaaauuuutiful read, Steven" },
  { year: 2022, winner: "Don Schmitt", quote: "Tent? Check. Elk Tag? Check. Fly Rod? Check. Cold Beer? Check. Green Robe? Check. Life Is Good.", nickname: "The People's Champion" },
  { year: 2021, winner: "Jamie Lockhart", quote: "ABG - Always Be Grinding" },
  { year: 2020, winner: "Goldie Ginkel", quote: "Queen Goldie (of the House Augusta) - The Green Robe Slayer" },
  { year: 2019, winner: "Hadley Jones", quote: "Daddy's Little Robe Winner" },
  { year: 2018, winner: "Brian Ginkel", quote: "Robé All Day Baby!" },
  { year: 2017, winners: [
    { name: "Peter Bassett", quote: "Sweetie, could you please be quiet and keep an eye on this for me" },
    { name: "Jim Jones", quote: "The Robe really does tie the room together Dude" }
  ]},
  { year: 2016, winner: "Jack Lenmark", quote: "Chicks totally dig the Green Robe...so I got that goin' for me, which is nice" },
  { year: 2015, winner: "Rob Furst", quote: "The Green Robe certainly does have its privileges" },
  { year: 2014, winner: "Greg Capps", quote: "Mornin' friends!" },
  { year: 2011, winner: "Peggy McClintock", quote: "I think people have always known who wears the Green Robe in this house" },
  { year: 2010, winner: "Jay Despard", quote: "Hold my calls for the rest of the week...and would someone please freshen up this coffee, I have some streaming to do" },
  { year: 2008, winner: "J.J. Furst", quote: "I don't always wear my Green Robe, but when I do I prefer to wear it with a cap, USA ascot, socks…and nothing else" },
];

const Archive = () => {
  const [expandedSection, setExpandedSection] = useState<'champions' | 'green-robe' | null>('champions');

  const toggleSection = (section: 'champions' | 'green-robe') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-8">
      <Collapsible 
        open={expandedSection === 'champions'} 
        onOpenChange={() => toggleSection('champions')}
        className="w-full"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CollapsibleTrigger className="w-full text-left">
              <CardTitle className="text-xl md:text-2xl font-serif text-masters-green flex items-center">
                <Trophy size={24} className="text-masters-gold mr-2" />
                Past Pool Champions
                <span className="ml-2 text-sm text-gray-500">(Click to {expandedSection === 'champions' ? 'collapse' : 'expand'})</span>
              </CardTitle>
            </CollapsibleTrigger>
          </CardHeader>
          
          <CollapsibleContent>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-masters-green">
                      <TableHead className="font-serif font-medium text-masters-green">Year</TableHead>
                      <TableHead className="font-serif font-medium text-masters-green">Pool Winner</TableHead>
                      <TableHead className="font-serif font-medium text-masters-green">Masters Champion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PAST_WINNERS.map((record, index) => (
                      <TableRow 
                        key={index} 
                        className={`border-b ${index === 0 ? "bg-masters-light" : ""}`}
                      >
                        <TableCell className="font-medium">{record.year}</TableCell>
                        <TableCell>
                          {index === 0 && (
                            <span className="inline-flex items-center">
                              <Trophy size={16} className="text-masters-gold mr-2" />
                              <span className="font-medium">{record.winner}</span>
                            </span>
                          )}
                          {index !== 0 && record.winner}
                        </TableCell>
                        <TableCell>{record.golfer}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Collapsible 
        open={expandedSection === 'green-robe'} 
        onOpenChange={() => toggleSection('green-robe')}
        className="w-full"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CollapsibleTrigger className="w-full text-left">
              <CardTitle className="text-xl md:text-2xl font-serif text-masters-green flex items-center">
                <Award size={24} className="text-masters-gold mr-2" />
                The Green Robe Champions
                <span className="ml-2 text-sm text-gray-500">(Click to {expandedSection === 'green-robe' ? 'collapse' : 'expand'})</span>
              </CardTitle>
            </CollapsibleTrigger>
          </CardHeader>
          
          <CollapsibleContent>
            <CardContent>
              <div className="mb-4 p-4 bg-masters-light rounded-md">
                <p className="italic text-gray-700">
                  The prestigious Green Robe - a tradition unlike any other. Awarded to the pool champion each year, 
                  this iconic symbol represents Masters Pool glory and bragging rights for an entire year.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {GREEN_ROBE_WINNERS.map((record, index) => (
                  <Card key={index} className={index === 0 ? "bg-masters-light border-2 border-masters-gold" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        {index === 0 && <Award size={16} className="text-masters-gold mr-2" />}
                        <h3 className="text-lg font-serif font-medium text-masters-green">
                          {record.year}
                        </h3>
                      </div>
                      
                      {'winners' in record ? (
                        <div>
                          <p className="font-medium">Co-Champions:</p>
                          {record.winners.map((winner, i) => (
                            <div key={i} className="mt-1">
                              <p className="font-medium">{winner.name}</p>
                              <p className="text-sm text-gray-600 italic">"{winner.quote}"</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">
                            {record.winner}
                            {record.nickname && <span className="ml-1 text-sm">({record.nickname})</span>}
                          </p>
                          <p className="text-sm text-gray-600 italic">"{record.quote}"</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};

export default Archive;
