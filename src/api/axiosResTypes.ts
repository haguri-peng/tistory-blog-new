import { AxiosResponse } from 'axios';
import { Category, SearchInfo, Guestbook, Comment, EntryPost } from '@/types';

interface CategoryFetch {
  data: {
    items: Category[];
    totalEntryCount: number;
  };
}
type CategoryRes = Promise<AxiosResponse<CategoryFetch>>;

interface PostFetch {
  tistory: {
    status: '200';
    item: {
      url: string;
      secondaryUrl: string;
      id: string;
      slogan: string;
      title: string;
      content: string;
      categoryId: string;
      postUrl: string;
      visibility: string;
      acceptComment: string;
      acceptTrackback: string;
      comments: string;
      trackbacks: string;
      date: string;
      tags: {
        tag: string[];
      };
    };
  };
}
type PostRes = Promise<AxiosResponse<PostFetch>>;

interface GuestbookInit {
  data: {
    config: {
      allowComment: boolean;
      allowCommentToGuest: boolean;
      allowGuestbook: boolean;
      allowGuestbookToGuest: boolean;
      useCommentRecognition: boolean;
      useGuestbookRecognition: boolean;
      isSupport: boolean;
    };
    viewer: {
      id: number;
      name: string;
      homepage: string;
      role: string;
      canManage: boolean;
      isRequestUser: boolean;
    };
  };
}
type GuestbookInitRes = Promise<AxiosResponse<GuestbookInit>>;

interface SearchTagsPosts {
  data: {
    isLast: boolean;
    items: SearchInfo[];
    nextPage: boolean;
    totalItems: number;
  };
}
type SearchRes = Promise<AxiosResponse<SearchTagsPosts>>;

type GuestbookCountRes = Promise<
  AxiosResponse<{
    data: {
      count: number;
    };
  }>
>;

interface GuestbookFetch {
  data: {
    isLast: boolean;
    items: Guestbook[];
    nextId: number;
    totalItems: number;
  };
}
type GuestbookRes = Promise<AxiosResponse<GuestbookFetch>>;

interface CommentsFetch {
  data: {
    items: Comment[];
    isLast: boolean;
    totalItems: number;
    nextId: number;
  };
}
type CommentsRes = Promise<AxiosResponse<CommentsFetch>>;

interface ProcessComment {
  tistory: {
    status: string;
    commentUrl: string;
    result: string;
  };
}
type ProcessCommentRes = Promise<AxiosResponse<ProcessComment>>;

interface ReactionFetch {
  data: {
    count: number;
    isCheck: boolean;
  };
}
type ReactionRes = Promise<AxiosResponse<ReactionFetch>>;

interface ReactionToggle {
  code: number;
  message: string;
  result: { isSuccess: boolean };
}
type ReactionToggleRes = Promise<AxiosResponse<ReactionToggle>>;

interface EntryPostsFetch {
  data: {
    items: EntryPost[];
    isLast: boolean;
    totalItems: number;
    nextPage: number;
  };
}
type EntryPostsRes = Promise<AxiosResponse<EntryPostsFetch>>;

type PostInfoRes = Promise<AxiosResponse<string>>;

interface ConfigViewerFetch {
  data: {
    items: EntryPost[];
    isLast: boolean;
    totalItems: number;
    nextPage: number;
  };
}
type ConfigViewerRes = Promise<AxiosResponse<ConfigViewerFetch>>;

interface RealtedPopularFetch {
  data: {
    isLast: boolean;
    items: SearchInfo[];
    nextPage: number;
    totalItems: number;
  };
}
type RealtedPopularRes = Promise<AxiosResponse<RealtedPopularFetch>>;

export type {
  CategoryRes,
  PostRes,
  GuestbookInitRes,
  SearchRes,
  GuestbookCountRes,
  GuestbookRes,
  CommentsRes,
  ProcessCommentRes,
  ReactionRes,
  ReactionToggleRes,
  EntryPostsRes,
  PostInfoRes,
  ConfigViewerRes,
  RealtedPopularRes,
};
