import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';

export const useTagStore = defineStore('tag', () => {
  const recentTag: string[] = reactive([]);

  const getRecentTag = computed(() => recentTag);

  function setRecentTag(arrRecentTag: string[]) {
    recentTag.length = 0;
    recentTag.push(...arrRecentTag);
  }

  return { recentTag, getRecentTag, setRecentTag };
});
