export interface IkeaOffer {
  offerNumber: string;
  price: number;
}

export interface IkeaProduct {
  id: string;
  heroImage: string;
  storeId: string;
  title: string;
  description: string;
  originalPrice: number;
  minPrice: number;
  maxPrice: number;
  offers: IkeaOffer[];
  imageUrl: string;
}

export interface IkeaResponse {
  content: IkeaProduct[];
  totalPages: number;
}

export interface UserSettings {
  storeIds: number[];
  searchTerms: string[];
}

export interface State {
  previousOffers: string[];
}

export interface IkeaStore {
  id: string;
  displayName: string;
  lat: string;
  lng: string;
}
