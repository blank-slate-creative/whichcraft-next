export interface BeverageData {
  name: string;
  producer: string;
  type: string;
  style?: string;
  notes?: string;
  liked: boolean | null;
  abv?: number | null;
  untappd_beer_id?: number;
  untappd_brewery_id?: number;
  image_url?: string;
}

export interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
}
