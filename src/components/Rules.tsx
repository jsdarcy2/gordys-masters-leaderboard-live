
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Rules = () => {
  return (
    <div className="masters-card">
      <div className="masters-header">
        <h2 className="text-xl md:text-2xl font-serif">
          Pool Rules - 20th Edition
        </h2>
      </div>
      <div className="p-6 bg-white prose max-w-none">
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-serif font-medium text-masters-green">Entry & Participation</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Entry fee is $25 per person.</li>
              <li>All entries must be submitted before the tournament begins.</li>
              <li>Each participant selects 4 golfers from the Masters field.</li>
              <li>Participants earn points based on their golfers' performance.</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-serif font-medium text-masters-green">Scoring System</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Points are awarded based on golfers' positions on the leaderboard.</li>
              <li>If a golfer misses the cut, they receive minimum points for each remaining round.</li>
              <li>Bonus points are awarded for golfers who finish in the top 10.</li>
              <li>Final standings are determined by total points accumulated over all four rounds.</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-serif font-medium text-masters-green">Prize Distribution</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>70% of the total prize pool goes to 1st place.</li>
              <li>20% goes to 2nd place.</li>
              <li>10% goes to 3rd place.</li>
              <li>Special prizes for "Best Single Round" and "Biggest Comeback."</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-serif font-medium text-masters-green">Tiebreakers</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>In case of a tie, the participant with the golfer achieving the highest individual finish wins.</li>
              <li>If still tied, the participant with the lowest combined score of their 4 golfers wins.</li>
              <li>If still tied, the prize will be split evenly between tied participants.</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-serif font-medium text-masters-green">20th Anniversary Special Rules</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Commemorative prize for this year's winner.</li>
              <li>Special "Hall of Fame" recognition for past champions in attendance.</li>
              <li>Anniversary bonus: Double points for any golfer wearing green during any round.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Rules;
