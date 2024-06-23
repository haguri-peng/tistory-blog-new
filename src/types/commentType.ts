import { Writer } from '@/types';

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

export type { Comment, CommentInput, CommentInfo, CommentPost };
