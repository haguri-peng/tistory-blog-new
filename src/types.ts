export * from '@/types/categoryType';
export * from '@/types/postType';
export * from '@/types/commentType';
export * from '@/types/guestbookType';

interface Writer {
  canManage: boolean;
  homepage: string;
  id: number;
  isRequestUser: boolean;
  name: string;
  profileImage: string;
  role: string;
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

interface HeadingTagInfo {
  id: string;
  text: string;
}

export type {
  SearchInfo,
  PageInfo,
  Writer,
  NoticeInfo,
  ImageInfo,
  HeadingTagInfo,
};
