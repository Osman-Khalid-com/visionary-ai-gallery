
import React, { useState, useEffect } from 'react';
import { GalleryImage } from '../types';

interface ImageCardProps {
  image: GalleryImage;
  safeMode: boolean;
  showAllExplicit: boolean;
  onClick: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, safeMode, showAllExplicit, onClick }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!safeMode) setIsRevealed(false);
  }, [safeMode]);

  const isExplicit = image.isNsfw || image.isShocking;
  const shouldBlur = isExplicit && !showAllExplicit && !isRevealed;

  const handleCardClick = () => {
    if (shouldBlur) return;
    onClick();
  };

  // Calculate dynamic aspect ratio based on natural dimensions
  const aspectRatio = image.naturalWidth / image.naturalHeight || 1;

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative bg-gray-100 rounded-[16px] overflow-hidden transition-all duration-300 cursor-zoom-in mb-4 ${shouldBlur ? 'cursor-default' : 'hover:brightness-95'}`}
    >
      <div className="relative overflow-hidden w-full" style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}>
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        <img
          src={image.image}
          alt={image.title}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${shouldBlur ? 'blur-[50px] scale-110 grayscale' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Hover Overlay */}
        {!shouldBlur && (
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4 pointer-events-none">
            <div className="flex justify-end">
              <button className="bg-[#e60023] text-white px-5 py-3 rounded-full font-bold text-sm pointer-events-auto transform active:scale-95 transition-transform">
                Save
              </button>
            </div>
            <div className="flex justify-between items-center text-white font-bold text-sm">
              <span className="truncate max-w-[150px] drop-shadow-md">{image.title || 'Untitled'}</span>
              <div className="p-2 bg-white/80 backdrop-blur rounded-full text-black flex items-center justify-center pointer-events-auto hover:bg-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </div>
            </div>
          </div>
        )}

        {shouldBlur && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center bg-black/60 backdrop-blur-2xl">
            <div className="bg-white/10 p-4 rounded-full mb-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-white font-black mb-4 uppercase tracking-tighter text-xs">
              {image.isNsfw ? 'NSFW' : 'Shocking'}
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); setIsRevealed(true); }}
              className="px-6 py-2.5 bg-white text-black font-bold text-sm rounded-full transition-all active:scale-95 shadow-lg"
            >
              Reveal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};