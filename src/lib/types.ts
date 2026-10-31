export interface Milestone {
  date?: string;
  title: string;
  text?: string;
  photo: string;
  badge?: string;
}

export interface GalleryItem {
  photo: string;
  caption?: string;
  location?: string;
}

export interface FinalLetterConfig {
  salutation?: string;
  body: string;
  signOff?: string;
  closingPhoto?: string;
}

export interface SiteConfig {
  herName: string;
  yourName: string;
  birthday: string; // YYYY-MM-DD
  theme: {
    primary: string;
    primaryHover?: string;
    secondary?: string;
    accent?: string;
    background: string;
  };
  intro: {
    title?: string;
    subtitle?: string;
    buttonText: string;
    passcode?: string; // optional security gate
  };
  heroMessage: string;
  heroSubtitle?: string;
  music: {
    file: string;
    title: string;
    artist?: string;
  };
  togetherSince: string; // YYYY-MM-DD
  togetherCounterLabel?: string;
  timeline: Milestone[];
  gallery: GalleryItem[];
  reasonsSubtitle?: string;
  reasons: string[];
  finalLetter: string | FinalLetterConfig;
}
