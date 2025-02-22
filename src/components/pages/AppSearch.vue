<template>
  <div class="search-area">
    <!-- Title -->
    <div
      class="text-2xl font-bold text-left pl-2 pr-2"
      style="border-bottom: 1px solid purple"
    >
      '
      <span style="color: #df7861">{{ paramKeyword }}</span>
      '
      <span v-if="paramType == 'tags'"> Tags</span>
      <span v-else> Posts</span>
      검색결과
      <span>({{ total }})</span>
    </div>

    <!-- List -->
    <div v-for="item in items" :key="item.id">
      <div
        class="tag-item"
        v-if="item.visibility == 'PUBLIC'"
        @click="moveContent(item.id)"
      >
        <div>
          <div class="title">{{ item.title }}</div>
          <div class="summary">{{ item.summary }}</div>
        </div>
        <img
          v-if="item.thumbnail != null && item.thumbnail != ''"
          :src="item.thumbnail"
          alt=""
          style="width: 150px; height: 150px"
        />
      </div>
    </div>

    <!-- Next icon (spinner) -->
    <div
      style="
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <div v-if="showNextIcon">
        <font-awesome-icon
          icon="fa-solid fa-circle-notch"
          size="2x"
          spin-pulse
          spin-reverse
          style="color: #76549a; --fa-animation-duration: 0.5s"
        />
      </div>
      <div v-else>&nbsp;</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';

import { searchTags, searchPosts } from '@/api/posts';
import { SearchInfo } from '@/types';
import { isNullStr } from '@/utils/utils';

import { throttle } from 'lodash-es';

const route = useRoute();
const paramType = computed(() => (route.params.type || '').toString());
const paramKeyword = computed(() => route.params.keyword.toString());

const router = useRouter();
const moveContent = (id: number) => {
  router.push(`/${id}`);
};
onBeforeRouteUpdate((to, from) => {
  if (to.path.indexOf('/search') > -1) {
    if (to.path != from.path) {
      initData();
      search(paramType.value, paramKeyword.value);
    }
  }
});

const isLast = ref(true);
const page = ref(1);
const total = ref(0);
const items: SearchInfo[] = reactive([]);
const showNextIcon = ref(false);
const search = async (type: string, keyword: string) => {
  let data;
  if (type == 'tags') {
    const res = await searchTags(keyword, page.value, 10);
    data = res.data;
  } else if (isNullStr(type) || type == 'posts') {
    const res = await searchPosts(keyword, page.value, 10);
    data = res.data;
  }

  if (data!.data.totalItems > 0) {
    isLast.value = data!.data.isLast;
    total.value = data!.data.totalItems;
    for (const item of data!.data.items) {
      items.push(item);
    }
  }
};
const initData = () => {
  isLast.value = true;
  page.value = 1;
  total.value = 0;
  items.length = 0;
  showNextIcon.value = false;
};

function searchThrottle() {
  return throttle(() => {
    if (isLast.value) {
      showNextIcon.value = false;
      return;
    }

    const scrollTop = window.scrollY;
    const innerHeight = window.innerHeight;
    const calcScroll = scrollTop! + innerHeight!;
    const scrollHeight =
      document.querySelector('div.search-area')!.scrollHeight || 0 + 80;

    if (!isLast.value && calcScroll >= scrollHeight) {
      showNextIcon.value = true;
      page.value++;
      search(paramType.value, paramKeyword.value);
    }
  }, 300);
}
onMounted(() => {
  search(paramType.value, paramKeyword.value);
  window.addEventListener('scroll', searchThrottle());
});
onUnmounted(() => {
  window.removeEventListener('scroll', searchThrottle());
});
</script>

<style scoped>
div.search-area {
  width: 70%;
  margin-top: 80px;
}
div.tag-item {
  display: flex;
  border-bottom: 1px solid purple;
}
div.tag-item:hover {
  cursor: pointer;
  background-color: rgba(118, 84, 154, 0.3);
}
div.tag-item div {
  display: grid;
  text-align: left;
  align-items: center;
  padding: 0 10px;
}
div.tag-item div div.title {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
