<template>
  <GDialog v-model="dialogState" max-width="800" @update:modelValue="close">
    <div class="tags-wrapper">
      <div class="title text-2xl flex justify-between">
        <div>
          ［Recent Tags <font-awesome-icon icon="fa-solid fa-tags" /> ］
        </div>
        <div class="close" @click="close">
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </div>
      </div>
      <div class="tag-content mt-4">
        <span v-for="(tag, idx) in getRecentTag" :key="idx">
          <button
            type="button"
            class="font-bold border-none mr-1"
            @click="searchTag(tag)"
          >
            #{{ tag }}
          </button>
        </span>
      </div>
    </div>
  </GDialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUpdated } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useTagStore } from '@/store/tag';
import { css } from '@/utils/utils';

const showRecentTag = defineModel<boolean>('showRecentTag', { required: true });

const emit = defineEmits<{
  closeTagModal: [];
}>();

const tagStore = useTagStore();
const { getRecentTag } = storeToRefs(tagStore);

const router = useRouter();
const searchTag = (tag: string) => {
  close();
  router.push(`/search/tags/${tag}`);
};

const close = () => {
  emit('closeTagModal');
};

const dialogState = ref(false);
watch(showRecentTag, async (val) => {
  dialogState.value = val;
});

onUpdated(async () => {
  await nextTick();

  // set background & border
  const elDialog = document.querySelectorAll<HTMLElement>('.g-dialog-content');
  css(elDialog, {
    backgroundColor: '#fcf8e8',
    border: '3px solid #76549a',
  });
});
</script>

<style scoped>
div.tags-wrapper {
  margin: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
div.tags-wrapper div.title {
  color: #76549a;
}
div.tags-wrapper button:hover {
  color: #df7861;
  text-decoration: underline;
}
div.tags-wrapper div.close:hover {
  color: #df7861;
  cursor: pointer;
}
div.tags-wrapper div.tag-content {
  border: 1px dashed lightgray;
}
</style>
