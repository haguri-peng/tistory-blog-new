<template>
  <GDialog v-model="dialogState" max-width="400" @update:modelValue="close">
    <div class="input-wrapper">
      <input
        type="search"
        class="search-input"
        v-model="inputKeyword"
        ref="searchInput"
        @keyup.enter="searchKeyword"
      />
      <button
        type="button"
        class="btn bg-violet-300 hover:bg-violet-400"
        @click="searchKeyword"
      >
        검색
      </button>
    </div>
  </GDialog>
</template>

<script setup lang="ts">
import { ref, defineModel, watch, nextTick, onUpdated } from 'vue';
import $ from 'jquery';

const showSearch = defineModel<boolean>('showSearch', { required: true });

const emit = defineEmits<{
  closeSearchModal: [type: string, keyword?: string];
}>();

const inputKeyword = ref('');
const searchKeyword = async () => {
  await nextTick();

  if (inputKeyword.value == '') {
    alert('검색어를 입력해주세요.');
    searchInput.value!.focus();
    return;
  }

  emit('closeSearchModal', 'search', inputKeyword.value);
  resetData();
};

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
    }
  }, 100);
});

onUpdated(() => {
  // set background & border
  $('.g-dialog-content')
    .css('--g-dialog-content-bg', 'rgba(118, 84, 154, 0.66)')
    .css('border', '2px solid rgb(118, 84, 154)');
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
</style>
