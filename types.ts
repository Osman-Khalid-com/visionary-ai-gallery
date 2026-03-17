
export interface GalleryImage {
  index: number;
  title: string;
  imageId: string;
  isNsfw: boolean;
  isShocking: boolean;
  prompt: string;
  negativePrompt: string;
  imgclassName?: string;
  image: string;
  naturalWidth: number;
  naturalHeight: number;
  seed: string;
  id: string | null;
  className?: string;
  timestamp: string;
}

export interface GallerySettings {
  safeMode: boolean; // Blurs NSFW/Shocking by default
  showAllExplicit: boolean; // Globally unblurs
  itemsPerPage: number;
  filterNsfwOnly: boolean;
  filterShockingOnly: boolean;
  searchQuery: string;
}
