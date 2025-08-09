import { defineStore } from 'pinia';
import { SnackbarMessage, useSnackbar } from 'vue3-snackbar';

export const useSnackbarStore = defineStore('snackbar', () => {
  const snackbar = useSnackbar();

  const show = (options: SnackbarMessage) => {
    if (!options.text) {
      console.error('text 옵션이 필수입니다.');
      return;
    }

    snackbar.add({
      type: options.type || 'info',
      duration: options.duration || 3000,
      ...options,
    });
  };
  const clearAll = () => {
    snackbar.clear();
  };

  return { show, clearAll };
});
