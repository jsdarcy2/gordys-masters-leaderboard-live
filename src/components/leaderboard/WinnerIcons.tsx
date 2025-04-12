
import React from "react";

interface WinnerIconsProps {
  position: number;
}

const WinnerIcons: React.FC<WinnerIconsProps> = ({ position }) => {
  if (position === 1) {
    return (
      <div className="flex items-center">
        <span className="text-masters-yellow mr-1" title="First Place">🏆</span>
        <span>{position}</span>
      </div>
    );
  } else if (position === 2) {
    return (
      <div className="flex items-center">
        <span className="text-gray-400 mr-1" title="Second Place">🥈</span>
        <span>{position}</span>
      </div>
    );
  } else if (position === 3) {
    return (
      <div className="flex items-center">
        <span className="text-amber-700 mr-1" title="Third Place">🥉</span>
        <span>{position}</span>
      </div>
    );
  } 
  
  return <span>{position}</span>;
};

export default WinnerIcons;
