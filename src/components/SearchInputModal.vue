<template>
  <GDialog v-model="dialogState" max-width="400" @update:modelValue="close">
    <div class="input-wrapper">
      <input
        type="search"
        class="search-input"
        v-model="inputKeyword"
        ref="searchInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @keyup.enter="throttleSearch"
      />
      <span ref="customCursor" class="custom-cursor" v-show="isFocused"></span>
      <span ref="measureSpan" class="measure-span">{{ inputKeyword }}</span>
      <button
        type="button"
        class="btn bg-violet-300 hover:bg-violet-400"
        @click="throttleSearch"
      >
        검색
      </button>
    </div>
  </GDialog>
</template>

<script setup lang="ts">
import { ref, defineModel, watch, nextTick, onUpdated } from 'vue';
import { css } from '@/utils/utils';

import { throttle } from 'lodash-es';
import { useSnackbarStore } from '@/store/snackbar';

const showSearch = defineModel<boolean>('showSearch', { required: true });

const emit = defineEmits<{
  closeSearchModal: [type: string, keyword?: string];
}>();

const snackbarStore = useSnackbarStore();
const inputKeyword = ref('');
const searchKeyword = async () => {
  await nextTick();

  if (inputKeyword.value == '') {
    // alert('검색어를 입력해주세요.');
    snackbarStore.show({
      type: 'warning',
      text: '검색어를 입력해주세요.',
    });
    searchInput.value!.focus();
    return;
  }

  emit('closeSearchModal', 'search', inputKeyword.value);
  resetData();
};
const throttleSearch = throttle(searchKeyword, 100);

const dialogState = ref(false);
const close = () => {
  emit('closeSearchModal', 'close');
  resetData();
};
const resetData = () => {
  dialogState.value = false;
  inputKeyword.value = '';
};

const searchInput = ref<HTMLInputElement>();
watch(showSearch, async (val) => {
  dialogState.value = val;

  await nextTick();

  setTimeout(() => {
    if (val) {
      searchInput.value!.focus();
      updateCursorPosition();
    }
  }, 100);
});

const isFocused = ref(false);
const handleInput = () => {
  updateCursorPosition();
};
const handleFocus = () => {
  isFocused.value = true;
};
const handleBlur = () => {
  isFocused.value = false;
};

const measureSpan = ref<HTMLSpanElement>();
const customCursor = ref<HTMLSpanElement>();
const updateCursorPosition = async () => {
  await nextTick();

  if (isFocused.value && measureSpan.value && customCursor.value) {
    const textWidth = measureSpan.value.offsetWidth;
    // input 패딩(5px) + 테두리 고려
    // 200은 input의 너비
    customCursor.value.style.left = `${textWidth + 5 - 200}px`; // 패딩/테두리 보정값
  }
};

onUpdated(async () => {
  await nextTick();

  // set background & border
  const elDialog = document.querySelectorAll<HTMLElement>('.g-dialog-content');
  css(elDialog, {
    backgroundColor: 'rgba(118, 84, 154, 0.66)',
    border: '2px solid rgb(118, 84, 154)',
  });
});
</script>

<style scoped>
.input-wrapper {
  height: 40px;
  margin: 1rem 0;
  display: flex;
  justify-content: center;
}
.search-input {
  width: 200px;
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 5px;
  background-color: #fcf8e8;
  padding: 0 5px;
  font-family: 'Monaco';
  caret-color: transparent;
}
.custom-cursor {
  display: none;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 1.5rem;
  background: #007bff;
}
.search-input:focus + .custom-cursor {
  display: inline-block;
  animation: blink 0.7s infinite;
  caret-color: transparent; /* 기존 커서 숨기기 */
}
.measure-span {
  position: absolute;
  visibility: hidden;
  white-space: pre; /* 공백 유지 */
  font-size: 1.2rem;
  font-family: 'Monaco';
  padding: 0;
}
.btn {
  pointer-events: all;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0 5px;
  margin-left: 5px;
  cursor: pointer;
  border-radius: 3px;
}
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
