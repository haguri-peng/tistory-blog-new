import axios from 'axios';
import { GuestbookPost } from '@/types';
import {
  GuestbookInitRes,
  SearchRes,
  GuestbookCountRes,
  GuestbookRes,
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
    `/search/posts.json?keyword=${keyword}&page=${page - 1}&size=${size || 20}`,
  );
}

// Tag 검색
function searchTags(keyword: string, page: number, size: number): SearchRes {
  return instance.get(
    `/search/tags.json?keyword=${keyword}&page=${page - 1}&size=${size || 20}`,
  );
}

// Reaction 검색
function searchReaction(postId: string) {
  return instance.get(`/${postId}/reaction.json`);
}

// post Reaction
function postReaction(postId: string) {
  return instance.post(`/${postId}/reaction.json`);
}

// delete Reaction
function deleteReaction(postId: string) {
  return instance.delete(`/${postId}/reaction.json`);
}

// Guest Book count
function getGuestbookCount(): GuestbookCountRes {
  return instance.get('/api/guestbook/count');
}

// Guest Book init (get requestUser's info)
function getGuestbookInit(): GuestbookInitRes {
  return instance.get('/guestbook/init.json');
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
