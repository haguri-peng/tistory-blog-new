import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';

import { CommentInfo } from '@/types';

const setValue = <T>(obj: T, key: keyof T, value: T[keyof T]) => {
  obj[key] = value;
};

export const useCommentStore = defineStore('comment', () => {
  const commentInfo = reactive(<CommentInfo>{});

  const getCommentInfo = computed(() => commentInfo);

  function setCommentInfo(pCommentInfo: CommentInfo) {
    for (const key of Object.keys(pCommentInfo)) {
      const commentKey = key as keyof CommentInfo;
      setValue<CommentInfo>(commentInfo, commentKey, pCommentInfo[commentKey]);
    }
  }

  function clearCommentInfo() {
    const initData = <CommentInfo>{};
    for (const key of Object.keys(commentInfo)) {
      const commentKey = key as keyof CommentInfo;
      setValue<CommentInfo>(commentInfo, commentKey, initData[commentKey]);
    }
  }

  return { commentInfo, getCommentInfo, setCommentInfo, clearCommentInfo };
});
