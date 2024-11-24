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

type StandardCSSProperties = {
  [K in keyof CSSStyleDeclaration]?: string | number;
};
interface CustomCSSProperties {
  [key: string]: string | number | undefined;
}
type CSSProperties = StandardCSSProperties & CustomCSSProperties;
const css = (
  element: HTMLElement | NodeListOf<HTMLElement>,
  styles: string | CSSProperties,
): string | void => {
  if (element instanceof HTMLElement) {
    if (typeof styles === 'string') {
      return window.getComputedStyle(element)[styles as any];
    }
    Object.assign(element.style, styles);
  } else {
    // NodeListOf
    // 이 경우에는 styles에 string이 들어오는 경우 빈 값('')만 리턴
    if (typeof styles === 'string') {
      return '';
    }
    element.forEach((el) => {
      Object.assign(el.style, styles);
    });
  }
};

/**
 * 요소를 위로 슬라이드하며 숨기는 애니메이션 함수
 * @param element - 애니메이션을 적용할 HTML 요소
 * @param duration - 애니메이션 지속 시간 (ms)
 * @param easing - 애니메이션 이징 함수
 */
const slideUp = (
  element: HTMLElement,
  duration: number = 300,
  easing: string = 'ease-in-out',
): void => {
  // 현재 요소의 높이 저장
  const height = element.offsetHeight;

  // 트랜지션 설정
  element.style.transition = `height ${duration}ms ${easing}, 
                              padding ${duration}ms ${easing}, 
                              margin ${duration}ms ${easing}`;
  element.style.height = `${height}px`;

  // 다음 프레임에서 높이를 0으로
  requestAnimationFrame(() => {
    element.style.height = '0';
    element.style.paddingTop = '0';
    element.style.paddingBottom = '0';
    element.style.marginTop = '0';
    element.style.marginBottom = '0';
    element.style.overflow = 'hidden';
  });

  // 애니메이션 완료 후 요소 숨김
  setTimeout(() => {
    element.style.display = 'none';
    element.style.height = 'auto';
    element.style.padding = 'auto';
    element.style.paddingTop = '60px';
    element.style.margin = 'auto';
    element.style.overflow = '';
  }, duration);
};

const toggle = (element: HTMLElement) => {
  if (element.style.display === 'none') {
    element.style.display = '';
  } else {
    element.style.display = 'none';
  }
};

export {
  isMobile,
  isNullStr,
  categoryReduce,
  commentReduce,
  handleNewLine,
  setValue,
  css,
  slideUp,
  toggle,
};
