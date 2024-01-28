<template>
  <div ref="divMain">
    <div>Haguri & Peng's Blog</div>
    <div>
      <img
        src="../assets/images/why_haguri.gif"
        alt=""
        style="width: 300px; height: 300px"
      />
      <!-- adsense_display -->
      <ins
        class="adsbygoogle"
        style="display: inline-block; width: 728px; height: 90px"
        data-ad-client="ca-pub-6187932165258053"
        data-ad-slot="2842718663"
      ></ins>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const divMain = ref<HTMLDivElement>();

onMounted(() => {
  // @ts-ignore
  (adsbygoogle = window.adsbygoogle || []).push({});
});
</script>

<style scoped>
div {
  font-size: 4rem;
  margin-bottom: 10px;
}
</style>
