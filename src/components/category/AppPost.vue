<template>
  <li @click="clickPost(postItem.id)">
    <span class="post-id">ID: {{ postItem.id }}</span>
    <span class="post-title">
      <span>{{ postItem.title }}</span>
      <!-- 댓글이 없으면, 댓글 Icon을 숨김 -->
      <span
        class="text-base ml-1"
        :class="{ hide: Number(postItem.comments) == 0 }"
      >
        <font-awesome-layers full-width class="fa-lg">
          <font-awesome-icon icon="fa-regular fa-comment" />
          <font-awesome-layers-text
            class="text-5xl"
            counter
            :value="postItem.comments"
            position="top-right"
            style="margin-right: -15px; background-color: #76549a"
          />
        </font-awesome-layers>
      </span>
    </span>
    <span class="post-url">{{ postItem.postUrl }}</span>
    <span class="post-date">{{ postItem.date }}</span>
  </li>
</template>

<script setup lang="ts">
import { PostInfo } from '@/types';

defineProps<{
  postItem: PostInfo;
}>();
const emit = defineEmits<{
  openContent: [id: string];
}>();

const clickPost = (postId: string) => {
  emit('openContent', postId);
};
</script>

<style scoped>
li {
  display: table;
  width: 100%;
  font-size: 1.5rem;
  margin: 2px 10px;
}
li:hover {
  color: #df7861;
  cursor: pointer;
}
span.post-id,
span.post-url,
span.post-date {
  display: none;
}
</style>
