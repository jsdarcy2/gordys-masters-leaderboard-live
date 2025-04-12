import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const paymentData = [
  { name: "Kyle Flippen", paid: true },
  { name: "Jim Jones", paid: true },
  { name: "Charlotte Ramalingam", paid: true },
  { name: "Louis Baker", paid: true },
  { name: "Chris Crawford", paid: true },
  { name: "Ava Rose Darcy", paid: true },
  { name: "Mike Baker", paid: true },
  { name: "Chuck Corbett Sr", paid: true },
  { name: "Jay Despard", paid: true },
  { name: "Pete Drago", paid: false },
  { name: "Alexa Drago", paid: false },
  { name: "Charles Elder", paid: true },
  { name: "J.J. Furst", paid: true },
  { name: "Grayson Ginkel", paid: true },
  { name: "David Hardt", paid: true },
  { name: "Sargent Johnson, Jr.", paid: true },
  { name: "Jamie Lockhart", paid: true },
  { name: "Johnny McWhite", paid: true },
  { name: "James Petrikas Sr.", paid: true },
  { name: "Phil Present Jr.", paid: true },
  { name: "John Saunders", paid: true },
  { name: "Jon Schwingler", paid: false },
  { name: "Cora Stofer", paid: true },
  { name: "Ford Stofer", paid: true },
  { name: "Sylas Stofer", paid: true },
  { name: "Sarah Sturgis", paid: true },
  { name: "Jimmy Beltz", paid: false },
  { name: "Nate Carlson", paid: true },
  { name: "Ollie Drago", paid: false },
  { name: "Adam Duff", paid: true },
  { name: "Brian Ginkel", paid: true },
  { name: "Peter Kepic Sr.", paid: true },
  { name: "Owen Kepic", paid: true },
  { name: "Peggy McClintock", paid: true },
  { name: "Roth Sanner", paid: true },
  { name: "Stuie Snyder", paid: true },
  { name: "Bette Stephens", paid: false },
  { name: "Gordon Stofer III", paid: true },
  { name: "Avery Sturgis", paid: true },
  { name: "Scott Tande", paid: true },
  { name: "Elia Ayaz", paid: true },
  { name: "Ted Beckman", paid: true },
  { name: "James Carlson", paid: true },
  { name: "Hadley Carlson", paid: true },
  { name: "Ed Corbett", paid: true },
  { name: "Holland Darcy", paid: false },
  { name: "Audrey Darcy", paid: false },
  { name: "Charlie Drago", paid: false },
  { name: "Mik Gusenius", paid: true },
  { name: "Andy Gustafson", paid: true },
  { name: "Chris Kelley", paid: true },
  { name: "Paul Kelly", paid: false },
  { name: "Max Kepic", paid: true },
  { name: "Dan Lenmark", paid: false },
  { name: "Elle McClintock", paid: true },
  { name: "Rich McClintock", paid: true },
  { name: "Charles Meech Jr", paid: true },
  { name: "Chad Murphy", paid: true },
  { name: "Nash Nibbe", paid: true },
  { name: "Julie Nibbe", paid: true },
  { name: "James Petrikas Jr.", paid: true },
  { name: "Davey Phelps", paid: true },
  { name: "Will Phelps", paid: false },
  { name: "Phil Present III", paid: true },
  { name: "Matt Rogers", paid: true },
  { name: "Jackson Saunders", paid: true },
  { name: "Ryan Schmitt", paid: true },
  { name: "Tyler Smith", paid: true },
  { name: "Steve Sorenson", paid: true },
  { name: "Katie Stephens", paid: false },
  { name: "Reven Stephens", paid: false },
  { name: "Caelin Stephens", paid: false },
  { name: "Debbie Stofer", paid: true },
  { name: "Gordon Stofer Jr.", paid: true },
  { name: "Addie Stofer", paid: true },
  { name: "Chris Willette", paid: true },
  { name: "Peter Bassett", paid: true },
  { name: "John Gustafson", paid: true },
  { name: "Brack Herfurth", paid: true },
  { name: "Davis Jones", paid: false },
  { name: "Peter Kepic Jr.", paid: true },
  { name: "Greg Kevane", paid: true },
  { name: "Rory Kevane", paid: true },
  { name: "Pete Kostroski", paid: true },
  { name: "Rollie Logan", paid: true },
  { name: "Bo Massopust", paid: false },
  { name: "Knox Nibbe", paid: true },
  { name: "Jay Perlmutter", paid: true },
  { name: "Donny Schmitt", paid: true },
  { name: "Hayden Simmons", paid: true },
  { name: "Tommy Simmons", paid: true },
  { name: "Winfield Stephens", paid: false },
  { name: "Eileen Stofer", paid: true },
  { name: "Jon Sturgis", paid: true },
  { name: "Hilary Beckman", paid: true },
  { name: "Justin Darcy", paid: false },
  { name: "Lily Gustafson", paid: true },
  { name: "Darby Herfurth", paid: true },
  { name: "Henry Herfurth", paid: true },
  { name: "Rachel Herfurth", paid: true },
  { name: "Jenny McClintock", paid: true },
  { name: "Kevin McClintock", paid: true },
  { name: "Jon Moseley", paid: true },
  { name: "Les Perry", paid: true },
  { name: "Toby Schwingler", paid: false },
  { name: "Jack Simmons", paid: true },
  { name: "Jimmy Stofer", paid: true },
  { name: "Teddy Stofer", paid: true },
  { name: "Ben Applebaum", paid: true },
  { name: "Ross Baker", paid: true },
  { name: "Oliver Beckman", paid: true },
  { name: "Peter Beugg", paid: true },
  { name: "Quinn Carlson", paid: true },
  { name: "Tilly Duff", paid: true },
  { name: "Gretchen Duff", paid: true },
  { name: "Eric Fox", paid: true },
  { name: "Jess Herfurth", paid: true },
  { name: "Decker Herfurth", paid: true },
  { name: "Amy Jones", paid: false },
  { name: "Carter Jones", paid: false },
  { name: "Sargent Johnson", paid: true },
  { name: "Sarah Kepic", paid: true },
  { name: "Andy Koch", paid: true },
  { name: "Chad Kollar", paid: true },
  { name: "Jack Lenmark", paid: true },
  { name: "C.J. Nibbe", paid: true },
  { name: "Ravi Ramalingam", paid: true },
  { name: "Victoria Simmons", paid: true },
  { name: "Robby Stofer", paid: true },
  { name: "Jess Troyak", paid: true },
  { name: "Annie Carlson", paid: true },
  { name: "Ethan Sturgis", paid: true }
];

