<template>
  <!-- Left -->
  <div class="nav">
    <div class="category">
      [Category]
      <div class="category-name" @click="moveCategory">
        {{ categoryName }}
      </div>
    </div>

    <!-- AdFit tistory sidebar 광고 -->
    <div class="absolute bottom-0 right-0">
      <ins
        class="kakao_ad_area"
        data-ad-unit="DAN-pm2qlQF9u7DdI0BL"
        data-ad-width="160"
        data-ad-height="600"
      ></ins>
    </div>
  </div>

  <!-- Right -->
  <div class="aside">
    <div class="text-left">
      <ul class="list-none pl-2" style="border-left: 2px solid #df7861">
        <li v-for="heading in headings" :key="heading.id">
          <a
            :data-url="`#${heading.id}`"
            :class="{
              active: activeHeading !== '' && activeHeading === heading.id,
            }"
            @click.prevent="scrollToSection"
          >
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </div>
    <div class="image absolute bottom-0 left-0">
      <!-- Coupang Dynamic Banner -->
      <!-- <iframe
        src="https://ads-partners.coupang.com/widgets.html?id=639317&template=carousel&trackingCode=AF6597674&subId=&width=250&height=250"
        width="250"
        height="250"
        frameborder="0"
        scrolling="no"
        referrerpolicy="unsafe-url"
        style="margin-top: 50px; float: left"
      ></iframe> -->
      <ins
        class="kakao_ad_area"
        data-ad-unit="DAN-rNHsJ1xGbg4tjBAa"
        data-ad-width="250"
        data-ad-height="250"
      ></ins>
    </div>
    <div class="recentTagData" @click="openRecentTagModal">
      <div class="recentTagsTitle">
        Recent Tags <font-awesome-icon icon="fa-solid fa-tags" />
      </div>
    </div>
  </div>

  <div class="content">
    <div class="title">
      <h1>{{ getUnescapedTitle }}</h1>
      <p class="date">작성일시: {{ date }}</p>
    </div>

    <!-- adsense_display -->
    <ins
      class="adsbygoogle"
      style="display: inline-block; width: 728px; height: 90px"
      data-ad-client="ca-pub-6187932165258053"
      data-ad-slot="2842718663"
    ></ins>

    <AppContentMain v-model:content="content" />

    <!-- adsense_multiflex -->
    <ins
      class="adsbygoogle"
      style="display: inline-block; width: 728px; height: 400px"
      data-ad-client="ca-pub-6187932165258053"
      data-ad-slot="2087795028"
    ></ins>

    <!-- 관련 Post -->
    <AppRelatedPost :postType="'related'" @moveContent="moveContent" />

    <!-- 인기 Post -->
    <AppRelatedPost :postType="'popular'" @moveContent="moveContent" />

    <!-- Tags -->
    <div class="tags">
      Tags
      <font-awesome-icon icon="fa-solid fa-tags" class="mr-5" />
      <span
        class="tag"
        v-for="(tag, index) in tags"
        :key="index"
        @click="searchTag(tag)"
      >
        #{{ tag }}
      </span>
    </div>

    <!-- 댓글 -->
    <div class="comments">
      <p>
        {{ comments.length }} Comments
        <font-awesome-icon icon="fa-solid fa-comments" />
        <button type="button" class="float-right" @click="addComment">
          <font-awesome-icon icon="fa-solid fa-pen" title="댓글 등록" />
          등록
        </button>
      </p>
      <div
        v-for="comment in comments"
        :key="comment.id"
        :id="`comment${comment.id}`"
      >
        <div class="name">
          <!-- @vue-expect-error -->
          <div
            class="left"
            :class="{
              noAuth: comment.writer.id != $parent.$parent.loginId,
            }"
          >
            <span
              v-for="n in (comment.level == 1
                ? comment.level + 1
                : comment.level!) - 2"
              :key="n"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span v-if="comment.level! > 1">└─</span>
            <font-awesome-icon
              icon="fa-solid fa-house-user"
              :title="comment.writer.name"
              style="cursor: pointer; margin-right: 5px"
              @click="openCommenterPage(comment.writer.homepage)"
            />
            <span>{{ comment.writer.name }}</span>
            <span class="ml-8 text-xs"> {{ comment.written }} </span>
          </div>

          <!-- @vue-expect-error -->
          <div
            class="comment-mod-del"
            style="float: right; width: 5%"
            :class="{
              noAuth: comment.writer.id != $parent.$parent.loginId,
            }"
            @mouseleave="commentModDelOut($event)"
          >
            <font-awesome-icon
              icon="fa-solid fa-ellipsis"
              style="cursor: pointer"
              @click="toggleCommentModDelBtn($event.target)"
            />
            <ul style="list-style: none; display: none">
              <li
                @click="
                  modComment(
                    comment.id.toString(),
                    comment.parent.toString(),
                    comment.content,
                  )
                "
              >
                수정
              </li>
              <li
                @click="
                  delComment(comment.id.toString(), comment.writer.homepage)
                "
              >
                삭제
              </li>
            </ul>
          </div>
        </div>
        <div class="comment" v-if="comment.isSecret">
          <font-awesome-icon icon="fa-solid fa-lock" />
          비밀댓글입니다.
        </div>
        <div
          class="comment"
          v-else
          v-html="handleNewLine(comment.content)"
        ></div>
      </div>
    </div>

    <!-- Icons -->
    <div class="top-down" v-show="isContent">
      <!-- Top icon -->
      <div @click="gotoTop" class="mb-5">
        <font-awesome-icon
          icon="fa-solid fa-circle-up"
          size="xl"
          title="top"
          bounce
          style="cursor: pointer"
        />
      </div>
      <!-- Reaction icon -->
      <div class="mt-3">
        <font-awesome-layers full-width class="fa-xl">
          <font-awesome-icon
            v-if="isReactionCheck"
            icon="fa-solid fa-heart"
            style="
              color: orangered;
              cursor: pointer;
              --fa-animation-duration: 2s;
            "
            shake
            @click="toggleReaction"
          />
          <font-awesome-icon
            v-else
            icon="fa-regular fa-heart"
            style="
              color: orangered;
              cursor: pointer;
              --fa-animation-duration: 2s;
            "
            shake
            @click="toggleReaction"
          />
          <font-awesome-layers-text
            counter
            :value="reactionCount"
            position="bottom-right"
            style="margin-right: -15px; font-size: 3rem"
          />
        </font-awesome-layers>
      </div>
      <!-- Comment icon -->
      <div @click="gotoComments" class="mt-3">
        <font-awesome-layers full-width class="fa-xl">
          <font-awesome-icon
            icon="fa-solid fa-comment"
            title="comments"
            flip
            style="cursor: pointer; --fa-animation-duration: 3s"
          />
          <font-awesome-layers-text
            counter
            :value="comments.length"
            position="bottom-right"
            style="margin-right: -15px; font-size: 3rem"
          />
        </font-awesome-layers>
      </div>
    </div>

    <!-- Comment Modal -->
    <AppComment :showModal @closeModal="hideModal" />

    <!-- RecentTagModal -->
    <RecentTagModal :showRecentTag @closeTagModal="closeTagModal" />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { unescape, find, reduce, delay } from 'lodash-es';
