<template>
  <div v-html="content" class="contentMain" @click="clickContent"></div>

  <ContentGallery :content :imgSrc @clearImgSrc="clearImgSrc" />
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted, onUpdated } from 'vue';

import ContentGallery from '@/components/content/ContentGallery.vue';

import * as htmlparser2 from 'htmlparser2';
import { filter, delay } from 'lodash-es';

import loadScript from '@/utils/load-script';
import { isNullStr, css } from '@/utils/utils';

const content = defineModel<string>('content', { required: true });

const isUpdated = ref(false);
const parseDom = (val: string) => {
  const dom = htmlparser2.parseDocument(val);
  if (dom != null) {
    let modifiedContent = val;

    // 광고
    const ads = filter(
      dom.children,
      (c) => c.name == 'figure' && c.attribs.class == 'ad-wp',
    );
    if (ads.length > 0) {
      for (let i = 0; i < ads.length; i++) {
        // Adfit
        if (ads[i].attribs['data-ad-vendor'] == 'adfit') {
          const regex = new RegExp(
            '<figure[^>]*.data-ad-id-pc="(' +
              ads[i].attribs['data-ad-id-pc'] +
              ').*><\/figure>',
          );
          modifiedContent = modifiedContent.replace(regex, getAdfitHtml());
        }
        // Tenping
        if (ads[i].attribs['data-ad-vendor'] == 'tenping') {
          const regex = new RegExp(
            '<figure[^>]*.data-ad-id-pc="(' +
              ads[i].attribs['data-ad-id-pc'] +
              ').*><\/figure>',
          );
          modifiedContent = modifiedContent.replace(regex, getTenpingHtml());
        }
      }
    }

    content.value = modifiedContent;
    isUpdated.value = true;

    // load AdFit
    adfitLoader().then(() => delay(adfit, 100));

    // Tenping
    loadScript('//tads.tenping.kr/scripts/adsbytenping.min.js', 'async');

    // 코드 구문 강조
    if (typeof hljs != 'undefined') {
      hljs.highlightAll();
      hljs.initLineNumbersOnLoad();

      setTimeout(() => {
        const elHljs =
          document.querySelectorAll<HTMLElement>('code[class^=hljs]');
        css(elHljs, { fontFamily: "'Monaco'" });
        const elHljsSpan = document.querySelectorAll<HTMLElement>(
          'code[class^=hljs] span',
        );
        css(elHljsSpan, { fontFamily: "'Monaco'" });
        const elHljsTd = document.querySelectorAll<HTMLElement>(
          'code[class^=hljs] td',
        );
        css(elHljsTd, { fontFamily: "'Monaco'" });

        // highlightjs-line-numbers CSS
        const elHljsLnNumbers =
          document.querySelectorAll<HTMLElement>('.hljs-ln-numbers');
        css(elHljsLnNumbers, {
          '-webkit-touch-callout': 'none',
          '-webkit-user-select': 'none',
          '-khtml-user-select': 'none',
          '-moz-user-select': 'none',
          '-ms-user-select': 'none',
          userSelect: 'none',
          textAlign: 'center',
          color: '#ccc',
          borderRight: '1px solid #ccc',
          verticalAlign: 'top',
          paddingRight: '10px',
        });

        const elHljsLnCode = document.querySelectorAll<HTMLElement>(
          '.hljs-ln-line.hljs-ln-code',
        );
        css(elHljsLnCode, { paddingLeft: '10px' });
      }, 100);
    }
  }
};

onMounted(() => {
  // twttr.ready((twttr) => {
  //   // At this point the widget.js file had been loaded.
  //   // We can now make use of the twttr events
  //   twttr.events.bind('loaded', (event) => {
  //     // At this point all tweets have been fully loaded
  //     // and rendered and you we can proceed with our Javascript
  //     // console.log('Created widget', event);
  //     // if (event.widgets.length > 0) {
  //     // }
  //   });
  // });

  // highlight.js
  // 블로그 내에서 설정한 스타일을 해제하고 다른 스타일(night-owl)로 적용
  const links = document.querySelectorAll<HTMLElement>('link');
  links.forEach((link) => {
    if (link.getAttribute('href')?.includes('atom')) {
      link.disabled = true;
    }
  });

  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/tomorrow-night-blue.min.css';
  document.head.appendChild(link);
});
onUpdated(() => {
  // Parsing
  if (!isNullStr(content.value) && !isUpdated.value) {
    parseDom(content.value);

    // Twitter Widget 로딩
    twttr.widgets.load();
  }

  const elPre = document.querySelectorAll<HTMLElement>('pre');
  css(elPre, {
    fontSize: '0.9rem',
    lineHeight: '21px',
  });

  // 별도로 CSS 설정
  const elContentMainList = document.querySelectorAll<HTMLElement>(
    'div.contentMain ul, div.contentMain ol',
  );
  css(elContentMainList, { paddingLeft: '30px' });

  const elContentMainPara =
    document.querySelectorAll<HTMLElement>('div.contentMain p');
  css(elContentMainPara, { margin: '5px 0' });
});

function adfitLoader() {
  if (typeof window['adfit'] === 'function') {
    return Promise.resolve();
  } else {
    return loadScript('//t1.daumcdn.net/kas/static/ba.min.js', 'async');
  }
}
function getAdfitHtml() {
  const adfitMiddleId = 'DAN-OrpQV5Dh13ppgSiy';
  const width = '728';
  const height = '90';

  return `<ins class="kakao_ad_area" data-ad-unit="${adfitMiddleId}" data-ad-width="${width}" data-ad-height="${height}"></ins>`;
}
function getTenpingHtml() {
  return `
    <tenping
      class="adsbytenping"
      style="width:100%;max-width:768px;margin:0 auto;display:block;"
      mediaid="2876097"
      tenping-ad-display-type="UD8Mia8gyIoT5Z2MT6VB3Q%3d%3d">
    </tenping>`;
}

const imgSrc = ref('');
const clickContent = (evt: MouseEvent) => {
  const el = evt.target as HTMLElement;
  // console.log(el);

  // image 클릭
  if (el.tagName == 'IMG') {
    imgSrc.value = el.getAttribute('src') || '';
  }
};
const clearImgSrc = () => {
  imgSrc.value = '';
};
</script>

<style scoped>
div {
  font-size: 1rem;
  text-align: initial;
  padding: 0 50px;
  width: 80%;
}
</style>
