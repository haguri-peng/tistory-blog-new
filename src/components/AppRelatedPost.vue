<template>
  <div class="related-post mt-8 w-4/5">
    <div class="title text-2xl text-left p-4 underline">🧵 관련 Post</div>
    <div class="post-list">
      <div v-for="post in relatedPostList" :key="post.id">
        <div class="post-item" @click="emit('moveContent', post.id)">
          <div>
            <div class="title">{{ post.title }}</div>
            <div class="summary">{{ post.summary }}</div>
          </div>
          <img
            v-if="post.thumbnail != null && post.thumbnail != ''"
            :src="post.thumbnail"
            alt=""
            style="width: 150px; height: 150px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

import _ from 'lodash';

// import { fetchPostListByCategory } from '@/api/index';
import { searchTags } from '@/api/posts';
import { SearchInfo, PostInfo } from '@/types';

const props = defineProps<{
  tagList: string[];
  categoryId: string;
}>();
// const { tagList, categoryId } = toRefs(props);

const emit = defineEmits<{
  (e: 'moveContent', id: number): void;
}>();

const route = useRoute();
const postId = computed(() => route.params.id.toString());

const postsMaxCnt = 3; // 총 3개의 Post만
const relatedPostList: SearchInfo[] = reactive([]);

// watch(
//   tagList,
//   async () => {
//     // 각각의 Tag로 검색하여 관련 Post 정보를 가져온다.
//     outer: for (const tag of tagList.value) {
//       if (relatedPostList.length >= postsMaxCnt) break;
//       const res = await searchTags(tag, 1, 10);
//       // 공개 건만
//       if (res.data.data.totalItems > 0) {
//         for (const item of res.data.data.items) {
//           if (relatedPostList.length >= postsMaxCnt) break outer;
//           // 현재 로드된 PostId는 제외
//           if (
//             item.id.toString() != postId.value &&
//             _.findIndex(relatedPostList, ['id', item.id]) == -1 &&
//             item.visibility == 'PUBLIC'
//           ) {
//             relatedPostList.push(item);
//           }
//         }
//       }
//     }

//     // 그래도 검색된 Post가 없다면, 해당 카테고리에 있는 최신글 목록을 가져온다.
//     if (relatedPostList.length < postsMaxCnt) {
//       const { data } = await fetchPostListByCategory(categoryId.value, 1);
//       if (data.tistory.status == '200') {
//         const posts: PostInfo[] = data.tistory.item.posts;
//         for (const post of posts) {
//           if (relatedPostList.length >= postsMaxCnt) break;

//           // 발행된 건만
//           if (
//             post.id != postId.value &&
//             _.findIndex(relatedPostList, ['id', Number(post.id)]) == -1 &&
//             post.visibility == '20'
//           ) {
//             // summary와 thumbnailUrl이 없기 때문에 목록 형식으로 보여준다.
//             const tmpPost: SearchInfo = {
//               authorId: 177757,
//               authorProfileImage:
//                 'https://tistory1.daumcdn.net/tistory/2876097/attach/b264a1842b8c4571880fe9461fefe331',
//               authorProfileNickname: '하구리',
//               blogId: 2876097,
//               blogName: 'haguri-peng',
//               categoryId: Number(categoryId.value),
//               categoryName: '',
//               id: Number(post.id),
//               profile:
//                 'https://tistory1.daumcdn.net/tistory/2876097/attach/b264a1842b8c4571880fe9461fefe331',
//               tags: [],
//               summary: '',
//               commentCount: post.comments.length,
//               reactionCount: 0,
//               published: post.date,
//               thumbnail: '',
//               title: post.title,
//               path: post.postUrl,
//               url: 'https://haguri-peng.tistory.com',
//               visibility: 'PUBLIC',
//             };
//             relatedPostList.push(tmpPost);
//           }
//         }
//       }
//     }
//   },
//   {
//     once: true,
//   },
// );
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
