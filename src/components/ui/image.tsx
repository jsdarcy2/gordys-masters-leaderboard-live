
import { HTMLAttributes, ReactNode, useState } from "react";

interface ImageProps extends HTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallback?: string;
  overlay?: ReactNode;
  overlayClassName?: string;
  overlayOpacity?: number;
}

const Image = ({
  src,
  alt,
  className,
  width,
  height,
  fallback,
  overlay,
  overlayClassName,
  overlayOpacity,
  ...props
}: ImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    const target = e.target as HTMLImageElement;
    if (fallback) {
      target.src = fallback;
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="relative">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? 'transition-opacity duration-300' : 'opacity-0'}`}
        width={width}
        height={height}
        loading="lazy"
        onError={handleError}
        onLoad={handleLoad}
        style={{
          objectFit: "cover",
          imageRendering: "high-quality",
        }}
        {...props}
      />
      
      {overlay && (
        <div 
          className={`absolute inset-0 ${overlayClassName || ''}`}
          style={{ opacity: overlayOpacity !== undefined ? overlayOpacity / 100 : 0.7 }}
        >
          {overlay}
        </div>
      )}
    </div>
  );
};

export default Image;
