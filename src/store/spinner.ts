import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useSpinnerStore = defineStore('spinner', () => {
  const isLoading = ref(false);

  const getLoading = computed(() => isLoading.value);

  function setLoading(loading: boolean) {
    isLoading.value = loading;
  }

  function toggleLoading() {
    isLoading.value = !isLoading.value;
  }

  return { isLoading, getLoading, setLoading, toggleLoading };
});
