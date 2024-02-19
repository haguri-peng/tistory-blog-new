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
    <div class="text-left" style="border-left: 2px solid #df7861">
      <ul class="list-none pl-2"></ul>
    </div>
    <div class="image">
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
        style="margin-top: 50px; float: left"
      ></ins>
    </div>
    <div class="recentTagData">
      <div class="recentTagsTitle">
        Recent Tags <font-awesome-icon icon="fa-solid fa-tags" />
      </div>
      <div class="mt-1">
        <span v-for="(tag, idx) in recentTagData" :key="idx">
          <button
            type="button"
            class="font-bold border-none mr-1"
            @click="searchTag(tag)"
          >
            #{{ tag }}
          </button>
        </span>
      </div>
    </div>
  </div>

  <div class="content" ref="contents">
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

    <AppContentMain
      :content="content"
      @refreshAside="setAsideSection"
      @refreshAppHeight="setHeight"
    />

    <!-- adsense_multiflex -->
    <ins
      class="adsbygoogle"
      style="display: block"
      data-ad-format="autorelaxed"
      data-ad-client="ca-pub-6187932165258053"
      data-ad-slot="2087795028"
    ></ins>

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
        :class="{ hide: comment.open == 'N' }"
      >
        <div class="name">
          <!-- @vue-ignore -->
          <div
            class="left"
            :class="{
              noAuth: comment.homepage != $parent.$parent.loginId,
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
              :title="comment.name"
              style="cursor: pointer; margin-right: 5px"
              @click="openCommenterPage(comment.homepage)"
            />
            <span>{{ comment.name }}</span>
            <span class="ml-8 text-xs"> {{ comment.date }} </span>
          </div>
          <!-- @vue-ignore -->
          <div
            class="comment-mod-del"
            style="float: right; width: 5%"
            :class="{
              noAuth: comment.homepage != $parent.$parent.loginId,
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
                  modComment(comment.id!, comment.parentId!, comment.comment!)
                "
              >
                수정
              </li>
              <li @click="delComment(comment.id!, comment.homepage!)">삭제</li>
            </ul>
          </div>
        </div>
        <div class="comment" v-if="comment.visibility == '0'">
          승인 대기중인 댓글입니다.
        </div>
        <div
          class="comment"
          v-else
          v-html="handleNewLine(comment.comment)"
        ></div>
      </div>
    </div>

    <div class="top-down" v-show="isContent">
      <div @click="gotoTop">
        <font-awesome-icon
          icon="fa-solid fa-circle-up"
          size="xl"
          title="top"
          bounce
          style="cursor: pointer"
        />
      </div>
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

    <!-- Modal -->
    <AppComment :showModal="showModal" @closeModal="hideModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import $ from 'jquery';
import _ from 'lodash';
import axios, { AxiosResponse } from 'axios';

import AppContentMain from '@/components/AppContentMain.vue';
import AppComment from '@/components/AppComment.vue';

import {
  fetchPostList,
  fetchPost,
  fetchComments,
  insertComment,
  modifyComment,
  deleteComment,
} from '@/api/index';
import { searchReaction, postReaction, deleteReaction } from '@/api/posts';
import { PostInfo, Comment, CommentInput } from '@/types';
import { useCommentStore } from '@/store/comment';
import { isNullStr, getCategoryPath, handleNewLine } from '@/utils/utils';

const route = useRoute();
const router = useRouter();
const moveCategory = () => {
  router.push(`/category/${categoryId.value}`);
};
const searchTag = async (tag: string) => {
  router.push(`/search/tags/${tag}`);
};

const commentStore = useCommentStore();
const { setCommentInfo } = commentStore;

const content = ref('');
const isContent = computed(() => (isNullStr(content) ? false : true));

const title = ref('');
const getUnescapedTitle = computed(() => _.unescape(title.value));

