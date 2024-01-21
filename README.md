# Tistory Blog

🐸 [Haguri & Peng's Blog](https://haguri-peng.tistory.com) 🐧

`Vue3` + `Typescript` + `Vite`을 통해 환경을 구성하였으며,
[Ex-Repository](https://github.com/haguri-peng/tistory-blog/) 의 소스를 리팩토링 하였습니다.

## Vue

- [Vue3](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)

### Pinia (Vuex -> Pinia)

게시글(post)에서 이전 페이지로 이동 시 페이지 정보와 검색어를 저장하기 위해 사용

```ts
// category.ts
import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';

import { CategoryInfo } from '@/types';

const setValue = <T>(obj: T, key: keyof T, value: T[keyof T]) => {
  obj[key] = value;
};

export const useCategoryStore = defineStore('category', () => {
  const categoryInfo = reactive(<CategoryInfo>{});

  const getCategoryInfo = computed(() => categoryInfo);

  function setCategoryInfo(pCategoryInfo: CategoryInfo) {
    for (const key of Object.keys(pCategoryInfo)) {
      const categoryKey = key as keyof CategoryInfo;
      setValue<CategoryInfo>(
        categoryInfo,
        categoryKey,
        pCategoryInfo[categoryKey],
      );
    }
  }

  function clearCategoryInfo() {
    const initData = <CategoryInfo>{};
    for (const key of Object.keys(categoryInfo)) {
      const categoryKey = key as keyof CategoryInfo;
      setValue<CategoryInfo>(categoryInfo, categoryKey, initData[categoryKey]);
    }
  }

  return { categoryInfo, getCategoryInfo, setCategoryInfo, clearCategoryInfo };
});
```

### Icon

- [Font Awesome](https://fontawesome.com/)

### Modal

- [Gitart Vue Dialog](https://github.com/gitart-group/vue-dialog)
  (댓글 및 방명록 등록 시 Modal 사용)

## Libraries

- [axios](https://axios-http.com)
- [htmlparser2](https://github.com/fb55/htmlparser2#readme)
- [jquery](https://jquery.com)
- [lodash](https://lodash.com)
- [tailwindcss](https://tailwindcss.com)

## Color

[Color Hunt](https://colorhunt.co/palette/fcf8e894b49fdf786176549a)
<img src="./public/color.png" width="300px" height="300px"></img>

## Tistory

Tistory 에서 제공하는 `Open API` 를 활용 ([Tistory Open API](https://tistory.github.io/document-tistory-apis/))
제공해주는 Open API 에 한계가 있어 이를 감안하고 개발하였으니 참고 바랍니다.

모바일 페이지의 URI(/m)에서 REST api로 제공해주는 게 있어서 구현할 수 있는 부분은 최대한 구현하고 있습니다.

참, Open API는 2024년 2월까지 순차적으로 서비스가 종료됩니다.
[서비스 종료 안내 링크](https://notice.tistory.com/2664)

### 댓글

댓글의 수정/삭제 기능을 구현하였으나 Open API 에서 로그인한 사용자의 정보를 알 수 없어(사용자 검증 문제) 실질적으로 사용할 수 없습니다.
(적용 가능한지 재확인중 😅)
로그인한 사용자를 알 수 없기에 댓글 등록 시, 블로그 주소 정보를 입력하고 댓글을 입력해야 등록할 수 있습니다.

### 공지사항 및 방명록

Open API 에서 제공하지 않음.
방명록 작업 완료
공지사항은 확인중..

## ⚙️ Configuration

### Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
