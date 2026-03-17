
import React from 'react';
import { Navbar } from './Navbar';
import { GallerySettings } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: 'gallery' | 'dashboard';
  setCurrentPage: (page: 'gallery' | 'dashboard') => void;
  settings: GallerySettings;
  setSettings: React.Dispatch<React.SetStateAction<GallerySettings>>;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentPage, 
  setCurrentPage,
  settings,
  setSettings 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        settings={settings}
        setSettings={setSettings}
      />
      <main className="flex-grow container mx-auto px-4 py-4">
        {children}
      </main>
      <footer className="border-t border-gray-100 py-8 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm font-medium">
          Visionary AI Gallery &copy; {new Date().getFullYear()} • Inspired by Discovery
        </div>
      </footer>
    </div>
  );
};