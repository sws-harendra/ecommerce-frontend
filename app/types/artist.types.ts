export interface Artist {
  id: number;
  name: string;
  isActive: boolean;
  isFeatured: boolean;
  aboutArtist?: string | null;
  image: string | null;
  createdAt?: string;
  updatedAt?: string;
}
