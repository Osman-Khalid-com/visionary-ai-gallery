
import { GalleryImage } from './types';

const DB_NAME = 'VisionaryGalleryDB';
const STORE_NAME = 'images';
const DB_VERSION = 1;

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'imageId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllImages = async (): Promise<GalleryImage[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      // Sort by index if available, or timestamp
      const results = request.result as GalleryImage[];
      resolve(results.sort((a, b) => a.index - b.index));
    };
    request.onerror = () => reject(request.error);
  });
};

export const saveImages = async (images: GalleryImage[]): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    images.forEach(img => {
      // Use imageId as the key. If not present, generate one from index/seed.
      const key = img.imageId || `img-${img.index}-${img.seed}`;
      store.put({ ...img, imageId: key });
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const clearAllImages = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
