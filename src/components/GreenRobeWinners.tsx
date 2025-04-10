import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Flag } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GreenRobeWinner, GreenRobeCoChampions } from "@/types";
import Image from "@/components/ui/image";

// Green robe winners with images
const GREEN_ROBE_WINNERS: Array<GreenRobeWinner | GreenRobeCoChampions> = [
  {
    year: 2024, 
    winner: "Sarah Kepic", 
    quote: "Girls Just Wanna Green Ro-obe!",
    image: "/lovable-uploads/1e4f20a3-33c8-4c5c-aba1-cc9b244e571d.png",
    hometown: "Birmingham, MI"
  },
  {
    year: 2023, 
    winner: "Elia Eyaz", 
    quote: "Beeaaauuuutiful read, Steven",
    image: "/lovable-uploads/27bba8b8-7174-4a8b-8a6f-32b3e6e6958c.png",
    hometown: "Plymouth, MN"
  },
  {
    year: 2022, 
    winner: "Don Schmitt", 
    quote: "Tent? Check. Elk Tag? Check. Fly Rod? Check. Cold Beer? Check. Green Robe? Check. Life Is Good.",
    nickname: "The People's Champion",
    image: "/lovable-uploads/b4a27812-b6a2-4381-b500-ec469e430fa9.png",
    hometown: "Denver, CO"
  },
  {
    year: 2021, 
    winner: "Jamie Lockhart", 
    quote: "ABG - Always Be Grinding",
    image: "/lovable-uploads/fad075a8-28dc-45ad-9b89-d872e71f50be.png",
    hometown: "Edina, MN"
  },
  {
    year: 2020, 
    winner: "Goldie Ginkel", 
    quote: "Queen Goldie (of the House Augusta) - The Green Robe Slayer",
    image: "/lovable-uploads/cdd8f28a-0a79-44fd-b664-12107b6f8c1e.png",
    hometown: "Edina, MN"
  },
  {
    year: 2019, 
    winner: "Hadley Jones", 
    quote: "Daddy's Little Robe Winner",
    image: "/lovable-uploads/a9375daa-e3f9-4325-8bd9-0addcc4bdca1.png",
    hometown: "Glenview, IL"
  },
  {
    year: 2018, 
    winner: "Brian Ginkel", 
    quote: "Robé All Day Baby!",
    image: "/lovable-uploads/92243878-c8e8-44f5-bd63-02f6f04347e4.png",
    hometown: "Edina, MN"
  },
  {
    year: 2017,
    winners: [
      {
        name: "Peter Bassett",
        quote: "Sweetie, could you please be quiet and keep an eye on this for me",
        image: "/lovable-uploads/062daa4d-0f0c-43a9-83d0-e86b0a830415.png",
        hometown: "Plymouth, MN"
      },
      {
        name: "Jim Jones",
        quote: "The Robe really does tie the room together Dude",
        image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?auto=format&fit=crop&w=800&q=80",
        hometown: "Glenview, IL"
      }
    ]
  },
  {
    year: 2016, 
    winner: "Jack Lenmark", 
    quote: "Chicks totally dig the Green Robe...so I got that goin' for me, which is nice",
    image: "/lovable-uploads/912144bb-30e1-461b-afb7-c475e0ebc3a5.png",
    hometown: "Apple Valley, MN"
  },
  {
    year: 2015, 
    winner: "Rob Furst", 
    quote: "The Green Robe certainly does have its privileges",
    image: "/lovable-uploads/0725b00b-c74c-4806-9981-cb752e635f7a.png",
    hometown: "Deephaven, MN"
  },
  {
    year: 2014, 
    winner: "Greg Capps", 
    quote: "Mornin' friends!",
    image: "/lovable-uploads/221b6e15-2d1c-49e9-8807-b8d5f9caefc8.png",
    hometown: "Raleigh, NC"
  },
  {
    year: 2013, 
    winner: "Sylas Stofer", 
    quote: "Green Robe Excellence",
    image: "https://images.unsplash.com/photo-1619221882266-0b5c20fd0628?auto=format&fit=crop&w=800&q=80",
    hometown: "Orono, MN"
  },
  {
    year: 2012, 
    winner: "Jim Jones", 
    quote: "Robe Life",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    hometown: "Chicago, IL"
  },
  {
    year: 2011, 
    winner: "Peggy McClintock", 
    quote: "I think people have always known who wears the Green Robe in this house",
    image: "/lovable-uploads/7f7b62c0-03c1-4a50-87a1-2d0ad365face.png",
    hometown: "Denver, CO"
  },
  {
    year: 2010, 
    winner: "Jay Despard", 
    quote: "Hold my calls for the rest of the week...and would someone please freshen up this coffee, I have some streaming to do",
    image: "/lovable-uploads/440d34ed-5121-47f0-9460-c3adc93e4251.png",
    hometown: "Lafayette, CO"
  },
  {
    year: 2009, 
    winner: "Todd Goergen", 
    quote: "Masters of the Universe",
    image: "https://images.unsplash.com/photo-1609167830220-7164aa360951?auto=format&fit=crop&w=800&q=80",
    hometown: "New York, NY"
  },
  {
    year: 2008, 
    winner: "J.J. Furst", 
    quote: "I don't always wear my Green Robe, but when I do I prefer to wear it with a cap, USA ascot, socks…and nothing else",
    image: "/lovable-uploads/2f22aea0-6f84-4520-846d-93e74a60bbd2.png",
    hometown: "Wayzata, MN"
  },
  {
    year: 2007, 
    winner: "Dave Hierholzer", 
    quote: "Robe On, Game On",
    image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?auto=format&fit=crop&w=800&q=80",
    hometown: "Denver, CO"
  },
  {
    year: 2006, 
    winner: "Justin Thomas", 
    quote: "Green Robe Glory",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80",
    hometown: "Cincinatti, OH"
  },
];

// Map of state abbreviation to flag rendering component
const stateFlags: Record<string, React.ReactNode> = {
  MI: <Flag size={14} className="text-blue-600" />,
  MN: <Flag size={14} className="text-blue-500" />,
  CO: <Flag size={14} className="text-red-500" />,
  IL: <Flag size={14} className="text-orange-500" />,
  NC: <Flag size={14} className="text-red-600" />,
  NY: <Flag size={14} className="text-purple-500" />,
  OH: <Flag size={14} className="text-red-700" />
};

const GreenRobeWinners = () => {
  const [expandedSection, setExpandedSection] = useState<'green-robe' | null>('green-robe');

  const toggleSection = () => {
    setExpandedSection(expandedSection === 'green-robe' ? null : 'green-robe');
  };

  return (
    <div className="space-y-8">
      <Collapsible 
        open={expandedSection === 'green-robe'} 
        onOpenChange={toggleSection}
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
                                  {winner.hometown && (
                                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                                      Hometown: {winner.hometown} 
                                      {winner.hometown.slice(-2) && stateFlags[winner.hometown.slice(-2)] && (
                                        <span className="ml-1">{stateFlags[winner.hometown.slice(-2)]}</span>
                                      )}
                                    </p>
                                  )}
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
                              {record.hometown && (
                                <p className="text-sm text-gray-500 mt-1 flex items-center">
                                  Hometown: {record.hometown} 
                                  {record.hometown.slice(-2) && stateFlags[record.hometown.slice(-2)] && (
                                    <span className="ml-1">{stateFlags[record.hometown.slice(-2)]}</span>
                                  )}
                                </p>
                              )}
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
