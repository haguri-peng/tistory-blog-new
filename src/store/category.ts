import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';

import { CategoryInfo } from '@/types';
import { setValue } from '@/utils/utils';

export const useCategoryStore = defineStore('category', () => {
  const categoryInfo = reactive(<CategoryInfo>{});

  const getCategoryInfo = computed(() => categoryInfo);

  function setCategoryInfo(pCategoryInfo: CategoryInfo) {
    for (const key of Object.keys(pCategoryInfo)) {
      const categoryKey = key as keyof CategoryInfo;
      setValue<CategoryInfo>(
        categoryInfo,
        categoryKey,
        pCategoryInfo[categoryKey],
      );
    }
  }

  function clearCategoryInfo() {
    const initData = <CategoryInfo>{};
    for (const key of Object.keys(categoryInfo)) {
      const categoryKey = key as keyof CategoryInfo;
      setValue<CategoryInfo>(categoryInfo, categoryKey, initData[categoryKey]);
    }
  }

  return { categoryInfo, getCategoryInfo, setCategoryInfo, clearCategoryInfo };
});
