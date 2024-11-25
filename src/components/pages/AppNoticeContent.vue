<template>
  <div class="noti-content">
    <div class="title">
      <h1>{{ getUnescapedTitle }}</h1>
      <p class="date">작성일시: {{ date }}</p>
    </div>
    <div class="content" v-html="content"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { unescape, find } from 'lodash-es';
import * as htmlparser2 from 'htmlparser2';
import * as cheerio from 'cheerio';

import { getNotice } from '@/api/posts';

const route = useRoute();
const noticeId = computed(() => route.params.noticeId.toString());

const title = ref('');
const date = ref('');
const getUnescapedTitle = computed(() => unescape(title.value));

const content = ref('');
const fetchNotice = async () => {
  const { data: sHtml } = await getNotice(noticeId.value);
  // console.log(sHtml);

  // htmlparser
  const dom = htmlparser2.parseDocument(sHtml);
  if (dom != null) {
    const elHtml = find(dom.children, (c: cheerio.Element) => c.type == 'tag');
    // console.log(elHtml);

    if (elHtml != null && elHtml != undefined) {
      // @ts-ignore
      const $ = cheerio.load(elHtml);
      const $mainContent = $('#mainContent');
      // console.log($$mainContent);

      // Title
      const titleEl = $mainContent.find('.tit_blogview');
      title.value = titleEl.text();

      // Date
      const dateEl = $mainContent.find('span.txt_date');
      date.value = dateEl.text();

      // Content
      const contentEl = $mainContent.find('div.blogview_content');
      content.value = contentEl.html() as string;
    }
  }
};

onMounted(() => {
  fetchNotice();
});
</script>

<style scoped>
div.noti-content {
  font-size: 1.2rem;
  text-align: initial;
  padding: 0 50px;
}
div.title {
  margin-top: 90px;
  margin-bottom: 59px;
  text-align: center;
}
div.title h1 {
  font-size: 2rem;
  color: #df7861;
}
div.title p.date {
  color: #76549a;
  font-size: 0.9rem;
}
</style>