import * as htmlparser2 from 'htmlparser2';
import * as cheerio from 'cheerio';
import axios, { AxiosResponse } from 'axios';

import AppContentMain from '@/components/content/AppContentMain.vue';
import AppComment from '@/components/content/AppComment.vue';
import AppRelatedPost from '@/components/content/AppRelatedPost.vue';
import RecentTagModal from '@/components/content/RecentTagModal.vue';

import { deleteComment } from '@/api/index';
import {
  getPostInfo,
  searchReaction,
  postReaction,
  deleteReaction,
  getCommentsInPost,
  postComment,
  getConfigViewerInPost,
} from '@/api/posts';
import { Comment, CommentInput, CommentPost, HeadingTagInfo } from '@/types';
import { useCategoryStore } from '@/store/category';
import { useCommentStore } from '@/store/comment';
import { isNullStr, commentReduce, handleNewLine, toggle } from '@/utils/utils';

const route = useRoute();
const router = useRouter();
const moveContent = (id: number | string) => {
  router.push(`/${id}`);
};
const moveCategory = () => {
  setCategoryInfo({ id: categoryId.value, page: 1 });
  router.push(`/category/${getCategoryPath(categoryId.value)}`);
};
const searchTag = async (tag: string) => {
  router.push(`/search/tags/${tag}`);
};