const PaymentStatus = () => {
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState(paymentData);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const filteredParticipants = participants.filter(participant => 
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const paidCount = participants.filter(p => p.paid).length;
  const unpaidCount = participants.filter(p => !p.paid).length;
  
  const openVenmo = (name: string) => {
    const venmoUsername = "GordysPool";
    const paymentNote = `Masters Pool 2024 - ${name}`;
    const amount = "50";
    
    window.open(`https://venmo.com/${venmoUsername}?txn=pay&note=${encodeURIComponent(paymentNote)}&amount=${amount}`, '_blank');
  };
  
  return (
    <div className="masters-card">
      <div className="masters-header">
        <h2 className="text-xl md:text-2xl font-serif">
          Payment Status
        </h2>
      </div>
      <div className="p-4 bg-white">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{paidCount}</span> paid, 
            <span className="font-medium text-red-600 ml-1">{unpaidCount}</span> unpaid
          </div>
          <Input
            type="search"
            placeholder="Search participants..."
            className="max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-6" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="masters-table-header w-[80%]">Name</TableHead>
                  <TableHead className="masters-table-header text-center w-[20%]">Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.map((participant, index) => (
                  <TableRow key={participant.name} className={index % 2 === 0 ? "masters-table-row-even" : "masters-table-row-odd"}>
                    <TableCell className="font-medium">{participant.name}</TableCell>
                    <TableCell className="text-center">
                      {participant.paid ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                          <Check size={16} className="text-masters-green" />
                        </span>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
                            <X size={16} className="text-red-600" />
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => openVenmo(participant.name)}
                                  className="text-blue-500 hover:text-blue-600 px-1.5 py-0.5 rounded-full hover:bg-blue-50 transition-colors"
                                  aria-label={`Pay via Venmo for ${participant.name}`}
                                >
                                  <span className="text-xs font-medium">Pay</span>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Pay via Venmo</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
