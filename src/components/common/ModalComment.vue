<template>
  <GDialog
    v-model="dialogState"
    max-width="500"
    persistent
    @update:modelValue="onClose"
  >
    <div class="wrapper text-black">
      <div class="p-5">
        <div class="text-3xl font-bold mb-5">【{{ title }}】</div>
        <input
          v-if="modalType === 'comment'"
          type="text"
          v-model="blogName"
          placeholder="Enter your blog's name"
          style="
            width: 97%;
            margin-bottom: 5px;
            font-size: 1rem;
            padding: 0 5px;
          "
        />
        <textarea
          v-model="comment"
          rows="5"
          placeholder="Insert your comment"
          style="font-size: 1rem; width: 97.4%; resize: none; padding: 5px"
        ></textarea>
        <label for="check">
          <input type="checkbox" id="check" v-model="arrChk" value="secret" />
          secret
        </label>
      </div>
      <div class="actions flex justify-end">
        <button class="btn submit bg-violet-300" @click="submit">등록</button>
        <button class="btn close bg-violet-300" @click="close">닫기</button>
      </div>
    </div>
  </GDialog>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, watch, watchEffect } from 'vue';

const emit = defineEmits<{
  (
    e: 'closeModal',
    action: string,
    objData?: { blogName: string; comment: string; secret: boolean },
  ): void;
}>();
const props = defineProps({
  showModal: Boolean,
  type: String,
});

const { showModal, type } = toRefs(props);

// data
const dialogState = ref(false);
const modalType = ref(type);

const title = ref('');
const blogName = ref('');
const comment = ref('');
let arrChk = reactive([]);

// set title
if (modalType.value == 'comment') {
  title.value = '댓글';
} else if (modalType.value == 'guestbook') {
  title.value = '방명록';
}

// methods
const clearModal = () => {
  blogName.value = '';
  comment.value = '';
  arrChk.length = 0;
};
const submit = () => {
  // input validation
  if (modalType.value == 'comment' && blogName.value == '') {
    alert('블로그 주소는 필수입니다.');
    return;
  }
  if (comment.value == '') {
    alert('입력된 내용이 없습니다.');
    return;
  }

  const objData = {
    blogName: blogName.value,
    comment: comment.value,
    secret: arrChk.length > 0 ? true : false,
  };

  clearModal();
  emit('closeModal', 'submit', objData);
};
const close = () => {
  clearModal();
  emit('closeModal', 'close');
};
const onClose = () => {
  close();
};

// watch
watch(showModal, (val) => {
  dialogState.value = val;
});
// watchEffect
watchEffect(() => {
  // console.log('dialogState >> ' + dialogState.value);
});
</script>

<style scoped>
.wrapper {
  background-color: rgba(118, 84, 154, 0.11);
  border: 3px solid #76549a;
}
.actions {
  padding: 10px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
.actions button.btn {
  pointer-events: all;
  margin: 0 4px;
  padding: 5px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.actions button.btn:hover {
  font-weight: 500;
  background-color: #76549a;
}
</style>
