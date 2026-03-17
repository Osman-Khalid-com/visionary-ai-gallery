
import React, { useState, useMemo } from 'react';
import { GalleryImage, GallerySettings } from '../types';
import { ImageCard } from './ImageCard';
import { Pagination } from './Pagination';
import { ImageModal } from './ImageModal';

interface GalleryProps {
  images: GalleryImage[];
  settings: GallerySettings;
}

export const Gallery: React.FC<GalleryProps> = ({ images, settings }) => {
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<'all' | 'nsfw' | 'shocking'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filteredImages = useMemo(() => {
    return images.filter(img => {
      if (settings.safeMode && (img.isNsfw || img.isShocking)) {
        return false;
      }

      const matchesSearch = 
        (img.title || "").toLowerCase().includes(settings.searchQuery.toLowerCase()) ||
        (img.prompt || "").toLowerCase().includes(settings.searchQuery.toLowerCase());
      
      const matchesFilter = 
        filterType === 'all' || 
        (filterType === 'nsfw' && img.isNsfw) || 
        (filterType === 'shocking' && img.isShocking);

      return matchesSearch && matchesFilter;
    });
  }, [images, settings.searchQuery, filterType, settings.safeMode]);

  const paginatedImages = useMemo(() => {
    const start = (page - 1) * settings.itemsPerPage;
    return filteredImages.slice(start, start + settings.itemsPerPage);
  }, [filteredImages, page, settings.itemsPerPage]);

  const totalPages = Math.ceil(filteredImages.length / settings.itemsPerPage);

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Start discovery</h2>
        <p className="text-gray-500 mt-1 max-w-xs mx-auto text-sm">Upload some JSON assets in the Dashboard to populate your vision board.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button 
            onClick={() => { setFilterType('all'); setPage(1); }}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${filterType === 'all' ? 'bg-[#111] text-white shadow-md' : 'bg-transparent text-[#111] hover:bg-gray-100'}`}
          >
            All Ideas
          </button>
          {!settings.safeMode && (
            <>
              <button 
                onClick={() => { setFilterType('nsfw'); setPage(1); }}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${filterType === 'nsfw' ? 'bg-[#e60023] text-white shadow-md' : 'bg-transparent text-[#111] hover:bg-gray-100'}`}
              >
                NSFW
              </button>
              <button 
                onClick={() => { setFilterType('shocking'); setPage(1); }}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${filterType === 'shocking' ? 'bg-orange-600 text-white shadow-md' : 'bg-transparent text-[#111] hover:bg-gray-100'}`}
              >
                Shocking
              </button>
            </>
          )}
      </div>

      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 masonry-grid">
        {paginatedImages.map((img, idx) => (
          <div key={`${img.imageId}-${idx}`} className="masonry-item">
            <ImageCard 
              image={img} 
              safeMode={settings.safeMode}
              showAllExplicit={settings.showAllExplicit}
              onClick={() => setSelectedImage(img)}
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={setPage} 
        />
      )}

      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
};