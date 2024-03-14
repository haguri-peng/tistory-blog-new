<template>
  <header>
    <!-- 카테고리 -->
    <div class="category">
      <ul class="inline-flex h-full">
        <li>
          <font-awesome-icon
            icon="fa-solid fa-house"
            size="xl"
            title="Home"
            style="cursor: pointer"
            @click="moveHome"
          />
        </li>
        <li @click="moveGuestbook">
          <font-awesome-layers full-width class="fa-xl">
            <font-awesome-icon
              icon="fa-solid fa-book"
              title="GuestBook"
              style="color: royalblue; cursor: pointer"
            />
            <font-awesome-layers-text
              transform="down-12 shrink-8"
              value="GuestBook"
            />
          </font-awesome-layers>
        </li>
        <li
          v-for="category in categoryList"
          :key="category.id"
          :class="{ active: activeCategory == category.id }"
          :data-category-id="category.id"
          @click="clickCategory(category.id, category.path)"
        >
          <span class="menu"> {{ category.name }}</span>
          <span class="font-light"> [{{ category.entryCount }}] </span>
          <span class="newFlag"> {{ showFlag(category.id) }} </span>
        </li>
        <li @click="$emit('showSearchInput')">
          <font-awesome-icon
            icon="fa-solid fa-magnifying-glass"
            beat-fade
            style="--fa-animation-duration: 4s"
          />
        </li>
      </ul>
    </div>
    <div
      class="subCategory"
      :class="{ hide: subCategoryList.length == 0 }"
      @mouseleave="subCategoryOut"
    >
      <ul>
        <li
          v-for="subCategory in subCategoryList"
          @click="clickCategory(subCategory.id, subCategory.path, 'sub')"
        >
          <span class="menu"> {{ subCategory.name }}</span>
          <span class="cnt"> [{{ subCategory.entryCount }}] </span>
          <span class="newFlag"> {{ showFlag(subCategory.id) }} </span>
        </li>
      </ul>
      <div style="margin-top: 10px">
        <font-awesome-icon
          icon="fa-solid fa-caret-up"
          size="2x"
          title="close"
          bounce
          style="cursor: pointer"
          @click="hideSubCategory"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import $ from 'jquery';
import _ from 'lodash';

// import { fetchPostList } from '@/api/index';
import { Category } from '@/types';
// import { getRecentCategories } from '@/utils/utils';
import { useCategoryStore } from '@/store/category';

const emit = defineEmits<{
  (e: 'showSearchInput'): void;
  (e: 'moveCategory', categoryId: string, categoryPath: string): void;
}>();

const props = defineProps<{
  categoryList: Category[];
}>();
const { categoryList } = toRefs(props);
// const getTopCategory = computed(() =>
//   _.filter(categoryList.value, (c) => c.parent == ''),
// );

const router = useRouter();
const moveHome = () => {
  router.push('/');
};
const moveGuestbook = () => {
  router.push('/guestbook');
};

const categoryStore = useCategoryStore();
const { getAllCategories } = storeToRefs(categoryStore);
const { getRecentCategories } = categoryStore;

// const recentCategoryIds: string[] = reactive([]);
// const fetchPost = async (pageNum: number) => {
//   const { data } = await fetchPostList(pageNum);
//   if (data.tistory.status == '200') {
//     // 최근에 올린 글 목록 (10개. 발행된 건만)
//     const recentPosts = _.filter(
//       data.tistory.item.posts,
//       (p) => p.visibility == '20',
//     );
//     recentCategoryIds.push(..._.keys(_.countBy(recentPosts, 'categoryId')));
//   }
// };

const showFlag = (categoryId: string) => {
  let result = '';
  // const fIdx = _.findIndex(recentCategoryIds, (id) => id == categoryId);
  const fIdx = _.findIndex(getRecentCategories(), (c) => c.id == categoryId);
  if (fIdx > -1) {
    result = 'N';
  }
  return result;
};

const activeCategory = ref('');
const subCategoryList: Category[] = reactive([]);
const clickCategory = (
  categoryId: string,
  categoryPath: string,
  subFlag?: string,
) => {
  // Sub Category display CSS 초기화
  $('div.subCategory').css('display', '');

  if (subFlag != 'sub') {
    activeCategory.value = categoryId;
  }

  const curCategory = _.find(getAllCategories.value, (c) => c.id == categoryId);

  subCategoryList.length = 0;
  if (curCategory!.children!.length == 0) {
    emit('moveCategory', categoryId, categoryPath);
  } else {
    subCategoryList.push(...curCategory!.children!);
  }
};

const subCategoryOut = () => {
  hideSubCategory();
};
const hideSubCategory = () => {
  $('div.subCategory').slideUp(400);
};

onMounted(() => {
  // fetchPost(1);
});
</script>

<style scoped>
@keyframes fadeInDown {
  from {
    transform: TranslateY(-30px);
    opacity: 0;
  }
  to {
    transform: TranslateX(0);
    opacity: 1;
  }
}
header {
  position: fixed;
  top: 0;
  width: inherit;
  z-index: 990;
}
div.category {
  /* position: absolute;
  top: 0;
  left: 0; */
  width: 100%;
  height: 60px;
  /* background-color: rgba(152, 251, 152, 0.8); */
  background-color: #d9f8c4;
  border-bottom: 1px solid lightgray;
}
div.category ul li {
  list-style: none;
  font-size: 1.2rem;
  font-weight: 400;
  padding: 0 20px;
  cursor: pointer;
  align-self: center;
  transition: 0.2s;
}
div.category ul li.active {
  color: #76549a;
  font-size: 1.4rem;
  font-weight: 600;
  text-decoration: underline;
}
div.category ul li:hover {
  transform: scale(1.05, 1.05);
  text-decoration: underline;
}
div.category span.newFlag {
  color: #df7861;
  font-weight: 500;
}
div.subCategory {
  position: absolute;
  font-size: 1.1rem;
  top: 0;
  width: 100%;
  padding-top: 60px;
  background-color: rgba(252, 248, 232, 0.88);
  animation-name: fadeInDown;
  animation-duration: 0.7s;
  z-index: 999;
}
div.subCategory li {
  font-size: 1.3rem;
  cursor: pointer;
}
div.subCategory li:hover {
  color: #76549a;
  text-decoration: underline;
}
div.subCategory.hide {
  display: none;
}
div.subCategory div:hover {
  color: #df7861;
}
div.subCategory span.newFlag {
  color: #df7861;
}
</style>
