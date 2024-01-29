import axios from 'axios';
import { CommentInput } from '@/types';
import {
  BlogInfoRes,
  CategoryRes,
  PostRes,
  PostLstRes,
  CommentsRes,
  ProcessCommentRes,
} from '@/api/axiosResTypes';

// axios 초기화
function createInstance() {
  return axios.create({
    baseURL: 'https://www.tistory.com/apis',
  });
}

const instance = createInstance();
const params = {
  accessToken:
    '02768df77149fadd44aa4a8236daea50_29e2bb88b91e72ee39d8c93198beb93d',
  blogName: 'https://haguri-peng.tistory.com',
  outputType: 'json',
};

// 블로그 정보
function fetchBlogInfo(): BlogInfoRes {
  const queryString =
    'access_token=' + params.accessToken + '&output=' + params.outputType;
  return instance.get(`/blog/info?${queryString}`);
}

// 카테고리 목록
function fetchCategoryList(): CategoryRes {
  const queryString =
    'access_token=' +
    params.accessToken +
    '&output=' +
    params.outputType +
    '&blogName=' +
    params.blogName;
  return instance.get(`/category/list?${queryString}`);
}

// 글 목록
function fetchPostList(pageNum?: number): PostLstRes {
  const queryString =
    'access_token=' +
    params.accessToken +
    '&output=' +
    params.outputType +
    '&blogName=' +
    params.blogName +
    '&page=' +
    (pageNum || 1);
  return instance.get(`/post/list?${queryString}`);
}

// 카테고리별 글 목록
function fetchPostListByCategory(
  categoryId: string,
  pageNum: number,
): PostLstRes {
  const queryString =
    'access_token=' +
    params.accessToken +
    '&output=' +
    params.outputType +
    '&blogName=' +
    params.blogName +
    '&page=' +
    (pageNum || 1);
  return instance.get(`/post/list?${queryString}`, {
    params: {
      categoryId,
      // visibility: '20', // 발행된 건만
    },
  });
}

// 글 읽기
function fetchPost(postId: string): PostRes {
  const queryString =
    'access_token=' +
    params.accessToken +
    '&output=' +
    params.outputType +
    '&blogName=' +
    params.blogName +
    '&postId=' +
    postId;
  return instance.get(`/post/read?${queryString}`);
}

// 게시글 댓글 목록
function fetchComments(postId: string): CommentsRes {
  const queryString =
    'access_token=' +
    params.accessToken +
    '&output=' +
    params.outputType +
    '&blogName=' +
    params.blogName +
    '&postId=' +
    postId;
  return instance.get(`/comment/list?${queryString}`);
}

// 댓글 작성
function insertComment(data: CommentInput): ProcessCommentRes {
  let queryString =
    'access_token=' +
    params.accessToken +
    '&output=' +
    params.outputType +
    '&blogName=' +
    data.blogName +
    '&postId=' +
    data.postId +
    '&content=' +
    data.content +
    '&secret=' +
    data.secret;

  if (
    data.parentId != null &&
    data.parentId != '' &&
    data.parentId != undefined
  ) {
    queryString += '&parentId=' + data.parentId;
  }

  return instance.post(`/comment/write?${queryString}`);
}

// 댓글 수정
function modifyComment(data: CommentInput): ProcessCommentRes {
  let queryString =
    'access_token=' +
    params.accessToken +
    '&output=' +
    params.outputType +
    '&blogName=' +
    data.blogName +
    '&postId=' +
    data.postId +
    '&commentId=' +
    data.commentId +
    '&content=' +
    data.content +
    '&secret=' +
    data.secret;

  if (
    data.parentId != null &&
    data.parentId != '' &&
    data.parentId != undefined
  ) {
    queryString += '&parentId=' + data.parentId;
  }

  return instance.post(`/comment/modify?${queryString}`);
}

// 댓글 삭제
function deleteComment(data: CommentInput): ProcessCommentRes {
  const queryString =
    'access_token=' +
    params.accessToken +
    '&output=' +
    params.outputType +
    '&blogName=' +
    data.blogName +
    '&postId=' +
    data.postId +
    '&commentId=' +
    data.commentId;

  return instance.post(`/comment/delete?${queryString}`);
}

export {
  fetchBlogInfo,
  fetchCategoryList,
  fetchPostList,
  fetchPostListByCategory,
  fetchPost,
  fetchComments,
  insertComment,
  modifyComment,
  deleteComment,
};
