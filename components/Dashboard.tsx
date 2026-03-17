
import React, { useState, useRef } from 'react';
import { GalleryImage } from '../types';

interface DashboardProps {
  onUpload: (images: GalleryImage[]) => Promise<{ success: boolean; error?: string }>;
  onClear: () => void;
  totalImages: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ onUpload, onClear, totalImages }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalToProcess, setTotalToProcess] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  
  const directoryInputRef = useRef<HTMLInputElement>(null);

  const processJsonFile = async (file: File): Promise<GalleryImage[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (!content.trim()) {
            resolve([]);
            return;
          }
          const json = JSON.parse(content);
          const data = Array.isArray(json) ? json : [json];
          const validData = data.filter(item => item && typeof item.image === 'string' && item.image.trim() !== '');
          resolve(validData as GalleryImage[]);
        } catch (err) {
          reject(new Error("Invalid JSON format"));
        }
      };
      reader.onerror = () => reject(new Error("File read error"));
      reader.readAsText(file);
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    const jsonFiles = Array.from(files).filter(f => f.name.toLowerCase().endsWith('.json'));
    if (jsonFiles.length === 0) {
      setUploadStatus({ type: 'error', msg: 'No JSON files found in selection.' });
      return;
    }

    setIsProcessing(true);
    setUploadStatus(null);
    setTotalToProcess(jsonFiles.length);
    setProcessedCount(0);

    const allImages: GalleryImage[] = [];
    let errorCount = 0;

    for (const file of jsonFiles) {
      try {
        const images = await processJsonFile(file);
        allImages.push(...images);
        setProcessedCount(prev => prev + 1);
      } catch (e) {
        errorCount++;
        setProcessedCount(prev => prev + 1);
      }
    }

    if (allImages.length > 0) {
      const result = await onUpload(allImages);
      if (result.success) {
        setUploadStatus({ type: 'success', msg: `Imported ${allImages.length} images successfully.` });
      } else {
        setUploadStatus({ type: 'error', msg: 'Storage error: ' + result.error });
      }
    } else {
      setUploadStatus({ type: 'error', msg: 'No valid image metadata found.' });
    }
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#111]">Dashboard</h1>
        <p className="text-gray-500 font-medium">Add new ideas to your visionary board</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-black text-[#e60023] mb-1">{totalImages}</div>
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Total Pins</div>
        </div>
        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-black text-[#111] mb-1">IDB</div>
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Storage Mode</div>
        </div>
        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-black text-blue-500 mb-1">Auto</div>
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Directory Sync</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative flex flex-col">
          <h2 className="text-lg font-bold text-[#111] mb-6">Bulk JSON Upload</h2>
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
            }}
            className={`flex-grow relative border-2 border-dashed rounded-3xl p-10 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer text-center min-h-[220px] ${
              isDragging ? 'border-[#e60023] bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
            }`}
          >
            <input 
              type="file" 
              accept=".json"
              multiple
              disabled={isProcessing}
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
            />
            <svg className="w-10 h-10 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-gray-900 font-bold text-sm">Drag and drop JSONs</p>
            <p className="text-gray-400 text-[11px] mt-2">Compatible with high-res metadata</p>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative flex flex-col">
          <h2 className="text-lg font-bold text-[#111] mb-6">Directory Sync</h2>
          <div 
            onClick={() => directoryInputRef.current?.click()}
            className="flex-grow border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50/50 rounded-3xl p-10 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer text-center group min-h-[220px]"
          >
            <input 
              type="file" 
              ref={directoryInputRef}
              // @ts-ignore
              webkitdirectory="" 
              // @ts-ignore
              directory=""
              disabled={isProcessing}
              className="hidden"
              onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
            />
            <svg className="w-10 h-10 text-gray-400 mb-4 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="text-gray-900 font-bold text-sm">Choose Folder</p>
            <p className="text-gray-400 text-[11px] mt-2">Recursively discover all JSON files</p>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#111] font-bold text-sm">Ingesting Assets...</p>
            <p className="text-gray-400 font-mono text-xs">{processedCount} / {totalToProcess}</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-[#e60023] h-full transition-all duration-300 ease-out"
              style={{ width: `${(processedCount / totalToProcess) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {uploadStatus && (
        <div className={`p-5 rounded-3xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border ${
          uploadStatus.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-[#e60023] border-red-100'
        }`}>
          <span className="flex-grow">{uploadStatus.msg}</span>
          <button onClick={() => setUploadStatus(null)} className="opacity-50 hover:opacity-100 transition-opacity">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <div className="flex justify-center pt-8 border-t border-gray-100">
        <button
          onClick={onClear}
          className="px-8 py-3 bg-gray-100 hover:bg-red-50 text-[#111] hover:text-[#e60023] rounded-full font-bold transition-all transform active:scale-95"
        >
          Clear Workspace Storage
        </button>
      </div>
    </div>
  );
};
