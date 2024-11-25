<template>
  <div id="content-gallery" class="hidden">
    <a
      v-for="(image, idx) in imageDatas"
      :key="idx"
      :href="image.imageUrl"
      :data-pswp-width="image.width"
      :data-pswp-height="image.height"
      target="_blank"
      rel="noreferrer"
    >
      <img :src="image.imageUrl" :alt="image.alt" width="300" />
    </a>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { reactive, toRefs, watch, onMounted, onUnmounted } from 'vue';

import * as htmlparser2 from 'htmlparser2';
import { forEach, findIndex, flow, filter, map, flatten } from 'lodash-es';

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';
import 'photoswipe/style.css';

import { ImageInfo } from '@/types';
import { isNullStr } from '@/utils/utils';

const props = defineProps<{
  content: string;
  imgSrc: string;
}>();
const { content, imgSrc } = toRefs(props);

const emit = defineEmits<{
  clearImgSrc: [];
}>();

let lightbox;
const imageDatas: ImageInfo[] = reactive([]);
onMounted(() => {
  setTimeout(() => {
    const dom = htmlparser2.parseDocument(content.value);
    // console.log(dom);

    if (dom != null) {
      // Image Elements
      let imgEls = flow(
        (children) =>
          filter(
            children,
            (c) =>
              c.name == 'figure' &&
              c.attribs.hasOwnProperty('class') &&
              c.attribs.class.indexOf('imageblock') > -1,
          ),
        (children) => map(children, (el) => el.children[0]),
      )(dom.children);

      // div 영역 내에 있는 경우도 있어서 재작업
      const imgFlow = flow([
        (children) => filter(children, (c) => c.name == 'div'),
        (children) => map(children, (c) => c.children),
        (children) => flatten(children),
        (children) =>
          filter(
            children,
            (c) =>
              c.name == 'figure' &&
              c.attribs.hasOwnProperty('class') &&
              c.attribs.class.indexOf('imageblock') > -1,
          ),
        (children) => map(children, (el) => el.children[0]),
      ]);
      const filteredImg = imgFlow(dom.children);
      imgEls.push(...filteredImg);

      if (imgEls.length > 0) {
        forEach(imgEls, function (el) {
          const objImgInfo = <ImageInfo>{};
          objImgInfo.alt = el.attribs['data-alt'];
          objImgInfo.imageUrl = el.attribs['data-url'];
          objImgInfo.width = el.children[0].attribs['data-origin-width'];
          objImgInfo.height = el.children[0].attribs['data-origin-height'];
          imageDatas.push(objImgInfo);
        });
        // console.log(imageDatas);

        if (!lightbox) {
          lightbox = new PhotoSwipeLightbox({
            gallery: '#content-gallery',
            children: 'a',
            // pswpModule: () => import('photoswipe'),
            pswpModule: PhotoSwipe,
          });
          lightbox.init();
        }
      }
    }
  }, 500);
});

watch(imgSrc, (val) => {
  if (!isNullStr(val)) {
    const fIdx = findIndex(imageDatas, function (image) {
      return image.imageUrl == val;
    });
    if (lightbox && fIdx > -1) {
      lightbox.loadAndOpen(fIdx);

      // load 이후에 imgSrc 초기화
      emit('clearImgSrc');
    }
  }
});

onUnmounted(() => {
  if (lightbox) {
    lightbox.destroy();
    lightbox = null;
  }
});
</script>

<style scoped></style>