const postId = ref('');
const categoryId = ref('');
const categoryName = ref('');
const tags: string[] = reactive([]);
const date = ref('');
const acceptComment = ref(false);
const getContent = async () => {
  const { data } = await fetchPost(route.params.id.toString());
  if (data.tistory.status == '200') {
    postId.value = route.params.id.toString();
    categoryId.value = data.tistory.item.categoryId;
    title.value = data.tistory.item.title;
    content.value = data.tistory.item.content;
    tags.push(...data.tistory.item.tags.tag);
    date.value = data.tistory.item.date;
    acceptComment.value = data.tistory.item.acceptComment == '1' ? true : false; // 댓글 허용 여부(허용: 1, 비허용: 0)

    // 카테고리 경로(path) 조회
    const categoryPath = await getCategoryPath(categoryId.value);
    categoryName.value = categoryPath || '';

    // 최근글 5개에서 태그 정보를 가져온다.
    getTagList();

    // aside 영역 세팅
    // content 부분을 세팅하는 딜레이가 있어서 적정한 timeout을 줘서 처리(0.5초)
    setAsideSection();

    // reaction 가져오기
    getReaction();

    // 스크롤 Event 설정
    // 스크롤 위치에 따라 어느 영역에 있는지 확인하여 색상을 변경
    $(window).scroll(function () {
      const top = $(window).scrollTop();
      // console.log('top >> ' + top);

      let bFind = false;
      $('div.aside ul li').each(function () {
        if (
          !bFind &&
          parseInt($(this).data('offsetTop')) <= top! + 92 &&
          ($(this).next().length > 0
            ? parseInt($(this).next().data('offsetTop'))
            : top! + 92) >=
            top! + 92!
        ) {
          $(this).css('color', '#df7861');
          bFind = true;
        } else {
          $(this).css('color', '');
        }
      });
    });
  }
};

