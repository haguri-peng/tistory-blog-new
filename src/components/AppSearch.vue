<template>
  <LoadingSpinner v-if="isFirstLoading" />
  <div class="search-area" v-else>
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
          v-if="item.thumbnailUrl != null"
          :src="item.thumbnailUrl"
          alt=""
          style="width: 150px; height: 150px"
        />
      </div>
    </div>

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

import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import { searchTags, searchPosts } from '@/api/posts';
import { SearchInfo } from '@/types';

import $ from 'jquery';
import { debounce } from 'lodash';

const route = useRoute();
const paramType = computed(() => route.params.type.toString());
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

const isFirstLoading = ref(false);
const isLast = ref(true);
const page = ref(1);
const total = ref(0);
const items: SearchInfo[] = reactive([]);
const showNextIcon = ref(false);
const search = async (type: string, keyword: string) => {
  if (page.value == 1) {
    isFirstLoading.value = true;
  }

  let data;
  if (type == 'tags') {
    const res = await searchTags(keyword, page.value, 10);
    data = res.data;
  } else if (type == 'posts') {
    const res = await searchPosts(keyword, page.value, 10);
    data = res.data;
  }

  if (data!.code == 200) {
    isLast.value = data!.result.isLast;
    total.value = data!.result.total;
    for (const item of data!.result.items) {
      items.push(item);
    }
  }
  isFirstLoading.value = false;
};
const initData = () => {
  isLast.value = true;
  page.value = 1;
  total.value = 0;
  items.length = 0;
  showNextIcon.value = false;
};

onMounted(() => {
  search(paramType.value, paramKeyword.value);

  $(window).scroll(
    debounce(() => {
      if (isLast.value) {
        showNextIcon.value = false;
        return;
      }

      const scrollTop = $(window).scrollTop();
      const innerHeight = $(window).innerHeight();
      const calcScroll = scrollTop! + innerHeight!;
      const scrollHeight = $('div.search-area')[0].scrollHeight || 0 + 80;

      if (!isLast.value && calcScroll >= scrollHeight) {
        showNextIcon.value = true;
        page.value++;
        search(paramType.value, paramKeyword.value);
      }
    }, 300),
  );
});
onUnmounted(() => {
  $(window).off('scroll');
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