// commentStore
const commentStore = useCommentStore();
const { setCommentInfo } = commentStore;

// categoryStore
const categoryStore = useCategoryStore();
const { getAllCategories } = storeToRefs(categoryStore);
const { getCategoryPath, setCategoryInfo } = categoryStore;

const content = ref('');
const isContent = computed(() => (isNullStr(content) ? false : true));

const title = ref('');
const getUnescapedTitle = computed(() => unescape(title.value));

const categoryId = ref('');
const categoryName = ref('');
const setCategoryId = (id: string) => {
  categoryId.value = id;
};
const setCategoryName = () => {
  categoryName.value = decodeURIComponent(
    getCategoryPath(categoryId.value, ' > '),
  );
};

const postId = ref('');
let tags: string[] = [];
const date = ref('');
const acceptComment = ref(false);

const getContent = async () => {
  postId.value = route.params.id.toString();
  const { data: sHtml } = await getPostInfo(postId.value);

  // htmlparser
  const dom = htmlparser2.parseDocument(sHtml);
  if (dom != null) {
    const elHtml = find(
      dom.children,
      (c: cheerio.Element) => c.type == 'tag',
    ) as cheerio.AnyNode;

    const $$ = cheerio.load(elHtml);
    const $$main = $$('main.doc-main');
    const $$mainContent = $$('#mainContent');

    // Title
    const titleEl = $$mainContent.find('.tit_blogview');
    title.value = titleEl.text();

    // Date
    const dateEl = $$mainContent.find('span.txt_date');
    date.value = dateEl.text();

    // Category
    const categoryEl = $$mainContent.find('a.txt_category');
    const arrCategoryPath = categoryEl.text().split('/');
    let categoryPath = '';
    for (const categoryNm of arrCategoryPath) {
      if (!isNullStr(categoryPath)) {
        categoryPath += '/';
      }
      // 카테고리에서 사용하는 특수문자 (,),! 별도 치환
      categoryPath += encodeURIComponent(categoryNm)
        .replace(/!/g, '%21')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29');
    }

    const curCategory = find(
      getAllCategories.value,
      (c) => c.path == categoryPath,
    );
    if (curCategory != undefined) {
      setCategoryId(curCategory.id);
      setCategoryName();
    }

    // Content
    const contentEl = $$mainContent.find('div.blogview_content');
    content.value = contentEl.html() as string;

    // Tags
    const tagEl = $$main.find('div.list_tag');
    tagEl.find('a').each(function () {
      tags.push($$(this).text());
    });

    // reaction 가져오기
    getReaction();

    // config, viewer 정보 확인
    const { data: configViewer } = await getConfigViewerInPost(postId.value);
    if (configViewer.data != null) {
      acceptComment.value = configViewer.data.config.allowComment;
    }
  }
};

