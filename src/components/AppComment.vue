<template>
  <GDialog v-model="dialogState" max-width="500" persistent>
    <div class="wrapper">
      <div class="p-5">
        <div class="text-3xl font-bold mb-5">댓글 작성</div>
        <input
          type="text"
          v-model="blogName"
          placeholder="블로그 주소를 입력해주세요. Ex) haguri-peng"
          style="
            width: 97%;
            margin-bottom: 5px;
            font-size: 1rem;
            padding: 0 5px;
          "
        />
        <textarea
          v-model="comment"
          name="text"
          rows="5"
          placeholder="댓글을 작성해주세요."
          style="font-size: 1rem; width: 97.4%; resize: none; padding: 5px"
        ></textarea>
        <label for="check">
          <input type="checkbox" id="check" v-model="arrChk" value="secret" />
          비밀댓글
        </label>
        <span style="margin-left: 20px; color: blue" v-if="mode == 'M'">
          *댓글 수정은 한 번만 가능합니다.
        </span>
      </div>
      <div class="actions">
        <button class="btn submit bg-violet-300" @click="submit">
          <template v-if="mode == 'M'">수정</template>
          <template v-else>등록</template>
        </button>
        <button class="btn close bg-violet-300" @click="close">닫기</button>
      </div>
    </div>
  </GDialog>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { getGuestbookInit } from '@/api/posts';
import { GuestbookInitRes } from '@/api/axiosResTypes';
import { /*CommentInput,*/ CommentPost } from '@/types';
import { useCommentStore } from '@/store/comment';

const emit = defineEmits<{
  (e: 'closeModal', action: string, objData?: CommentPost): void;
}>();

const props = defineProps<{
  showModal: boolean;
}>();
const { showModal } = toRefs(props);

const commentStore = useCommentStore();
const { getCommentInfo } = storeToRefs(commentStore);
// const getParentCommentId = computed(() => getCommentInfo.value.parentCommentId);
const getCommentId = computed(() => getCommentInfo.value.commentId);
const getModComment = computed(() => getCommentInfo.value.modComment);
const { clearCommentInfo } = commentStore;

const dialogState = ref(false);
const blogName = ref('');
const comment = ref('');
let arrChk = reactive([]);
const mode = ref('');
const submit = () => {
  if (blogName.value == '') {
    alert('블로그 주소는 필수입니다.');
    return;
  }
  if (comment.value == '') {
    alert('댓글이 입력되지 않았습니다.');
    return;
  }

  // const objData: CommentInput = {
  //   blogName: blogName.value,
  //   content: comment.value,
  //   secret: arrChk.length > 0 ? 1 : 0, // 1: 비밀댓글, 0: 공개댓글
  //   parentId: getParentCommentId.value,
  // };
  const objData: CommentPost = {
    captcha: '',
    comment: comment.value,
    homepage: loginHomepage.value,
    isSecret: arrChk.length > 0, // true: 비밀댓글, false: 공개댓글
    name: loginName.value,
    parent: null,
    password: '',
  };

  // 댓글 수정인 경우
  if (mode.value == 'M') {
    objData.parent = Number(getCommentId.value);
  }

  resetData();
  emit('closeModal', 'submit', objData);
};
const close = () => {
  resetData();
  emit('closeModal', 'close');
};
const resetData = () => {
  dialogState.value = false;
  blogName.value = '';
  comment.value = '';
  arrChk.length = 0;
  mode.value = '';

  clearCommentInfo();
};

const loginId = ref(0);
const loginName = ref('');
const loginHomepage = ref('');
watch(showModal, (val) => {
  dialogState.value = val;

  if (val) {
    // 로그인한 사용자의 정보를 가져온다.
    getRequestUser()
      .then(({ data }) => {
        if (data.data != null) {
          const reqUser = data.data.viewer;
          blogName.value = reqUser.homepage
            .replace('https://', '')
            .replace('.tistory.com', '');
          loginId.value = reqUser.id;
          loginName.value = reqUser.name;
          loginHomepage.value = reqUser.homepage;
        }
      })
      .catch((err) => console.error(err));
  }
});
watch(getModComment, (val) => {
  mode.value = 'M';
  comment.value = val || '';
});

function getRequestUser(): GuestbookInitRes {
  return new Promise((resolve) => {
    resolve(getGuestbookInit());
  });
}
</script>

<style scoped>
.wrapper {
  color: #000;
  background-color: rgba(118, 84, 154, 0.11);
  border: 3px solid #76549a;
}
.actions {
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
.actions button.btn {
  pointer-events: all;
  margin: 0 4px;
  padding: 0 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.actions button.btn:hover {
  font-weight: 500;
  background-color: #76549a;
}
</style>
