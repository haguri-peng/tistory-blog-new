<template>
  <div class="app">
    <AppHeader
      :categoryList="category"
      @moveCategory="moveCategory"
      @showSearchInput="showSearchInput"
    />

    <LoadingSpinner v-if="isLoading" />
    <div class="app-contents" v-else>
      <router-view></router-view>
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
import { useRouter } from 'vue-router';

import { fetchBlogInfo, fetchCategoryList } from '@/api/index';
import { BlogInfo, Category } from '@/types';
import _ from 'lodash';

const router = useRouter();

// data
const isLoading = ref(true);
const category: Category[] = reactive([]);
const postCnt = ref(0);
const loginId = ref('');
const loginUserId = ref('');
const showSearch = ref(false);

// methods
const fetchBlog = async () => {
  const { data } = await fetchBlogInfo();
  const blogInfo: BlogInfo = data.tistory.item;
  // console.log(data);

  postCnt.value =
    Number(_.find(blogInfo.blogs, ['name', 'haguri-peng'])?.statistics.post) ||
    0;
  loginId.value = blogInfo.id || '';
  loginUserId.value = blogInfo.userId || '';
};
const fetchCategory = async () => {
  const { data } = await fetchCategoryList();
  // console.log(data.tistory);

  if (data.tistory.status == '200') {
    const categories: Category[] = data.tistory.item.categories;
    category.push(..._.filter(categories, (c) => Number(c.entries) > 0));
  }
};
const showLoadingSpinner = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};
const moveCategory = (id: string) => {
  showLoadingSpinner();
  router.push(`/category/${id}`);
};
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
  fetchCategory();
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
