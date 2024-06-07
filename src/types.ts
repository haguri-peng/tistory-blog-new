interface Category {
  id: string;
  name: string;
  entryCount: number;
  path: string;
  lastUpdate: string;
  children: Category[];
}

interface CategoryInfo {
  // 카테고리ID와 페이지 번호 모두 숫자 형식이지만 String 으로 설정
  id: string;
  page: string | number;
}

interface Writer {
  canManage: boolean;
  homepage: string;
  id: number;
  isRequestUser: boolean;
  name: string;
  profileImage: string;
  role: string;
}

interface Guestbook {
  id: number;
  isSecret: boolean;
  content: string;
  writer: Writer;
  written: string;
}

interface GuestbookPost {
  name: string;
  replier: string;
  comment: string;
  isSecret: boolean;
}

interface SearchInfo {
  authorId: number;
  authorProfileImage: string;
  authorProfileNickname: string;
  blogId: number;
  blogName: string;
  categoryId: number;
  categoryName: string;
  commentCount: number;
  id: number;
  path: string;
  profile: string;
  published: string;
  reactionCount: number;
  // restrictType: null;
  summary: string;
  tags: string[];
  thumbnail: string;
  title: string;
  url: string;
  visibility: string;
}

interface PageInfo {
  currentPage: number;
  totalPage: number;
}

interface PostInfo {
  id: string;
  title: string;
  postUrl: string;
  visibility: string;
  categoryId: string;
  comments: string;
  trackbacks: string;
  date: string;
}

interface Comment {
  level?: number;
  id: number;
  content: string;
  written: string;
  permalink: string;
  isSecret: boolean;
  isPinned: boolean;
  parent: number;
  children: Comment[];
  writer: Writer;
  type: string;
}

interface CommentInput {
  postId?: string;
  blogName: string;
  content?: string;
  secret?: number;
  parentId?: string;
  commentId?: string;
}

interface CommentInfo {
  parentCommentId: string;
  commentId: string;
  comment: string;
  modComment?: string;
}

interface CommentPost {
  captcha: string;
  comment: string;
  homepage: string;
  isSecret: boolean;
  name: string;
  parent: number | null;
  password: string;
  mentionId?: string;
}

interface EntryPost {
  id: number;
  title: string;
  summary: string;
  commentCount: number;
  reactionCount: number;
  published: string;
  thumbnail: string;
  blogId: number;
  blogName: string;
  authorId: number;
  categoryId: number;
  categoryName: string;
  tags: string[];
  url: string;
  path: string;
  visibility: string;
  profile: string;
  authorProfileNickname: string;
  authorProfileImage: string;
  restrictType: null;
}

interface PostConfig {
  allowComment: boolean;
  allowCommentToGuest: boolean;
  allowGuestbook: boolean;
  allowGuestbookToGuest: boolean;
  isSupport: boolean;
  useCommentRecognition: boolean;
  useGuestbookRecognition: boolean;
}

interface PostViewer {
  canManage: boolean;
  homepage: string;
  id: number;
  isRequestUser: boolean;
  name: string;
  role: string;
}

interface NoticeInfo {
  id: string;
  title: string;
  content: string;
  date: string;
  visibility: string;
}

interface ImageInfo {
  alt?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
}

export type {
  Category,
  CategoryInfo,
  Comment,
  Guestbook,
  GuestbookPost,
  SearchInfo,
  PageInfo,
  PostInfo,
  CommentInput,
  CommentInfo,
  CommentPost,
  EntryPost,
  PostConfig,
  PostViewer,
  Writer,
  NoticeInfo,
  ImageInfo,
};
