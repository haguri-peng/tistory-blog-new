import axios from 'axios';
import { GuestbookPost } from '@/types';
import {
  GuestbookInitRes,
  SearchRes,
  GuestbookCountRes,
  GuestbookRes,
  ReactionRes,
  ReactionToggleRes,
} from '@/api/axiosResTypes';

// axios 초기화
function createInstance() {
  return axios.create({
    baseURL: 'https://haguri-peng.tistory.com/m',
  });
}

const instance = createInstance();

// 글 검색
function searchPosts(keyword: string, page: number, size: number): SearchRes {
  return instance.get(
    `/api/search/post?keyword=${keyword}&page=${page - 1}&size=${size || 20}`,
  );
}

// Tag 검색
function searchTags(keyword: string, page: number, size: number): SearchRes {
  return instance.get(
    `/api/search/tag?keyword=${keyword}&page=${page - 1}&size=${size || 20}`,
  );
}

// Reaction 검색
function searchReaction(postId: string): ReactionRes {
  return instance.get(`/api/${postId}/reaction`);
}

// post Reaction
function postReaction(postId: string): ReactionToggleRes {
  return instance.post(`/api/${postId}/reaction`);
}

// delete Reaction
function deleteReaction(postId: string): ReactionToggleRes {
  return instance.delete(`/api/${postId}/reaction`);
}

// Guest Book count
function getGuestbookCount(): GuestbookCountRes {
  return instance.get('/api/guestbook/count');
}

// Guest Book init (get requestUser's info)
function getGuestbookInit(): GuestbookInitRes {
  return instance.get('/api/blog/init');
}

// get Guest Book
function getGuestbook(size?: number): GuestbookRes {
  return instance.get(`/api/guestbook?size=${size || 30}`);
}

// post Guest Book
function postGuestbook(postData: GuestbookPost) {
  return instance.post('/api/guestbook', postData);
}

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
};
