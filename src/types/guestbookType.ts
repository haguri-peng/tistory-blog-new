import { Writer } from '@/types';

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

export type { Guestbook, GuestbookPost };
