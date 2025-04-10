
import { useState, useEffect } from "react";
import { fetchPlayerSelections } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PlayerSelections = () => {
  const [selections, setSelections] = useState<{[participant: string]: string[]}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSelections = async () => {
      try {
        setLoading(true);
        const data = await fetchPlayerSelections();
        setSelections(data);
        setError(null);
      } catch (err) {
        setError("Failed to load player selections");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSelections();
  }, []);

  // Count golfer popularity (how many times each golfer was selected)
  const getGolferPopularity = () => {
    const popularity: {[golfer: string]: number} = {};
    
    Object.values(selections).forEach(picks => {
      picks.forEach(golfer => {
        popularity[golfer] = (popularity[golfer] || 0) + 1;
      });
    });
    
    return popularity;
  };

  const golferPopularity = getGolferPopularity();
  
  // Sort golfers by popularity
  const sortedGolfers = Object.entries(golferPopularity)
    .sort(([, countA], [, countB]) => countB - countA);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-serif text-masters-green">
            Player Selections
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center text-red-500 py-4">{error}</div>
          )}
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <div className="flex flex-wrap gap-2">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-8 w-24" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(selections).map(([participant, picks], index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <h3 className="font-medium text-lg mb-2">{participant}</h3>
                  <div className="flex flex-wrap gap-2">
                    {picks.map((golfer, i) => (
                      <span 
                        key={i} 
                        className="inline-block px-3 py-1 bg-masters-light text-masters-green rounded-full text-sm"
                      >
                        {golfer}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-serif text-masters-green">
            Golfer Popularity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-6 w-10" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedGolfers.map(([golfer, count], index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">{golfer}</span>
                  <span className="bg-masters-green text-white px-2 py-1 rounded-full text-sm">
                    {count} pick{count !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerSelections;
