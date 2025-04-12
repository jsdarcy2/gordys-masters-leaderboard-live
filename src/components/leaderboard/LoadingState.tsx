
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingState = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b-2 border-masters-green">
            <th className="masters-table-header rounded-tl-md">Pos</th>
            <th className="masters-table-header">Player</th>
            <th className="masters-table-header text-right">Score</th>
            <th className="masters-table-header text-right">R1</th>
            <th className="masters-table-header text-right">R2</th>
            <th className="masters-table-header text-right">Today</th>
            <th className="masters-table-header text-right rounded-tr-md">Prize Money</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, index) => (
            <tr key={index} className={index % 2 === 0 ? "masters-table-row-even" : "masters-table-row-odd"}>
              <td className="px-2 py-3">
                <Skeleton className="h-6 w-5" />
              </td>
              <td className="px-2 py-3">
                <Skeleton className="h-6 w-36" />
              </td>
              <td className="px-2 py-3 text-right">
                <Skeleton className="h-6 w-12 ml-auto" />
              </td>
              <td className="px-2 py-3 text-right">
                <Skeleton className="h-6 w-10 ml-auto" />
              </td>
              <td className="px-2 py-3 text-right">
                <Skeleton className="h-6 w-10 ml-auto" />
              </td>
              <td className="px-2 py-3 text-right">
                <Skeleton className="h-6 w-10 ml-auto" />
              </td>
              <td className="px-2 py-3 text-right">
                <Skeleton className="h-6 w-20 ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoadingState;
