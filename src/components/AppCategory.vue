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
      <AppPaging
        :page="pageInfo"
        @movePage="fetchPostListByCategory"
      ></AppPaging>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import _ from 'lodash';
import * as htmlparser2 from 'htmlparser2';
import * as cheerio from 'cheerio';

import AppPost from '@/components/AppPost.vue';
import AppPaging from '@/components/AppPaging.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

// import { fetchPostListByCategory } from '@//api/index';
import { getFirstPostListByCategory, getPostListByCategory } from '@/api/posts';
import { PageInfo, PostInfo } from '@/types';
import { useCategoryStore } from '@/store/category';
import { isNullStr } from '@/utils/utils';

const route = useRoute();
const getRouteCategoryPath = computed(() =>
  route.params.categoryPath.toString(),
);
const router = useRouter();
const moveContent = (id: string) => {
  isLoading.value = true;
  router.push(`/${id}`);
};

const categoryStore = useCategoryStore();
const { getCategoryInfo } = storeToRefs(categoryStore);
const getCategoryId = computed(() => getCategoryInfo.value.id);
const getPageNum = computed(() => getCategoryInfo.value.page);
const { setCategoryInfo, getCategoryPath } = categoryStore;

const isLoading = ref(false);
const postList: PostInfo[] = reactive([]);
const pageInfo = reactive({}) as PageInfo;

const categoryName = ref('');
const setCategoryName = () => {
  categoryName.value = decodeURIComponent(
    getCategoryPath(getCategoryId.value, ' > '),
  );
};

const fetchPostListByCategory = async (pageNum?: number) => {
  isLoading.value = true;

  postList.length = 0;
  let pageParam = 0;

  if (isNullStr(pageNum)) {
    if (getRouteCategoryPath.value == getCategoryPath(getCategoryId.value)) {
      pageParam = Number(getPageNum.value);
    } else {
      pageParam = 1;
    }
  } else {
    pageParam = pageNum!;
  }
  const { data } = await getPostListByCategory(getCategoryId.value, pageParam);

  // 페이징 정보 세팅
  pageInfo.currentPage = pageParam;
  pageInfo.totalPage = Math.ceil(data.data.totalItems / 10);

  // 카테고리 정보 세팅
  setCategoryInfo({ id: getCategoryId.value, page: pageInfo.currentPage });

  // Post 정보
  if (pageInfo.currentPage == 1) {
    const { data: sHtml } = await getFirstPostListByCategory(
      getCategoryPath(getCategoryId.value),
    );
    // console.log(sHtml);

    // htmlparser
    const dom = htmlparser2.parseDocument(sHtml);
    if (dom != null) {
      const elHtml = _.find(
        dom.children,
        (c: cheerio.Element) => c.type == 'tag',
      );
      // console.log(elHtml);

      if (elHtml != null && elHtml != undefined) {
        // @ts-ignore
        const $ = cheerio.load(elHtml);
        const $listPost = $('ul.list_post').eq(0);
        // @ts-ignore
        // 10개만 가져오기
        $listPost.find('li:lt(10)').each(function (i, elem) {
          const visibility = $(elem)
            .find('span.ico_entry')
            .data('visibility') as string;
          if (visibility != 'PUBLIC') return true;

          const id = $(elem).find('a').attr('href')!.replace('/m/', '');
          const title = $(elem).find('strong.tit_blog').text();
          const comments = $(elem)
            .find('span.link_comment')
            .find('span.txt_btn')
            .text();
          const date = $(elem).find('span.txt_date').text();

          const objPostInfo: PostInfo = {
            id,
            title,
            postUrl: 'https://haguri-peng.tistory.com/',
            visibility,
            categoryId: getCategoryId.value,
            comments,
            trackbacks: '',
            date,
          };
          postList.push(objPostInfo);
        });
      }
    }
  } else {
    for (const post of data.data.items) {
      const objPostInfo: PostInfo = {
        id: post.id.toString(),
        title: post.title,
        postUrl: post.url,
        visibility: post.visibility,
        categoryId: post.categoryId.toString(),
        comments: post.commentCount.toString(),
        trackbacks: '',
        date: post.published,
      };
      postList.push(objPostInfo);
    }
  }

  isLoading.value = false;
};

// const fetchPostByCategory = async (pageNum?: number) => {
//   isLoading.value = true;
//   postList.length = 0;

//   const { data } = await fetchPostListByCategory(
//     route.params.categoryId.toString(),
//     pageNum ||
//       (route.params.categoryId.toString() == getCategoryId.value
//         ? Number(getPageNum.value)
//         : 1),
//   );

//   if (data.tistory.status == '200') {
//     // 페이징 정보 세팅
//     pageInfo.currentPage = Number(data.tistory.item.page);
//     pageInfo.totalPage = Math.ceil(
//       Number(data.tistory.item.totalCount) / Number(data.tistory.item.count),
//     );

//     const posts: PostInfo[] = data.tistory.item.posts;
//     // 발행된 건만
//     postList.push(..._.filter(posts, ['visibility', '20']));

//     // 카테고리 정보 세팅
//     setCategoryInfo({
//       id: route.params.categoryId.toString(),
//       page: pageInfo.currentPage,
//     });

//     // 카테고리 경로(path) 조회
//     const categoryPath = await getCategoryPath(getCategoryId.value);
//     categoryName.value = categoryPath || '';
//   }
//   isLoading.value = false;
// };
// const setCategoryInfo = (categoryInfo: { id: string; page: number }) => {
//   // 카테고리 및 페이지 번호를 store에 세팅
//   setCategory(categoryInfo);
// };

onMounted(() => {
  // fetchPostByCategory();
  setCategoryName();
  fetchPostListByCategory();
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
