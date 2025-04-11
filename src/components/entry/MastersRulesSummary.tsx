
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, FileText, Trophy, DollarSign, AlertCircle } from "lucide-react";

const MastersRulesSummary = () => {
  return (
    <Card className="shadow-lg border-t-4 border-t-masters-yellow h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-serif text-masters-green flex items-center gap-2">
          <BookOpen size={20} />
          Pool Rules & Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="font-serif text-masters-green flex items-center gap-2 text-lg font-medium mb-2">
                <FileText size={18} />
                Entry & Participation
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><span className="font-medium">Entry fee:</span> $25 per person</li>
                <li><span className="font-medium">Deadline:</span> All entries must be submitted before the first tee time on Thursday</li>
                <li><span className="font-medium">Selection:</span> Each participant selects 4 golfers from the Masters field</li>
                <li><span className="font-medium">Scoring:</span> Participants earn the actual strokes of their golfers</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-serif text-masters-green flex items-center gap-2 text-lg font-medium mb-2">
                <Trophy size={18} />
                Scoring System
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Your score is the <span className="font-medium">combined stroke total</span> of your 4 selected golfers</li>
                <li>If a golfer misses the cut, their score will be the cut line plus 8 strokes for each remaining round</li>
                <li>Lower total score wins (just like golf!)</li>
                <li>Standings are updated in real-time during the tournament</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-serif text-masters-green flex items-center gap-2 text-lg font-medium mb-2">
                <DollarSign size={18} />
                Prize Distribution
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>70% of the prize pool goes to 1st place</li>
                <li>20% goes to 2nd place</li>
                <li>10% goes to 3rd place</li>
                <li>Special prizes for "Best Single Round" and "Biggest Comeback"</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-serif text-masters-green flex items-center gap-2 text-lg font-medium mb-2">
                <AlertCircle size={18} />
                Tiebreakers
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>In case of a tie, the participant with the more accurate tiebreaker prediction wins</li>
                <li>Tiebreaker: Predict the winning golfer's final score (e.g., -12)</li>
                <li>If still tied, the prize will be split evenly between tied participants</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-serif text-masters-green flex items-center gap-2 text-lg font-medium mb-2">
                <Trophy size={18} />
                20th Anniversary Special Rules
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Commemorative green jacket prize for this year's winner</li>
                <li>Special "Hall of Fame" recognition for past champions</li>
                <li>Anniversary bonus: Virtual dinner with Jim Nantz for the champion</li>
              </ul>
            </section>
            
            <div className="text-center text-sm text-masters-green pt-4 border-t border-gray-200 mt-6">
              <p className="italic">A tradition unlike any other</p>
              <p className="font-serif mt-1">Gordy's Masters Pool - 20th Edition</p>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MastersRulesSummary;
