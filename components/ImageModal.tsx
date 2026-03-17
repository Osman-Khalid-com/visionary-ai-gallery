
import React, { useState } from 'react';
import { GalleryImage } from '../types';

interface ImageModalProps {
  image: GalleryImage;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"></div>
      
      <div 
        className="relative bg-white w-full max-w-6xl max-h-[92vh] rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white text-black rounded-full shadow-lg hover:bg-gray-100 transition-colors md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Image Sidebar / Main View */}
        <div className="w-full md:w-3/5 bg-gray-50 flex items-center justify-center overflow-hidden p-2 md:p-6">
          <img 
            src={image.image} 
            alt={image.title} 
            className="max-w-full max-h-full object-contain rounded-2xl shadow-xl"
          />
        </div>

        {/* Info Sidebar */}
        <div className="w-full md:w-2/5 p-8 overflow-y-auto bg-white flex flex-col gap-8 border-l border-gray-100">
          <div className="flex items-center justify-between sticky top-0 bg-white pb-4 z-10 border-b border-gray-50">
            <div className="flex gap-2">
              <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" title="Save Idea">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </button>
              <button 
                onClick={() => copyToClipboard(window.location.href)}
                className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" 
                title="Share"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              </button>
            </div>
            <button className="bg-[#e60023] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#ad081b] transition-colors shadow-md transform active:scale-95">
              Save
            </button>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-[#111] leading-tight">{image.title || "Visionary Asset"}</h2>
            <p className="text-sm text-gray-500 font-medium">Original Artwork • IDX #{image.index}</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Prompt Description</label>
                <button 
                  onClick={() => copyToClipboard(image.prompt)}
                  className={`text-[10px] font-bold uppercase py-1 px-3 rounded-full transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {copied ? 'Copied!' : 'Copy Prompt'}
                </button>
              </div>
              <div className="text-[#111] text-lg leading-relaxed font-medium bg-gray-50/50 p-6 rounded-[24px] italic border border-gray-100">
                "{image.prompt || 'No description provided.'}"
              </div>
            </div>

            {image.negativePrompt && (
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Negative constraints</label>
                <div className="text-sm text-gray-500 leading-relaxed font-medium bg-gray-50/30 p-5 rounded-[20px] border border-gray-50">
                  {image.negativePrompt}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seed</label>
                <div className="text-sm font-mono text-[#111]">{image.seed}</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Format</label>
                <div className="text-sm font-mono text-[#111]">{image.naturalWidth} × {image.naturalHeight}</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Added</label>
                <div className="text-sm text-[#111]">{new Date(image.timestamp).toLocaleDateString()}</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identity</label>
                <div className="text-[10px] font-mono text-gray-400 truncate w-32">{image.imageId}</div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8">
             <a 
               href={image.image} 
               target="_blank" 
               rel="noreferrer"
               className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-[#111] font-bold py-4 rounded-full transition-all text-sm"
             >
               View full resolution source
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};