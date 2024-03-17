<template>
  <div class="related-post mt-8 w-4/5">
    <div
      class="title text-2xl text-left p-4 underline"
      v-if="postType == 'related'"
    >
      🧵 관련 Post
    </div>
    <div
      class="title text-2xl text-left p-4 underline"
      v-else-if="postType == 'popular'"
    >
      🏆 인기 Post
    </div>
    <div class="post-list">
      <div v-for="post in postList" :key="post.id">
        <div class="post-item" @click="emit('moveContent', post.id)">
          <div>
            <div class="title">{{ post.title }}</div>
            <div class="summary">{{ post.summary }}</div>
          </div>
          <img
            v-if="post.thumbnail != null && post.thumbnail != ''"
            :src="post.thumbnail"
            alt=""
            style="width: 150px; height: auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import _ from 'lodash';

import { getRelatedPosts, getPopularPosts } from '@/api/posts';
import { SearchInfo } from '@/types';

const props = defineProps<{
  tagList: string[];
  categoryId: string;
  postType: string;
}>();
const { postType } = toRefs(props);

const emit = defineEmits<{
  (e: 'moveContent', id: number): void;
}>();

const route = useRoute();
const postId = computed(() => route.params.id.toString());

const postList: SearchInfo[] = reactive([]);
onMounted(async () => {
  if (postType.value == 'related') {
    const { data } = await getRelatedPosts(postId.value);
    postList.push(...data.data.items);
  } else if (postType.value == 'popular') {
    const { data } = await getPopularPosts(postId.value);
    postList.push(...data.data.items);
  }
});
</script>

<style scoped>
div.post-item {
  display: flex;
  border-bottom: 1px solid purple;
}
div.post-item:hover {
  cursor: pointer;
  background-color: rgba(118, 84, 154, 0.3);
}
div.post-item div {
  display: grid;
  text-align: left;
  align-items: center;
  padding: 0 10px;
}
div.post-item div div.title {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
