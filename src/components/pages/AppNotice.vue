<template>
  <div class="w-full">
    <div class="noti-title">［ 공지사항({{ noticeCnt }}) ］</div>
    <div class="list">
      <ul>
        <li
          v-for="noti in noticeList"
          :key="noti.id"
          @click="moveNoticeContent(noti.id)"
        >
          <span class="noti-id">ID: {{ noti.id }}</span>
          <span class="noti-title">
            <span>{{ noti.title }}</span>
          </span>
          <span class="noti-date">{{ noti.date }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { find } from 'lodash-es';
import * as htmlparser2 from 'htmlparser2';
import * as cheerio from 'cheerio';

import { getNotice } from '@/api/posts';
import { NoticeInfo } from '@/types';

const router = useRouter();
const moveNoticeContent = (noticeId: number | string) => {
  router.push(`/${noticeId}`);
};

const noticeList: NoticeInfo[] = reactive([]);
const noticeCnt = ref(0);

const fetchNotice = async () => {
  const { data: sHtml } = await getNotice();

  // htmlparser
  const dom = htmlparser2.parseDocument(sHtml);
  if (dom != null) {
    const elHtml = find(
      dom.children,
      (c: cheerio.Element) => c.type == 'tag',
    ) as cheerio.AnyNode;

    if (elHtml != null && elHtml != undefined) {
      const $ = cheerio.load(elHtml);
      noticeCnt.value = Number($('span.num_tit').text());
      const $listPost = $('ul.list_post').eq(0);

      // @ts-ignore
      // 10개만 가져오기
      $listPost.find('li:lt(10)').each(function (i, elem) {
        const visibility = $(elem)
          .find('span.ico_entry')
          .data('visibility') as string;
        if (visibility != 'PUBLIC') return true;

        const id = $(elem).find('a').attr('href')!.replace('/m/', '');
        const title = $(elem).find('strong.tit_blog').text();
        const date = $(elem).find('span.txt_date').text();

        const objNoticeInfo: NoticeInfo = {
          id,
          title,
          content: '',
          date,
          visibility,
        };
        noticeList.push(objNoticeInfo);
      });
    }
  }
};

onMounted(() => {
  fetchNotice();
});
</script>

<style scoped>
div.noti-title {
  font-size: 2rem;
  font-weight: bold;
  color: #76549a;
  margin-bottom: 50px;
}
div.list {
  position: relative;
  width: 80%;
  height: calc(100% - 60px);
}
ul {
  margin: 50px 0;
  list-style: none;
}
li {
  display: table;
  width: 100%;
  font-size: 1.5rem;
  margin: 2px 10px;
}
li:hover {
  color: #df7861;
  cursor: pointer;
}
span.noti-id,
span.noti-date {
  display: none;
}
</style>
