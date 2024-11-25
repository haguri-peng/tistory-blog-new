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
            @click="moveHome"
          />
        </li>
        <li @click="moveGuestbook">
          <font-awesome-layers full-width class="fa-xl">
            <font-awesome-icon
              icon="fa-solid fa-book"
              title="GuestBook"
              style="color: royalblue"
            />
            <font-awesome-layers-text
              class="calc-deco-guestbook"
              transform="down-12 shrink-8"
              value="GuestBook"
            />
          </font-awesome-layers>
        </li>
        <li @click="moveNotice">
          <font-awesome-layers
            full-width
            class="fa-xl"
            style="color: indianred"
          >
            <font-awesome-icon icon="fa-regular fa-message" title="Notice" />
            <font-awesome-layers-text
              transform="left-0.5 up-0.7 shrink-6"
              :value="notiCnt"
            />
            <font-awesome-layers-text
              class="calc-deco-notice"
              transform="down-12 shrink-8"
              value="Notice"
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
          <span class="menu"> {{ category.name }} </span>
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
      @mouseleave="hideSubCategory"
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
import { ref, reactive, toRefs, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { find, findIndex, chain } from 'lodash-es';

import { Category } from '@/types';
import { getNoticeBaseInfo } from '@/api/posts';
import { useCategoryStore } from '@/store/category';
import { css, slideUp } from '@/utils/utils';

const props = defineProps<{
  categoryList: Category[];
}>();
const { categoryList } = toRefs(props);

const emit = defineEmits<{
  showSearchInput: [];
  moveCategory: [categoryId: string, categoryPath: string];
}>();

const route = useRoute();
const curRoutePath = computed(() => route.path);
const decoGuestbook = computed(() => {
  if (curRoutePath.value.indexOf('guestbook') > -1) {
    return 'underline';
  } else {
    return 'inherit';
  }
});
const decoNotice = computed(() => {
  if (curRoutePath.value.indexOf('notice') > -1) {
    return 'underline';
  } else {
    return 'inherit';
  }
});

const router = useRouter();
const moveHome = () => {
  router.push('/');
};
const moveGuestbook = () => {
  router.push('/guestbook');
};
const moveNotice = () => {
  router.push('/notice');
};

const categoryStore = useCategoryStore();
const { getAllCategories } = storeToRefs(categoryStore);
const { getRecentCategories } = categoryStore;

const showFlag = (categoryId: string) => {
  let result = '';
  const fIdx = findIndex(getRecentCategories(), (c) => c.id == categoryId);
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
  const elSubCategory = document.querySelector(
    'div.subCategory',
  ) as HTMLElement;
  css(elSubCategory, { display: '' });

  if (subFlag != 'sub') {
    activeCategory.value = categoryId;
  }

  const curCategory = find(getAllCategories.value, (c) => c.id == categoryId);

  subCategoryList.length = 0;
  if (curCategory == undefined || curCategory.children.length == 0) {
    emit('moveCategory', categoryId, categoryPath);
  } else {
    const filteredSubCategory = chain(curCategory.children)
      .filter((c) => c.entryCount > 0)
      .value();
    subCategoryList.push(...filteredSubCategory);
  }
};

const hideSubCategory = () => {
  const elSubCategory = document.querySelector(
    'div.subCategory',
  ) as HTMLElement;
  slideUp(elSubCategory, 500);
};

const notiCnt = ref(0);
const fetchNoticeBaseInfo = async () => {
  const { data } = await getNoticeBaseInfo();
  notiCnt.value = data.data.totalItems;
};

onMounted(() => {
  fetchNoticeBaseInfo();
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
  width: 100%;
  height: 60px;
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
span.calc-deco-guestbook {
  text-decoration: v-bind('decoGuestbook');
}
span.calc-deco-notice {
  text-decoration: v-bind('decoNotice');
}
</style>
