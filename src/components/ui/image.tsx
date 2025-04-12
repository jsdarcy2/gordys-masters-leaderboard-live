
import { HTMLAttributes, ReactNode } from "react";

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
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    if (fallback) {
      target.src = fallback;
    }
  };

  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading="lazy"
        onError={handleError}
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
