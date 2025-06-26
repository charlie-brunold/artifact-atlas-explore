
import React, { useState } from 'react';
import { FALLBACK_ARTIFACT_IMAGE } from '@/utils/artifactData';
import { useTranslation } from 'react-i18next';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

const ImageWithFallback = ({ src, alt, className = "", fallbackText }: ImageWithFallbackProps) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (imageError) {
    return (
      <div className={`bg-muted flex items-center justify-center text-muted-foreground ${className}`}>
        <div className="text-center p-4">
          <div className="text-2xl mb-2">🏺</div>
          <div className="text-sm">
            {fallbackText || t('artifact.imageNotAvailable')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      )}
      <img 
        src={src || FALLBACK_ARTIFACT_IMAGE}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default ImageWithFallback;