const comments: Comment[] = reactive([]);
const getComments = async () => {
  comments.length = 0;

  const { data } = await getCommentsInPost(postId.value);
  if (data.data.totalItems > 0) {
    comments.push(...reduce(data.data.items, commentReduce, []));
  }
};
const showModal = ref(false);
const addComment = () => {
  // @ts-ignore
  const { user } = window.initData;
  if (user == null || user == undefined) {
    alert('로그인이 필요합니다.');
    return;
  }

  if (!acceptComment.value) {
    alert('댓글이 허용되지 않는 글입니다.');
    return;
  }

  showModal.value = true;
};
const hideModal = async (action: string, objData?: CommentPost) => {
  showModal.value = false;

  // 댓글 등록 및 수정
  if (action == 'submit') {
    try {
      // 등록
      const { data } = await postComment(postId.value, objData!);
      if (data.data.id != null) {
        alert('댓글이 등록되었습니다.');
        getComments();
      } else {
        alert('댓글 등록이 실패하였습니다.');
      }
    } catch (err) {
      if (axios.isAxiosError<AxiosResponse>(err)) {
        alert(err.message);
      }
    }
  }
};
const modComment = (
  commentId: string,
  parentCommentId: string,
  comment: string,
) => {
  // 댓글 부분 세팅
  const commentInfo = {
    parentCommentId,
    commentId,
    comment,
  };

  setCommentInfo(commentInfo);
  showModal.value = true;
};
const delComment = async (commentId: string, homepage: string) => {
  if (confirm('댓글을 삭제하시겠습니까?')) {
    const objData: CommentInput = {
      blogName: homepage.split('//')[1].split('.')[0],
      postId: postId.value,
      commentId,
    };

    try {
      const { data } = await deleteComment(objData);
      if (data.tistory.status == '200') {
        alert('댓글이 삭제되었습니다.');

        getComments();
      } else {
        console.error(data.tistory.result);
      }
    } catch (err) {
      if (axios.isAxiosError<AxiosResponse>(err)) {
        alert(err.message);
      }
    }
  }
};

const showRecentTag = ref(false);
const openRecentTagModal = () => {
  showRecentTag.value = true;
};
const closeTagModal = () => {
  showRecentTag.value = false;
};

const activeHeading = ref('');
const headings: HeadingTagInfo[] = reactive([]);
let currentObserver: IntersectionObserver;
// aside 영역 세팅
const setAsideSection = async () => {
  await nextTick();

  currentObserver = setupObserver();

  Array.from(document.querySelectorAll('div')).map((div: Element) => {
    // 블로그 작성 글에서 'haguri'란 클래스를 확인
    // 다음 형태로 글이 작성되어야 Aside 영역에 제대로 적용됩니다.
    // <div id="title_1" class="haguri"> ... </div>
    if (div.className == 'haguri') {
      headings.push({
        id: div.id,
        text: div.querySelector('h2, h3, h4')?.textContent || '',
      });
      currentObserver.observe(div);
    }
  });
};
function setupObserver() {
  const headerHeight = 80;
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  const options = {
    root: null, // viewport 기준
    rootMargin: `-${headerHeight + 10}px 0px -${viewportHeight - headerHeight}px 0px`,
    threshold: [0, 1], // 조금이라도 보이거나 다 안 보일 때 콜백 실행
  };

  const observer = new IntersectionObserver((entries) => {
    activeHeading.value = '';
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeHeading.value = entry.target.id;
      }
    });
  }, options);

  return observer;
}
function scrollToSection(evt: MouseEvent) {
  const el = evt.target as HTMLElement;
  const targetId = el.getAttribute('data-url') || '';
  router.push({ hash: targetId });
}

const reactionCount = ref(0);
const isReactionCheck = ref(false);
const getReaction = () => {
  if (!isNullStr(postId.value)) {
    searchReaction(postId.value).then(({ data }) => {
      reactionCount.value = data.data.count;
      isReactionCheck.value = data.data.isCheck;
    });
  }
};
const toggleReaction = () => {
  if (isReactionCheck.value) {
    deleteReaction(postId.value).then(getReaction);
  } else {
    postReaction(postId.value).then(getReaction);
  }
};

const gotoTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
};
const gotoComments = () => {
  const commentsEl = document.querySelector('div.comments') as HTMLElement;
  // commentsEl.scrollIntoView({ behavior: 'smooth' });
  const calcTop = commentsEl.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: calcTop, behavior: 'smooth' });
};
const openCommenterPage = (url: string | undefined) => {
  if (!isNullStr(url)) {
    window.open(url, '_blank');
  }
};
const toggleCommentModDelBtn = (el: HTMLElement) => {
  const elUl = el.parentElement?.querySelector('ul');
  if (elUl) {
    toggle(elUl);
  }
};
const commentModDelOut = (evt: MouseEvent) => {
  const el = evt.target as HTMLElement;
  if (el) {
    const elUl = el.parentElement?.querySelector('ul');
    if (elUl) {
      elUl.style.display = 'none';
    }
  }
};

