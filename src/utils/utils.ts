import { type Ref, toRef } from 'vue';

import _ from 'lodash';

import { Category, Comment } from '@/types';

const isMobile = () => {
  const userAgent = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent,
  );
};

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

const handleNewLine = (str: string) => str.replace(/(?:\r\n|\r|\n)/g, '</br>');

const setValue = <T>(obj: T, key: keyof T, value: T[keyof T]) => {
  obj[key] = value;
};

export {
  isMobile,
  isNullStr,
  categoryReduce,
  commentReduce,
  handleNewLine,
  setValue,
};
