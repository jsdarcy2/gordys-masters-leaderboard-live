
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PoolParticipant } from "@/types";
import { ChartContainer, ChartLegend } from "@/components/ui/chart";
import * as RechartsPrimitive from "recharts";
import { Calendar, History, TrendingUp } from "lucide-react";

interface HistoricalComparisonProps {
  currentStandings: PoolParticipant[];
}

const HistoricalComparison = ({ currentStandings }: HistoricalComparisonProps) => {
  const [selectedYear, setSelectedYear] = useState("2023");
  
  // Mock historical data - in a real app, this would come from an API
  const historicalYears = ["2023", "2022", "2021", "2020", "2019"];
  
  const getHistoricalData = () => {
    const topPositions = currentStandings.slice(0, 3).map(p => p.position);
    
    // Generate mock historical data for visualization
    return [
      {
        name: "Final Day",
        dataKey: "finalDay",
        data: [
          { x: "Thu", y: Math.floor(Math.random() * 5) + 1 },
          { x: "Fri", y: Math.floor(Math.random() * 5) + 1 },
          { x: "Sat", y: Math.floor(Math.random() * 5) + 1 },
          { x: "Sun", y: 1 },
        ]
      },
      {
        name: "Current Leader",
        dataKey: "currentLeader",
        data: [
          { x: "Thu", y: Math.floor(Math.random() * 5) + 1 },
          { x: "Fri", y: Math.floor(Math.random() * 5) + 1 },
          { x: "Sat", y: Math.floor(Math.random() * 5) + 1 },
          { x: "Sun", y: topPositions[0] || 1 },
        ]
      }
    ];
  };
  
  const getHistoricalStats = () => {
    // Mock historical stats
    return {
      averageWinningScore: -(Math.floor(Math.random() * 8) + 4),
      biggestComeback: Math.floor(Math.random() * 5) + 3,
      cutLine: Math.floor(Math.random() * 3) + 1,
      previousWinner: "Joe Smith",
      winningPicks: ["Scottie Scheffler", "Brooks Koepka", "Rory McIlroy", "Tiger Woods"]
    };
  };
  
  const historicalData = getHistoricalData();
  const historicalStats = getHistoricalStats();
  
  // Create chart config for the recharts library
  const chartConfig = {
    finalDay: {
      label: "Final Day",
      color: "#2563eb", // blue
    },
    currentLeader: {
      label: "Current Leader",
      color: "#16a34a", // green
    }
  };
  
  return (
    <div className="masters-card mb-6">
      <div className="masters-header">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-serif">Historical Comparison</h2>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-white" />
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-20 h-8 bg-white/20 border-white/40 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {historicalYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card className="bg-masters-light border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="mr-1 h-4 w-4 text-masters-green" />
                  Leader Position Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ChartContainer config={chartConfig}>
                    {/* Wrap the children in a fragment to make it a single React element */}
                    <>
                      <ChartLegend className="mb-2" />
                      <RechartsPrimitive.ResponsiveContainer>
                        <RechartsPrimitive.LineChart 
                          data={[
                            { x: "Thu", finalDay: historicalData[0].data[0].y, currentLeader: historicalData[1].data[0].y },
                            { x: "Fri", finalDay: historicalData[0].data[1].y, currentLeader: historicalData[1].data[1].y },
                            { x: "Sat", finalDay: historicalData[0].data[2].y, currentLeader: historicalData[1].data[2].y },
                            { x: "Sun", finalDay: historicalData[0].data[3].y, currentLeader: historicalData[1].data[3].y }
                          ]}
                          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                        >
                          <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                          <RechartsPrimitive.XAxis dataKey="x" />
                          <RechartsPrimitive.YAxis reversed />
                          <RechartsPrimitive.Tooltip />
                          <RechartsPrimitive.Line 
                            type="monotone" 
                            dataKey="finalDay" 
                            stroke={chartConfig.finalDay.color} 
                            strokeWidth={2} 
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <RechartsPrimitive.Line 
                            type="monotone" 
                            dataKey="currentLeader" 
                            stroke={chartConfig.currentLeader.color} 
                            strokeWidth={2} 
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </RechartsPrimitive.LineChart>
                      </RechartsPrimitive.ResponsiveContainer>
                    </>
                  </ChartContainer>
                </div>
                <div className="text-sm text-gray-500 mt-2 text-center">
                  Comparing {selectedYear} winner's position progression vs. current leader
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-masters-light border-none h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <History className="mr-1 h-4 w-4 text-masters-green" />
                  {selectedYear} Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Winning Score:</span>
                    <span className="font-medium text-masters-green">{historicalStats.averageWinningScore}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Biggest Comeback:</span>
                    <span className="font-medium">{historicalStats.biggestComeback} positions</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Cut Line:</span>
                    <span className="font-medium">+{historicalStats.cutLine}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Pool Winner:</span>
                    <span className="font-medium">{historicalStats.previousWinner}</span>
                  </li>
                  <li className="pt-2">
                    <span className="text-gray-600 block mb-1">Winning Picks:</span>
                    <div className="flex flex-wrap gap-1">
                      {historicalStats.winningPicks.map((pick, i) => (
                        <span 
                          key={i}
                          className="inline-block px-2 py-1 text-xs rounded-full bg-masters-green/10"
                        >
                          {pick}
                        </span>
                      ))}
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default HistoricalComparison;