const comments: Comment[] = reactive([]);
const getComments = async () => {
  comments.length = 0;

  const { data } = await fetchComments(route.params.id.toString());
  if (data.tistory.status == '200') {
    if (
      data.tistory.item.comments != null &&
      data.tistory.item.comments.length > 0
    ) {
      const treeSortComments: Comment[] = _.sortBy(data.tistory.item.comments, [
        function (comment) {
          function getParentDate(comment: Comment) {
            if (comment.parentId == '') {
              comment.level = 1;
              return comment.date;
            } else {
              const parent = _.find(data.tistory.item.comments, [
                'id',
                comment.parentId,
              ]);
              comment.level = parent!.level! + 1;
              return getParentDate(parent!);
            }
          }
          return getParentDate(comment);
        },
        'date',
      ]);

      comments.push(...treeSortComments);
    }
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
const hideModal = async (action: string, objData?: CommentInput) => {
  showModal.value = false;

  // 댓글 등록 및 수정
  if (action == 'submit') {
    objData!.postId = postId.value;

    try {
      if (!isNullStr(objData!.commentId)) {
        // 수정
        const { data } = await modifyComment(objData!);
        if (data.tistory.status == '200') {
          alert('댓글이 수정되었습니다.');
          getComments();
        } else {
          alert(data.tistory.result);
        }
      } else {
        // 등록
        const { data } = await insertComment(objData!);
        if (data.tistory.status == '200') {
          alert('댓글이 등록되었습니다.');

          getComments();
          setHeight();
        } else {
          alert(data.tistory.result);
        }
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
        setHeight();
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

const recentTagData: string[] = reactive([]);
const getTagList = async () => {
  const { data } = await fetchPostList();
  if (data.tistory.status == '200') {
    // 최근글 5개만
    const postList: PostInfo[] = _.take(data.tistory.item.posts, 5);

    let tagList: string[] = [];
    for (const post of postList) {
      const { data } = await fetchPost(post.id);
      if (data.tistory.status == '200') {
        tagList = _.flatten([
          ...tagList,
          ...(data.tistory.item.tags.tag || []),
        ]);
      }
    }

    tagList = _.uniq(tagList);
    recentTagData.push(...tagList);
  }
};

const contents = ref<HTMLDivElement>();
const setHeight = (delay = 1000) => {
  setTimeout(setAppHeight, delay);
};
const setAppHeight = () => {
  const headerHeight = 60;
  const contentTopMargin = 30;
  const contentInnerPadding = 20;

  $('#app').css(
    'height',
    contents!.value!.clientHeight +
      headerHeight +
      contentTopMargin +
      contentInnerPadding +
      'px',
  );
};
const setAsideSection = () => {
  $('div.aside ul li').remove();
  $('div.aside').hide();

  setTimeout(() => {
    let sAsideHtml = '';

    $('div.content')
      .find('h2,h3,h4')
      .each(function (_idx, item) {
        const tagName = item.tagName.toLowerCase();
        sAsideHtml +=
          '<li class="' +
          tagName +
          '" style="font-size: 1rem' +
          ' margin: 2px 0">' +
          $(this).text() +
          '</li>';
      });
    // $('div.aside ul').append(sAsideHtml);
    $('div.aside ul').html(sAsideHtml);
    $('div.aside ul li')
      .hover(
        // hover
        function () {
          $(this).css('text-decoration', 'underline').css('cursor', 'pointer');
        },
        function () {
          $(this).css('text-decoration', '').css('cursor', '');
        },
      )
      .click(function () {
        // 클릭 시 해당 영역으로 스크롤 이동
        const asideTag = $(this).attr('class') as string;
        const asideText = $(this).text();

        const clickEl = $('div.content')
          .find(asideTag)
          .filter(function () {
            return $(this).text() == asideText;
          });

        if (clickEl.length > 0) {
          const eleTop = clickEl[0].offsetTop;
          // clickEl[0].scrollIntoView({ behavior: 'smooth' });
          window.scrollTo({
            top: eleTop,
            behavior: 'smooth',
          });
        }
      })
      .each(function () {
        const asideTag = $(this).attr('class') as string;
        const asideText = $(this).text();

        const el = $('div.content')
          .find(asideTag)
          .filter(function () {
            return $(this).text() == asideText;
          });

        if (el.length > 0) {
          const headerHeight = 60;
          const contentTopMargin = 30;

          $(this).attr(
            'data-offset-top',
            el[0].offsetTop + headerHeight + contentTopMargin,
          );
        }
      });
    $('div.aside').fadeIn();
  }, 500);
};

const reactionCount = ref(0);
const isReactionCheck = ref(false);
const getReaction = () => {
  if (postId.value != '') {
    searchReaction(postId.value).then(({ data }) => {
      if (data.code == 200) {
        reactionCount.value = data.result.count;
        isReactionCheck.value = data.result.isCheck;
      }
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
  commentsEl.scrollIntoView({ behavior: 'smooth' });
};
const openCommenterPage = (url: string | undefined) => {
  if (!isNullStr(url)) {
    window.open(url, '_blank');
  }
};
const toggleCommentModDelBtn = (el: HTMLElement) => {
  $(el).parent().find('ul').toggle();
};
const commentModDelOut = (evt: MouseEvent) => {
  const el = evt.target as HTMLElement;
  $(el).parent().find('ul').hide();
};

const intervalId = ref<number | NodeJS.Timeout>(0);
const setAdsense = () => {
  // @ts-ignore
  (adsbygoogle = window.adsbygoogle || []).push({});
};
onMounted(() => {
  // Adsense
  setAdsense();
  _.delay(setAdsense, 100);

  getContent();
  getComments();

  intervalId.value = setInterval(setAppHeight, 100);

  setTimeout(() => {
    clearInterval(intervalId.value);
  }, 10000);
});
onUnmounted(() => {
  $('#app').css('height', 'auto');
  clearInterval(intervalId.value);
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
  /* background-color: rgba(144, 200, 172, 0.3); */
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
  margin-top: 20px;
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
div.comments > div.hide {
  display: none;
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
  top: 100px;
  width: 20%;
  z-index: 100;
  display: inline-grid;
}
div.aside div.recentTagData {
  margin-top: 50px;
  width: 90%;
  text-align: left;
  font-size: 0.8rem;
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
