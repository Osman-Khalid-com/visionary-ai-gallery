
import React from 'react';
import { GallerySettings } from '../types';

interface NavbarProps {
  currentPage: 'gallery' | 'dashboard';
  setCurrentPage: (page: 'gallery' | 'dashboard') => void;
  settings: GallerySettings;
  setSettings: React.Dispatch<React.SetStateAction<GallerySettings>>;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  settings, 
  setSettings 
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-4 py-4">
      <div className="container mx-auto flex items-center gap-4">
        {/* Logo */}
        <div 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e60023] text-white cursor-pointer hover:bg-[#ad081b] transition-colors shadow-sm"
          onClick={() => setCurrentPage('gallery')}
          title="Visionary Home"
        >
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve">
          <path d="M9.6,0.2C6.3,0.8,3.4,3,1.7,5.9c-4.3,7.2,0.2,15,6.7,17.7c-0.1-1,3.3-0.6,3.6-1.7c0.2-0.9-1.8-5.1-1.8-5.1s-1.5-3.5-1.5-4.5
            c0-1.6,0.9-2.8,2.1-2.8c1,0,1.4,0.7,1.4,1.6c0,1,0.2,1.1-0.1,2.4c-0.3,1.1,0.9,1.7,2,1.7c2,0,2.4-0.5,2.4-3.6c0-2.7-2-4.6-4.8-4.6
            c-3.2,0-5.1,2.4-5.1,4.9c0,1,0.4,2,0.8,2.6c0.1,0.1,0.1,0.2,0.1,0.3l-0.3,1.4c-0.1,0.2-0.2,0.3-0.4,0.1c-1.5-0.7-2.4-2.9-2.4-4.6
            c0-3.8,2.7-7.2,7.9-7.2c4.1,0,7.3,2.9,7.3,6.9c0,4.1-2.6,7.4-6.2,7.4c-1.2,0-2.3-0.6-2.7-1.4l-0.7,2.8c-0.3,1-1,2.3-1.5,3.1
            c1.9,0.6,4,0.7,6.1,0.2c4.7-1,8.4-4.9,9.2-9.7C25.2,5.8,18-1.5,9.6,0.2z"/>
          </svg>

          {/* <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.19-2.4.04-3.44.21-.93 1.33-5.64 1.33-5.64s-.34-.68-.34-1.68c0-1.57.91-2.75 2.05-2.75.97 0 1.43.73 1.43 1.6 0 .97-.62 2.43-.94 3.77-.27 1.13.56 2.06 1.68 2.06 2.02 0 3.57-2.13 3.57-5.2 0-2.72-1.96-4.62-4.75-4.62-3.23 0-5.13 2.42-5.13 4.93 0 .98.38 2.02.85 2.59.09.11.1.21.07.33l-.33 1.35c-.05.21-.17.26-.4.15-1.48-.69-2.41-2.86-2.41-4.6 0-3.75 2.73-7.2 7.86-7.2 4.13 0 7.33 2.94 7.33 6.87 0 4.1-2.58 7.4-6.17 7.4-1.2 0-2.34-.63-2.73-1.37l-.74 2.82c-.27 1.03-.99 2.32-1.47 3.11 1.13.34 2.32.53 3.55.53 6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
          </svg> */}
        </div>

        {/* Main Nav */}
        <div className="hidden sm:flex items-center gap-2 font-bold">
          <button
            onClick={() => setCurrentPage('gallery')}
            className={`px-4 py-2 rounded-full transition-colors ${
              currentPage === 'gallery' ? 'bg-[#111] text-white' : 'text-[#111] hover:bg-gray-100'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`px-4 py-2 rounded-full transition-colors ${
              currentPage === 'dashboard' ? 'bg-[#111] text-white' : 'text-[#111] hover:bg-gray-100'
            }`}
          >
            Dashboard
          </button>
        </div>

        {/* Search */}
        <div className="flex-grow relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for art, ideas, or prompts..."
            className="block w-full bg-[#efefef] border-none rounded-full py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-400/50 outline-none transition-all placeholder:text-gray-500"
            value={settings.searchQuery}
            onChange={(e) => setSettings(prev => ({ ...prev, searchQuery: e.target.value }))}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded-full border-gray-300 text-[#e60023] focus:ring-[#e60023]"
                checked={settings.safeMode}
                onChange={(e) => setSettings(prev => ({ ...prev, safeMode: e.target.checked }))}
              />
              <span className="text-xs font-bold text-gray-700">Safe</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded-full border-gray-300 text-[#e60023] focus:ring-[#e60023]"
                checked={settings.showAllExplicit}
                onChange={(e) => setSettings(prev => ({ ...prev, showAllExplicit: e.target.checked }))}
              />
              <span className="text-xs font-bold text-gray-700">Show All</span>
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
};