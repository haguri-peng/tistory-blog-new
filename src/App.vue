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

import _ from 'lodash';
import * as htmlparser2 from 'htmlparser2';
import * as cheerio from 'cheerio';

import { useCategoryStore } from '@/store/category';
import { useTagStore } from '@/store/tag';
import { getCategories, getPostInfo, getBlogRss } from '@/api/posts';
import { Category } from '@/types';

const categoryStore = useCategoryStore();
const { setAllCategories, setCategoryInfo } = categoryStore;

const tagStore = useTagStore();
const { setRecentTag } = tagStore;

const route = useRoute();
const router = useRouter();
const moveCategory = (categoryId: string, categoryPath: string) => {
  showLoadingSpinner();
  setCategoryInfo({ id: categoryId, page: 1 });

  router.push(`/category/${categoryPath}`);
};

const fetchBlogRss = async () => {
  const { data: sXml } = await getBlogRss();
  // console.log(sXml);

  // htmlparser
  const dom = htmlparser2.parseDocument(sXml);
  if (dom != null) {
    const elHtml = _.find(
      dom.children,
      (c: cheerio.Element) => c.type == 'tag' && c.tagName == 'rss',
    );
    // console.log(elHtml);

    // @ts-ignore
    const $ = cheerio.load(elHtml);
    const $item = $('item:lt(10)');
    const arrTmpTags: string[] = [];
    // @ts-ignore
    $item.each(function (i, el) {
      const $category = $(el).find('category');
      $category.each(function () {
        arrTmpTags.push($(this).text());
      });
    });
    setRecentTag(_.uniq(arrTmpTags));
  }
};

const mblMainHtml = ref('');
const fetchBlog = async () => {
  const { data } = await getPostInfo();
  mblMainHtml.value = data;
};

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
  fetchBlogRss();
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
