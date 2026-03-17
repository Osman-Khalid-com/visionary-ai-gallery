
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Gallery } from './components/Gallery';
import { Dashboard } from './components/Dashboard';
import { GalleryImage, GallerySettings } from './types';
import { getAllImages, saveImages, clearAllImages } from './db';

const App: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'gallery' | 'dashboard'>('gallery');
  const [settings, setSettings] = useState<GallerySettings>({
    safeMode: true,
    showAllExplicit: false,
    itemsPerPage: 12,
    filterNsfwOnly: false,
    filterShockingOnly: false,
    searchQuery: ''
  });

  // Load initial data from IndexedDB
  useEffect(() => {
    const initData = async () => {
      try {
        const storedImages = await getAllImages();
        setImages(storedImages);
      } catch (e) {
        console.error("Failed to load IndexedDB data", e);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  const handleUpload = async (newImages: GalleryImage[]) => {
    try {
      await saveImages(newImages);
      const updatedImages = await getAllImages();
      setImages(updatedImages);
      return { success: true };
    } catch (e) {
      console.error("Failed to save to IndexedDB", e);
      return { success: false, error: (e as Error).message };
    }
  };

  const clearData = async () => {
    if (window.confirm("Are you sure you want to clear all gallery data? This cannot be undone.")) {
      try {
        await clearAllImages();
        setImages([]);
      } catch (e) {
        alert("Failed to clear database: " + (e as Error).message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Initializing Visionary Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage}
      settings={settings}
      setSettings={setSettings}
    >
      {currentPage === 'gallery' ? (
        <Gallery 
          images={images} 
          settings={settings} 
        />
      ) : (
        <Dashboard 
          onUpload={handleUpload} 
          onClear={clearData}
          totalImages={images.length}
        />
      )}
    </Layout>
  );
};

export default App;
