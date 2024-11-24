# Tistory Blog

🐸 [Haguri & Peng's Blog](https://haguri-peng.tistory.com) 🐧

`Vue3` + `Typescript` + `Vite`을 통해 환경을 구성하였으며, [Ex-Repository](https://github.com/haguri-peng/tistory-blog/) 의 소스를 리팩토링 하였습니다.

## ✐ Changelog

- 2024/11/20 날짜 관련 라이브러리 변경 (Moment.js -> date-fns)
- 2024/11/10 Content에서 현재 활성화(active) 중인 aside 영역에 underline 설정
- 2024/10/11 댓글 모달에서 ESC 키를 누르면 닫히도록 설정. 열릴 때 focus 설정
- 2024/10/3 빌드된 파일을 블로그에 자동으로 업로드할 수 있도록 스크립트 반영

## <img src="./public/vue.svg" width="20px" height="20px"></img> Vue

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
  (댓글/방명록 등록, RecentTag)

## Libraries

- [Axios](https://axios-http.com)
- [htmlparser2](https://github.com/fb55/htmlparser2#readme)
- [cheerio](https://cheerio.js.org/)
- [Lodash](https://lodash.com)
- [tailwindcss](https://tailwindcss.com)
- [date-fns](https://date-fns.org/)

## Color

[Color Hunt](https://colorhunt.co/palette/fcf8e894b49fdf786176549a)  
<img src="./public/color.png" width="300px" height="300px"></img>

## <img src="./public/tistory_icon.svg" width="20px" height="20px"></img> Tistory

`2024/3/5 이후로 Tistory Open API는 서비스 종료!!`

Tistory 에서 제공하는 `Open API` 를 활용 ([Tistory Open API](https://tistory.github.io/document-tistory-apis/)).  
제공해주는 Open API 에 한계가 있어 이를 감안하고 개발하였으니 참고 바랍니다.

모바일 페이지는 Tistory에서 자동으로 제공하며,  
모바일로 접속하는 경우에 모바일 페이지(/m)로 redirect 처리하고 있습니다.

Open API는 2024년 2월까지 순차적으로 서비스가 종료됩니다.  
[서비스 종료 안내 링크](https://notice.tistory.com/2664)

### 공지사항

- Header에 공지사항(Notice) 메뉴 적용

### 카테고리

- 카테고리 Level(1, 2)별 이동 처리
- 카테고리 클릭 시, 하위 카테고리가 있는 경우 하위 카테고리를 보여줌
- 해당 카테고리가 비어(작성글 0개) 있는 경우 노출하지 않음

### 기능구현 목록

- [x] 글 목록 페이징 처리
- [x] 검색 및 검색 페이지 이동
- [x] 댓글 등록
- [ ] 댓글 수정/삭제
- [x] 방명록 등록
- [ ] 방명록 수정/삭제
- [x] 좋아요 설정/해제
- [x] 광고

## 광고

- Google Adsense: 블로그 전반에 적용
- Kakao Adfit: Side 영역 및 포스팅에 한 개씩 적용
- Tenping: 포스팅에 한 개씩 적용

각 게시글에 적용되는 부분은 작성 시에 에디터에서 수동으로 추가하는 부분입니다.

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

## 🏗️ Build & Deploy

`npm run build`

정상적으로 빌드되면, `dist` 폴더에 관련 파일들이 생성되는데, `index.html` 파일과 `/images` 폴더 내에 있는 파일을 모두 스킨에 업로드해야 합니다.

### postbuild

- 빌드 작업 이후에 아래 두 스크립트가 자동으로(package.json의 scripts에 postbuild로 정의) 수행됩니다.
- replace-paths.cjs : 개발 시 내부적으로 사용했던 경로를 실제 블로그 경로로 변경하는 작업
- tistory-skin.cjs : 빌드된 파일을 블로그의 스킨에 업로드

[`replace-paths.cjs`](./scripts/replace-paths.cjs)

*https://tistory4.daumcdn.net/tistory/2876097/skin/*  
/tistory/ 경로 다음에 나오는 숫자 값이 Tistory 블로그마다 가지고 있는 고유 ID 값인 것 같은데요. 이 값은 실제 배포한 다음에 console 창에 error 로 나타나는 값을 확인해야 확인할 수 있습니다.

실제 설정되는 값(예: js 파일)은 다음과 같습니다.  
*https://tistory4.daumcdn.net/tistory/2876097/skin/images/index-[name].js*

[`tistory-skin.cjs`](./scripts//tistory-skin.cjs)

빌드된 파일을 블로그에 업로드 합니다.  
(단, 로그인 할 때마다 TSSESSION 값이 바뀌기 때문에 이 부분은 작업하기 이전에 확인요망)
간혹 '일시적인 문제가 발생하여 오류가 발생'이라면서 업로드가 안 되는데, 다시 빌드 명령어를 내리면 정상적으로 업로드됩니다.
