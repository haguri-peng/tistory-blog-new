<template>
  <LoadingSpinner v-if="isLoading"></LoadingSpinner>
  <div class="w-full" v-else>
    <div class="category-title">
      {{ categoryName }}
    </div>
    <div class="posts">
      <ul>
        <AppPost
          v-for="post in postList"
          :key="post.id"
          :postItem="post"
          @openContent="moveContent"
        ></AppPost>
      </ul>
      <AppPaging :page="pageInfo" @movePage="fetchPostByCategory"></AppPaging>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppPost from '@/components/AppPost.vue';
import AppPaging from '@/components/AppPaging.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { fetchCategoryList, fetchPostListByCategory } from '../api/index';
import { PageInfo, PostInfo } from '@/types';
import { useCategoryStore } from '@/store/category';
import _ from 'lodash';

const route = useRoute();
const router = useRouter();

const categoryStore = useCategoryStore();
const { getCategoryInfo } = storeToRefs(categoryStore);
const getCategoryId = computed(() => getCategoryInfo.value.id);
const getPageNum = computed(() => getCategoryInfo.value.page);
const { setCategoryInfo: setCategory } = categoryStore;

const postList: PostInfo[] = reactive([]);
const pageInfo = reactive({}) as PageInfo;
const isLoading = ref(false);
const fetchPostByCategory = async (pageNum?: number) => {
  isLoading.value = true;
  postList.length = 0;

  const { data } = await fetchPostListByCategory(
    route.params.categoryId.toString(),
    pageNum ||
      (route.params.categoryId.toString() == getCategoryId.value
        ? Number(getPageNum.value)
        : 1),
  );

  if (data.tistory.status == '200') {
    // 페이징 정보 세팅
    pageInfo.currentPage = Number(data.tistory.item.page);
    pageInfo.totalPage = Math.ceil(
      Number(data.tistory.item.totalCount) / Number(data.tistory.item.count),
    );

    const posts: PostInfo[] = data.tistory.item.posts;
    // 발행된 건만
    postList.push(..._.filter(posts, ['visibility', '20']));

    // 카테고리 정보 세팅
    setCategoryInfo({
      id: route.params.categoryId.toString(),
      page: pageInfo.currentPage,
    });

    // 카테고리 목록 조회
    getCategoryList();
  }
  isLoading.value = false;
};

const categoryName = ref('');
const getCategoryList = async () => {
  const { data } = await fetchCategoryList();

  if (data.tistory.status == '200') {
    const currentCategory = _.find(data.tistory.item.categories, [
      'id',
      getCategoryId.value,
    ]);

    if (currentCategory != null && currentCategory != undefined) {
      categoryName.value = currentCategory.label.replace(/\//g, ' > ');
    }
  }
};
const setCategoryInfo = (categoryInfo: { id: string; page: number }) => {
  // 카테고리 및 페이지 번호를 store에 세팅
  setCategory(categoryInfo);
};

const moveContent = (id: string) => {
  isLoading.value = true;
  router.push(`/${id}`);
};

onMounted(() => {
  fetchPostByCategory();
});
</script>

<style scoped>
div.category-title {
  font-size: 2rem;
  font-weight: bold;
  color: #76549a;
  /* text-decoration: underline; */
  margin-bottom: 50px;
}
div.posts {
  position: relative;
  width: 80%;
  height: calc(100% - 60px);
}
ul {
  margin: 50px 0;
  list-style: none;
}
</style>
