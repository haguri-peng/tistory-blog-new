<template>
  <div class="app">
    <AppHeader
      :categoryList="category"
      @moveCategory="moveCategory"
      @showSearchInput="showSearchInput"
    />

    <!-- Spinner & Content -->
    <LoadingSpinner v-if="getLoading" />
    <div class="app-contents" v-else>
      <router-view :key="route.path"></router-view>
    </div>

    <!-- Search Modal -->
    <SearchInputModal :showSearch @closeSearchModal="closeSearchModal" />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import SearchInputModal from '@/components/SearchInputModal.vue';

import { ref, reactive, onBeforeMount, onMounted, onUpdated } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { find, uniq, filter } from 'lodash-es';
import * as htmlparser2 from 'htmlparser2';
import * as cheerio from 'cheerio';

import { useCategoryStore } from '@/store/category';
import { useTagStore } from '@/store/tag';
import { getCategories, getPostInfo, getBlogRss } from '@/api/posts';
import { Category } from '@/types';
import { isMobile } from '@/utils/utils';
import { spinnerControl } from '@/utils/spinner-control';

const categoryStore = useCategoryStore();
const { setAllCategories, setCategoryInfo } = categoryStore;

const tagStore = useTagStore();
const { setRecentTag } = tagStore;

const { getLoading, setLoading } = spinnerControl();

const route = useRoute();
const router = useRouter();
const moveCategory = (categoryId: string, categoryPath: string) => {
  setCategoryInfo({ id: categoryId, page: 1 });

  router.push(`/category/${categoryPath}`);
};

const fetchBlogRss = async () => {
  const { data: sXml } = await getBlogRss();
  // console.log(sXml);

  // htmlparser
  const dom = htmlparser2.parseDocument(sXml);
  if (dom != null) {
    const elHtml = find(
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
      const $category = $(el).find('category').not(':first');
      $category.each(function () {
        arrTmpTags.push($(this).text());
      });
    });
    setRecentTag(uniq(arrTmpTags));
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
    category.push(...filter(categories, (c) => c.entryCount > 0));
  }
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

const domain = 'https://haguri-peng.tistory.com';
const testDomain = 'http://localhost:5173';
onBeforeMount(async () => {
  if (isMobile()) {
    const path = location.href.replace(domain, '').replace(testDomain, '');
    location.href = domain + '/m' + path;
  }
});

onMounted(() => {
  fetchBlog();
  fetchBlogRss();
  fetchCategory();
  setAllCategories();
});

onUpdated(() => {
  // hide Spinner
  setTimeout(() => {
    setLoading(false);
  }, 300);
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
