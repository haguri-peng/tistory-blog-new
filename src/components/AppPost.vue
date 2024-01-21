<template>
  <li @click="clickPost(postItem.id)">
    <span class="post-id">ID: {{ postItem.id }}</span>
    <span class="post-title">
      <span>{{ postItem.title }}</span>
      <span class="text-base ml-1">
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

const emit = defineEmits<{
  (e: 'openContent', id: string): void;
}>();
defineProps<{
  postItem: PostInfo;
}>();

// methods
const clickPost = (postId: string) => {
  emit('openContent', postId);
};
</script>

<style scoped>
li {
  display: table;
  width: 100%;
  /* border: 3px solid #73a9ad; */
  font-size: 1.5rem;
  margin: 2px 10px;
  /* opacity: 0.8; */
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
