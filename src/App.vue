<template>
  <div class="app">
    <AppHeader
      :categoryList="category"
      @moveCategory="moveCategory"
      @showSearchInput="showSearchInput"
    />

    <LoadingSpinner v-if="isLoading" />
    <div class="app-contents" v-else>
      <router-view :key="route.fullPath"></router-view>
    </div>

    <!-- Search Modal -->
    <SearchInputModal
      :showSearch="showSearch"
      @closeSearchModal="closeSearchModal"
    />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import SearchInputModal from '@/components/common/SearchInputModal.vue';

import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// import { fetchBlogInfo } from '@/api/index';
import { useCategoryStore } from '@/store/category';
import { searchEntryPosts, getCategories, getPostInfo } from '@/api/posts';
import { /*BlogInfo,*/ Category } from '@/types';
import _ from 'lodash';

const categoryStore = useCategoryStore();
const { setAllCategories, setCategoryInfo } = categoryStore;

const route = useRoute();
const router = useRouter();
const moveCategory = (categoryId: string, categoryPath: string) => {
  showLoadingSpinner();

  setCategoryInfo({ id: categoryId, page: 1 });

  router.push(`/category/${categoryPath}`);
};

const postCnt = ref(0);
const fetchEntryPosts = async () => {
  const { data } = await searchEntryPosts();
  postCnt.value = data.data.totalItems;
};

const mblMainHtml = ref('');
const fetchBlog = async () => {
  const { data } = await getPostInfo();
  mblMainHtml.value = data;
};

// const loginId = ref('');
// const loginUserId = ref('');
// const fetchBlog = async () => {
//   const { data } = await fetchBlogInfo();
//   const blogInfo: BlogInfo = data.tistory.item;
//   postCnt.value =
//     Number(_.find(blogInfo.blogs, ['name', 'haguri-peng'])?.statistics.post) ||
//     0;
//   loginId.value = blogInfo.id || '';
//   loginUserId.value = blogInfo.userId || '';
// };

const category: Category[] = reactive([]);
const fetchCategory = async () => {
  const { data } = await getCategories();
  if (data.data.items.length > 0) {
    const categories: Category[] = data.data.items;
    category.push(..._.filter(categories, (c) => c.entryCount > 0));
  }
};

const isLoading = ref(true);
const showLoadingSpinner = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};

const showSearch = ref(false);
const showSearchInput = () => {
  showSearch.value = true;
};
const closeSearchModal = (type: string, keyword?: string) => {
  showSearch.value = false;

  if (type == 'search') {
    router.push(`/search/posts/${keyword}`);
  }
};

onMounted(() => {
  showLoadingSpinner();
  fetchBlog();
  fetchEntryPosts();
  fetchCategory();
  setAllCategories();
});
</script>

<style>
a {
  color: #df7861;
}
div.app {
  width: 100%;
}
div.app-contents {
  display: flex;
  text-align: -webkit-center;
  justify-content: center;
  align-items: center;
}
</style>
