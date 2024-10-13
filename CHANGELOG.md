# Changelog

## 2024-10

- 빌드된 파일을 블로그에 자동으로 업로드할 수 있도록 스크립트 반영
- 댓글 모달에서 ESC 키를 누르면 닫히도록 설정. 열릴 때 focus 설정
- Content에서 현재 활성화(active) 중인 aside 영역에 double underline 설정

## 2024-09

- Dark Mode에서 문제가 있었던 부분 해결 (Light/Dark Mode를 지원 X)
- 댓글로 바로 이동할 수 있도록 각 댓글에 id 부여
- Recent Tags 개선 (카테고리명 제외)

## 2024-07

- Vue-Router의 scrollBehavior 적용. 게시물의 위치 감지를 IntersectionObserver를 사용하여 구현.
- highlightjs-line-numbers 적용

## 2024-06

- 이미지 뷰어(PhotoSwipe) 적용
- Component, Type 등 Source Directory 재편성

## 2024-05

- 404 Page 수정
- Vue 3.4에서 안정화된 defineModel 적용. defineEmits 문법 최신화. Aside 영역 세팅하는 부분 개선.
- Add spinner store. Router의 Navigation Guard와 메인(App.vue)에서 LoadingSpinner를 컨트롤.

## 2024-03

- 새벽부터 티스토리 Open API 서비스가 종료됨에 따라 현재 구현해놓은 부분이 원활히 동작하지 않아 수정 작업중입니다. 생각보다 고칠 부분이 많습니다. 😱 기존 페이지들이 정상적으로 동작하게 되면 다시 공지할 예정이며, 그 전까지 계속 소스를 commit 하여 반영할 예정입니다. 현재 블로그는 `기본 스킨`을 적용한 상태.
- 18일 오후부로 이전 theme로 원복하였습니다. 제가 좀 게을러진 탓도 있겠지만 생각보다 공사가 꽤 컸습니다. 기존 기능들은 모두 있으나 최근 게시글의 태그 정보를 가져오는 부분은 현재 작업중입니다.
