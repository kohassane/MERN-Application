// Type definitions for the application

export interface SportEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  description: string;
  imageUrl: string;
}

export interface SportResult {
  id: string;
  eventId: string;
  eventName: string;
  date: string;
  category: string;
  teams: {
    name: string;
    score: number;
    position?: number;
  }[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  featured?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  imageUrl: string;
  author: string;
}