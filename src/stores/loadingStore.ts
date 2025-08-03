// src/stores/loadingStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false);
  const loadingMessage = ref('Loading...');
  const loadingCount = ref(0); // Track multiple concurrent requests

  const startLoading = (message: string = 'Loading...') => {
    loadingCount.value++;
    loadingMessage.value = message;
    isLoading.value = true;
  };

  const stopLoading = () => {
    if (loadingCount.value > 0) {
      loadingCount.value--;
    }
    
    // Only stop loading when all requests are complete
    if (loadingCount.value === 0) {
      isLoading.value = false;
      loadingMessage.value = 'Loading...';
    }
  };

  const forceStopLoading = () => {
    loadingCount.value = 0;
    isLoading.value = false;
    loadingMessage.value = 'Loading...';
  };

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    forceStopLoading,
  };
});