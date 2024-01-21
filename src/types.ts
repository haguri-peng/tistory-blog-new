interface BlogStat {
  post: string;
  comment: string;
  trackback: string;
  guestbook: string;
}

interface Blogs {
  name: string;
  url: string;
  secondaryUrl: string;
  nickname: string;
  title: string;
  description: string;
  default: string;
  blogIconUrl: string;
  faviconUrl: string;
  profileThumbnailImageUrl: string;
  profileImageUrl: string;
  role: string;
  blogId: string;
  isEmpty: string;
  statistics: BlogStat;
}

interface BlogInfo {
  id: string;
  userId: string;
  blogs: Blogs[];
}

interface Category {
  id: string;
  name: string;
  parent: string;
  label: string;
  entries: string;
}

interface CategoryInfo {
  // 카테고리ID와 페이지 번호 모두 숫자 형식이지만 String 으로 설정
  id: string;
  page: string | number;
}

interface GuestbookWriter {
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
  writer: GuestbookWriter;
  written: string;
}

interface GuestbookPost {
  name: string;
  replier: string;
  comment: string;
  isSecret: boolean;
}

interface SearchInfo {
  id: number;
  title: string;
  summary: string;
  commentCount: number;
  reactionCount: number;
  published: string;
  thumbnailUrl: string;
  path: string;
  // restrictType: null;
  visibility: string;
  visibilityLabel: string;
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
  id: string;
  date: string;
  name: string;
  parentId: string;
  homepage: string;
  visibility: string;
  comment: string;
  open: string;
  level: number;
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

export type {
  BlogInfo,
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
};
