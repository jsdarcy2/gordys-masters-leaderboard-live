
import React from "react";

interface WinnerIconsProps {
  position: number;
}

const WinnerIcons: React.FC<WinnerIconsProps> = ({ position }) => {
  if (position === 1) {
    return (
      <>
        <span className="text-masters-yellow mr-1">🏆</span>
        {position}
      </>
    );
  } else if (position === 2) {
    return (
      <>
        <span className="text-gray-400 mr-1">🥈</span>
        {position}
      </>
    );
  } else if (position === 3) {
    return (
      <>
        <span className="text-amber-700 mr-1">🥉</span>
        {position}
      </>
    );
  }
  
  return <>{position}</>;
};

export default WinnerIcons;
