export interface Pin {
  id: number;
  user_id: string;
  title: string;
  content: string;
  image_url?: string;
  latitude: number;
  longitude: number;
  prefecture_code: string;
  area_name: string;
  distance_to_coastline?: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export interface CreatePinData {
  title: string;
  content: string;
  image_url?: string;
  latitude: number;
  longitude: number;
  prefecture_code: string;
  area_name: string;
  distance_to_coastline?: number;
}

export interface PinFormData {
  title: string;
  content: string;
  image?: File;
} 