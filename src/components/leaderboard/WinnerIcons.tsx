
import React from "react";

interface WinnerIconsProps {
  position: number;
}

const WinnerIcons: React.FC<WinnerIconsProps> = ({ position }) => {
  if (position === 1) {
    return (
      <>
        <span className="text-masters-yellow mr-1.5" title="First Place">🏆</span>
        {position}
      </>
    );
  } else if (position === 2) {
    return (
      <>
        <span className="text-gray-400 mr-1.5" title="Second Place">🥈</span>
        {position}
      </>
    );
  } else if (position === 3) {
    return (
      <>
        <span className="text-amber-700 mr-1.5" title="Third Place">🥉</span>
        {position}
      </>
    );
  } else if (position <= 5) {
    // Highlight top 5 positions subtly - important for betting contexts
    return (
      <>
        <span className="text-green-500 font-bold mr-0.5" title="Top 5 Position">•</span>
        {position}
      </>
    );
  }
  
  return <>{position}</>;
};

export default WinnerIcons;
