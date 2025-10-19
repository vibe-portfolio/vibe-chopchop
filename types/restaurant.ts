export type PriceLevel = 1 | 2 | 3;

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceLevel: PriceLevel;
  rating: number;
  smellRating: number;
  foodQuality: number;
  latitude: number;
  longitude: number;
  website: string;
  logo: string;
  address: string;
}
