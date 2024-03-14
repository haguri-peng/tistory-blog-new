import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';

import _ from 'lodash';
import moment from 'moment';

import { Category, CategoryInfo } from '@/types';
import { isNullStr, categoryReduce, setValue } from '@/utils/utils';
import { getCategories } from '@/api/posts';

export const useCategoryStore = defineStore('category', () => {
  const allCategories: Category[] = reactive([]);
  const getAllCategories = computed(() => allCategories);

  async function setAllCategories() {
    const { data } = await getCategories();
    if (data.data.items.length > 0) {
      allCategories.push(..._.reduce(data.data.items, categoryReduce, []));
    }
  }

  function getRecentCategories() {
    const recentCategories = _.filter(getAllCategories.value, (c) => {
      const now = moment();
      const updated = moment(c.lastUpdate);
      // 90일 이전에 업데이트된 카테고리만 가져온다.
      return now.diff(updated, 'days') <= 90;
    }) as Category[];
    return recentCategories;
  }

  function getCategoryPath(categoriId: string, separator?: string) {
    let result = '';
    let currentCategory = _.find(getAllCategories.value, ['id', categoriId]);
    if (currentCategory == undefined) {
      currentCategory = _.find(getAllCategories.value, ['path', categoriId]);
    }
    if (currentCategory != undefined) {
      if (isNullStr(separator)) {
        result = currentCategory.path;
      } else {
        result = currentCategory.path.replace(/\//g, separator || '/');
      }
    }
    return result;
  }

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

  return {
    getAllCategories,
    setAllCategories,
    getRecentCategories,
    getCategoryPath,
    categoryInfo,
    getCategoryInfo,
    setCategoryInfo,
    clearCategoryInfo,
  };
});