const setAdsense = () => {
  // @ts-ignore
  (adsbygoogle = window.adsbygoogle || []).push({});
};
onMounted(() => {
  // Adsense
  setAdsense();
  delay(setAdsense, 100);

  getContent();
  getComments();
});
onUnmounted(() => {
  currentObserver.disconnect();
});
watch(content, () => {
  setAsideSection();
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    transform: TranslateY(30px);
    opacity: 0;
  }
  to {
    transform: TranslateX(0);
    opacity: 1;
  }
}
div.content {
  position: absolute;
  margin-top: 30px;
  padding: 10px;
  top: 60px;
  width: 65%;
  animation-name: fadeInUp;
  animation-duration: 1.1s;
}
div.top-down {
  position: sticky;
  float: right;
  bottom: 15px;
  margin-right: 6%;
  z-index: 110;
}
div.title {
  margin-bottom: 59px;
}
div.title h1 {
  font-size: 2rem;
  color: #df7861;
}
div.title p.date {
  color: #76549a;
  font-size: 0.9rem;
}
div.tags {
  color: #76549a;
  margin-top: 50px;
  padding: 0 50px;
}
div.tags span.tag {
  margin-right: 5px;
}
div.tags span.tag:hover {
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
}
div.comments {
  margin-top: 59px;
  width: 80%;
  color: darkslategray;
}
div.comments p {
  text-align: left;
  border-bottom: 3px solid #76549a;
  padding-bottom: 4px;
}
div.comments > div {
  padding: 15px;
  border-bottom: 1px solid #76549a;
}
div.comments > div > div.name {
  /* display: flex; */
  display: contents;
  align-items: center;
  margin-bottom: 5px;
  padding-left: 40px;
}
div.comments > div > div.name > div.left {
  float: left;
  width: 95%;
  text-align: initial;
}
div.comments > div > div.name > div.left.noAuth {
  width: 100%;
}
div.comment-mod-del.noAuth {
  display: none;
}
div.comment-mod-del svg:hover {
  color: #76549a;
}
div.comment-mod-del li {
  font-size: 0.8rem;
}
div.comment-mod-del li:hover {
  font-size: 0.8rem;
  font-weight: bold;
  color: #76549a;
  cursor: pointer;
}
div.comments > div > div.comment {
  text-align: left;
  padding-left: 80px;
}
div.nav {
  position: fixed;
  left: 0;
  top: 150px;
  bottom: 0;
  width: 20%;
  text-align: right;
  z-index: 100;
}
div.nav div.category {
  color: #76549a;
  font-size: 1rem;
  font-weight: bold;
}
div.nav div.category div.category-name {
  margin: 5px 0;
}
div.nav div.category div.category-name:hover {
  text-decoration: underline;
  cursor: pointer;
}
div.aside {
  position: fixed;
  right: 0;
  top: 150px;
  bottom: 0;
  width: 20%;
  z-index: 100;
  display: inline-grid;
}
div.aside a {
  font-size: 1rem;
  transition: font-size 0.3s ease;
  cursor: pointer;
}
div.aside a.active {
  color: #76549a;
  font-size: 1.05rem;
  text-decoration: underline;
}
div.aside div.recentTagData {
  /* margin-top: 50px;
  width: 90%; */
  text-align: left;
  font-size: 0.8rem;
  bottom: 270px;
  position: absolute;
}
div.aside div.recentTagData:hover {
  cursor: pointer;
  background-color: burlywood;
}
div.aside div.recentTagData span:hover {
  text-decoration: underline;
  font-weight: bold;
  cursor: pointer;
}
div.aside div.recentTagData div.recentTagsTitle {
  color: #df7861;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: underline;
}
button {
  pointer-events: all;
  padding: 2px 5px;
  cursor: pointer;
  background-color: rgba(118, 84, 154, 0.11);
  border-radius: 3px;
}
button:hover {
  background-color: rgba(118, 84, 154, 0.66);
}
</style>
