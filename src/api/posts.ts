import axios from 'axios';
import { GuestbookPost } from '@/types';
import {
  GuestbookInitRes,
  SearchRes,
  GuestbookCountRes,
  GuestbookRes,
  ReactionRes,
  ReactionToggleRes,
  EntryPostsRes,
  CategoryRes,
  PostInfoRes,
  CommentsRes,
  ConfigViewerRes,
  RealtedPopularRes,
} from '@/api/axiosResTypes';

// axios 초기화
function createInstance() {
  return axios.create({
    baseURL: 'https://haguri-peng.tistory.com/m',
  });
}

const instance = createInstance();

// 글 검색
const searchPosts = (keyword: string, page: number, size: number): SearchRes =>
  instance.get(
    `/api/search/post?keyword=${keyword}&page=${page - 1}&size=${size || 20}`,
  );

// Tag 검색
const searchTags = (keyword: string, page: number, size: number): SearchRes =>
  instance.get(
    `/api/search/tag?keyword=${keyword}&page=${page - 1}&size=${size || 20}`,
  );

// Reaction 검색
const searchReaction = (postId: string): ReactionRes =>
  instance.get(`/api/${postId}/reaction`);

// post Reaction
const postReaction = (postId: string): ReactionToggleRes =>
  instance.post(`/api/${postId}/reaction`);

// delete Reaction
const deleteReaction = (postId: string): ReactionToggleRes =>
  instance.delete(`/api/${postId}/reaction`);

// Guest Book count
const getGuestbookCount = (): GuestbookCountRes =>
  instance.get('/api/guestbook/count');

// Guest Book init (get requestUser's info)
function getGuestbookInit(): GuestbookInitRes {
  return instance.get('/api/blog/init');
}

// get Guest Book
const getGuestbook = (size?: number): GuestbookRes =>
  instance.get(`/api/guestbook?size=${size || 30}`);

// post Guest Book
const postGuestbook = (postData: GuestbookPost) =>
  instance.post('/api/guestbook', postData);

// Entry Posts (default page is 0)
const searchEntryPosts = (page = 0): EntryPostsRes => {
  let size = 30;
  if (page > 0) {
    size = 10;
  }
  return instance.get(`/api/entry/0/POST?page=${page}&size=${size}`);
};

// Categories
const getCategories = (): CategoryRes => instance.get('/api/categories');

const getFirstPostListByCategory = (categoryPath: string): PostInfoRes =>
  instance.get(`/category/${categoryPath}`, { responseType: 'text' });

const getPostListByCategory = (
  categoryId: string,
  pageNum: number,
): EntryPostsRes => {
  return instance.get(
    `/api/entry/${categoryId}/POST?page=${pageNum - 1}&size=10`,
  );
};

const getPostInfo = (postId?: string | number | undefined): PostInfoRes =>
  instance.get(`/${postId || ''}`, { responseType: 'text' });

const getPostComments = (postId: string): CommentsRes =>
  instance.get(`/api/${postId}/comment`);

const getConfigViewerInPost = (postId: string): ConfigViewerRes =>
  instance.get(`/api/blog/init/${postId}`);

const getRelatedPosts = (postId: string): RealtedPopularRes =>
  instance.get(`/api/entry/${postId}/related`);

const getPopularPosts = (postId: string): RealtedPopularRes =>
  instance.get(`/api/entry/${postId}/popular`);

export {
  searchPosts,
  searchTags,
  searchReaction,
  postReaction,
  deleteReaction,
  getGuestbookCount,
  getGuestbookInit,
  getGuestbook,
  postGuestbook,
  searchEntryPosts,
  getCategories,
  getFirstPostListByCategory,
  getPostListByCategory,
  getPostInfo,
  getPostComments,
  getConfigViewerInPost,
  getRelatedPosts,
  getPopularPosts,
};
