import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GreenRobeWinner, GreenRobeCoChampions } from "@/types";
import Image from "@/components/ui/image";

// Past tournament champions data
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

// Green robe winners with images
const GREEN_ROBE_WINNERS: Array<GreenRobeWinner | GreenRobeCoChampions> = [
  {
    year: 2024, 
    winner: "Sarah Kepic", 
    quote: "Girls Just Wanna Green Ro-obe!",
    image: "/lovable-uploads/1e4f20a3-33c8-4c5c-aba1-cc9b244e571d.png"
  },
  {
    year: 2023, 
    winner: "Elia Eyaz", 
    quote: "Beeaaauuuutiful read, Steven",
    image: "/lovable-uploads/27bba8b8-7174-4a8b-8a6f-32b3e6e6958c.png"
  },
  {
    year: 2022, 
    winner: "Don Schmitt", 
    quote: "Tent? Check. Elk Tag? Check. Fly Rod? Check. Cold Beer? Check. Green Robe? Check. Life Is Good.",
    nickname: "The People's Champion",
    image: "/lovable-uploads/b4a27812-b6a2-4381-b500-ec469e430fa9.png"
  },
  {
    year: 2021, 
    winner: "Jamie Lockhart", 
    quote: "ABG - Always Be Grinding",
    image: "/lovable-uploads/fad075a8-28dc-45ad-9b89-d872e71f50be.png"
  },
  {
    year: 2020, 
    winner: "Goldie Ginkel", 
    quote: "Queen Goldie (of the House Augusta) - The Green Robe Slayer",
    image: "/lovable-uploads/cdd8f28a-0a79-44fd-b664-12107b6f8c1e.png"
  },
  {
    year: 2019, 
    winner: "Hadley Jones", 
    quote: "Daddy's Little Robe Winner",
    image: "/lovable-uploads/a9375daa-e3f9-4325-8bd9-0addcc4bdca1.png"
  },
  {
    year: 2018, 
    winner: "Brian Ginkel", 
    quote: "Robé All Day Baby!",
    image: "/lovable-uploads/92243878-c8e8-44f5-bd63-02f6f04347e4.png"
  },
  {
    year: 2017,
    winners: [
      {
        name: "Peter Bassett",
        quote: "Sweetie, could you please be quiet and keep an eye on this for me",
        image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Jim Jones",
        quote: "The Robe really does tie the room together Dude",
        image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    year: 2016, 
    winner: "Jack Lenmark", 
    quote: "Chicks totally dig the Green Robe...so I got that goin' for me, which is nice",
    image: "https://images.unsplash.com/photo-1473091534298-04dcbce32c67?auto=format&fit=crop&w=800&q=80"
  },
  {
    year: 2015, 
    winner: "Rob Furst", 
    quote: "The Green Robe certainly does have its privileges",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80"
  },
  {
    year: 2014, 
    winner: "Greg Capps", 
    quote: "Mornin' friends!",
    image: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800&q=80"
  },
  {
    year: 2011, 
    winner: "Peggy McClintock", 
    quote: "I think people have always known who wears the Green Robe in this house",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
  },
  {
    year: 2010, 
    winner: "Jay Despard", 
    quote: "Hold my calls for the rest of the week...and would someone please freshen up this coffee, I have some streaming to do",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80"
  },
  {
    year: 2008, 
    winner: "J.J. Furst", 
    quote: "I don't always wear my Green Robe, but when I do I prefer to wear it with a cap, USA ascot, socks…and nothing else",
    image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80"
  },
];

const GreenRobeWinners = () => {
  const [expandedSection, setExpandedSection] = useState<'champions' | 'green-robe' | null>('green-robe');

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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GREEN_ROBE_WINNERS.map((record, index) => (
                  <Card key={index} className={index === 0 ? "border-2 border-masters-gold" : ""}>
                    <CardContent className="p-4">
                      <div className="flex flex-col h-full">
                        <div className="mb-2">
                          <h3 className="text-xl font-serif font-medium text-masters-green">
                            {record.year} Champion
                            {record.year === 2017 ? 's' : ''}
                          </h3>
                        </div>
                        
                        {'winners' in record ? (
                          <div className="grid grid-cols-1 gap-4">
                            {record.winners.map((winner, i) => (
                              <div key={i} className="flex flex-col md:flex-row gap-4">
                                {winner.image && (
                                  <div className="w-full md:w-1/2">
                                    <Image 
                                      src={winner.image} 
                                      alt={`${winner.name} with Green Robe`}
                                      className="w-full h-64 object-cover rounded-md"
                                    />
                                  </div>
                                )}
                                <div className="w-full md:w-1/2 flex flex-col justify-center">
                                  <p className="text-lg font-medium">{winner.name}</p>
                                  <p className="text-gray-600 italic">"{winner.quote}"</p>
                                </div>
                              </div>
                            ))}
                            <p className="text-sm text-gray-500 mt-2">Co-champions this year!</p>
                          </div>
                        ) : (
                          <div className="flex flex-col md:flex-row gap-4">
                            {record.image && (
                              <div className="w-full md:w-1/2">
                                <Image 
                                  src={record.image} 
                                  alt={`${record.winner} with Green Robe`}
                                  className="w-full h-64 object-cover rounded-md"
                                />
                              </div>
                            )}
                            <div className="w-full md:w-1/2 flex flex-col justify-center">
                              <p className="text-lg font-medium">
                                {record.winner}
                                {record.nickname && (
                                  <span className="ml-2 text-sm text-gray-600">({record.nickname})</span>
                                )}
                              </p>
                              <p className="text-gray-600 italic">"{record.quote}"</p>
                            </div>
                          </div>
                        )}
                      </div>
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

export default GreenRobeWinners;
