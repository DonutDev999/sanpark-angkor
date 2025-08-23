import { defineStore } from 'pinia';
import axios from 'axios';
import { getPlaceholderImage } from '../utils/placeholderImages';

interface Tour {
  id: number;
  title: string;
  duration: string;
  price: number;
  description: string;
  image: string;
  imageKey?: string;
  popularity: number;
}

export const useTourStore = defineStore('tour', {
  state: () => ({
    tours: [] as Tour[],
    isLoading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchTours() {
      this.isLoading = true;
      this.error = null;
      try {
        console.log('🔄 Fetching tours data...');
        const response = await axios.get('/data/tours.json');
        this.tours = response.data;
        console.log('✅ Tours loaded successfully:', this.tours.length, 'tours');
      } catch (error) {
        console.error('❌ Error fetching tours:', error);
        this.error = 'Failed to load tours data';
        // Fallback to empty array to prevent crashes
        this.tours = [];
      } finally {
        this.isLoading = false;
      }
    },
  },
});
