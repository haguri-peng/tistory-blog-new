import { type Ref, toRef } from 'vue';
// import { useRouter } from 'vue-router';
// import { storeToRefs } from 'pinia';

import _ from 'lodash';
// import moment from 'moment';

// import { useCategoryStore } from '@/store/category';
import { Category, Comment } from '@/types';

// const categoryStore = useCategoryStore();
// const { getAllCategories } = storeToRefs(categoryStore);

// const router = useRouter();
// const moveContent = (id: number | string) => {
//   router.push(`/${id}`);
// };

const isNullStr = (str: string | number | Ref<string> | undefined) => {
  const orgnMsg = toRef((str || '').toString().trim());
  if (
    orgnMsg.value == null ||
    orgnMsg.value == 'undefined' ||
    orgnMsg.value.length == 0 ||
    typeof orgnMsg.value == 'undefined' ||
    orgnMsg.value == ''
  ) {
    return true;
  } else {
    return false;
  }
};

const categoryReduce = (result: Category[], value: Category): Category[] => {
  const tmpCategory = <Category>{};
  for (const k of Object.keys(value)) {
    const key = k as keyof Category;
    // if (key == 'children') continue;
    setValue<Category>(tmpCategory, key, value[key]);
  }
  result.push(tmpCategory);

  if (value.children.length == 0) {
    return result;
  } else {
    return _.reduce(value.children, categoryReduce, result);
  }
};

const commentReduce = (result: Comment[], value: Comment): Comment[] => {
  const tmpComment = <Comment>{};
  for (const k of Object.keys(value)) {
    const key = k as keyof Comment;
    setValue<Comment>(tmpComment, key, value[key]);
  }
  setValue<Comment>(tmpComment, 'level', findCommentLevel(result, value));
  result.push(tmpComment);

  if (value.children.length == 0) {
    return result;
  } else {
    return _.reduce(value.children, commentReduce, result);
  }
};

const findCommentLevel = (result: Comment[], value: Comment): number => {
  if (value.parent == null) {
    return 1;
  } else {
    const parentComment = _.find(result, ['id', value.parent]);
    if (parentComment == undefined) {
      return 1;
    } else {
      return parentComment.level! + 1;
    }
  }
};

// // id와 path로 검색
// const getCategoryPath = (categoriId: string, separator?: string) => {
//   let result = '';
//   let currentCategory = _.find(getAllCategories.value, ['id', categoriId]);
//   if (currentCategory == undefined) {
//     currentCategory = _.find(getAllCategories.value, ['path', categoriId]);
//   }
//   if (currentCategory != undefined) {
//     if (isNullStr(separator)) {
//       result = currentCategory.path;
//     } else {
//       result = currentCategory.path.replace(/\//g, separator || '/');
//     }
//   }
//   return result;
// };

// const getRecentCategories = () => {
//   const recentCategories = _.filter(getAllCategories.value, (c) => {
//     const now = moment();
//     const updated = moment(c.lastUpdate);
//     // 90일 이전에 업데이트된 카테고리만 가져온다.
//     return now.diff(updated, 'days') <= 90;
//   }) as Category[];
//   return recentCategories;
// };

const handleNewLine = (str: string) => str.replace(/(?:\r\n|\r|\n)/g, '</br>');

const setValue = <T>(obj: T, key: keyof T, value: T[keyof T]) => {
  obj[key] = value;
};

export {
  // moveContent,
  isNullStr,
  categoryReduce,
  commentReduce,
  // getCategoryPath,
  // getRecentCategories,
  handleNewLine,
  setValue,
};
