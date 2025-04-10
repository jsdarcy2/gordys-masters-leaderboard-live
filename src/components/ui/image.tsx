
import React from 'react';
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  overlay?: React.ReactNode;
  overlayClassName?: string;
  overlayOpacity?: number;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ 
    className, 
    fallback = "/placeholder.svg", 
    alt = "", 
    overlay, 
    overlayClassName, 
    overlayOpacity = 40,
    ...props 
  }, ref) => {
    const [src, setSrc] = React.useState<string | undefined>(props.src);
    const [error, setError] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
      setSrc(props.src);
      setError(false);
      setLoaded(false);
    }, [props.src]);

    const handleError = () => {
      if (!error) {
        setError(true);
        setSrc(fallback);
      }
    };

    const handleLoad = () => {
      setLoaded(true);
    };

    return (
      <div className={cn("relative overflow-hidden", className)}>
        <img
          ref={ref}
          {...props}
          alt={alt}
          src={error ? fallback : src}
          onError={handleError}
          onLoad={handleLoad}
          className={cn(
            "object-cover w-full h-full transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
        {!loaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
        )}
        {overlay && loaded && (
          <div 
            className={cn(
              "absolute inset-0", 
              `bg-opacity-${overlayOpacity}`,
              overlayClassName
            )}
          >
            {overlay}
          </div>
        )}
      </div>
    );
  }
);

Image.displayName = "Image";

export default Image;
