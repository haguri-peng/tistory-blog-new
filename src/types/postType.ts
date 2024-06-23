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

export type { PostInfo, EntryPost, PostConfig, PostViewer };
