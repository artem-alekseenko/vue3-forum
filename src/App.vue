<script setup>
import TheNavbar from '@/components/TheNavbar.vue';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import NProgress from 'nprogress';

const isReady = ref(false);
const router = useRouter();

const onPageReady = () => {
  isReady.value = true;
  NProgress.done();
};

onBeforeMount(() => {
  NProgress.configure({
    speed: 200,
    showSpinner: false,
  });

  router.beforeEach(() => {
    isReady.value = false;
    NProgress.start();
  });
});
</script>

<template>
  <the-navbar />
  <div class="container">
    <router-view
      v-show="isReady"
      @ready="onPageReady"
    />
    <AppSpinner v-show="!isReady" />
  </div>
</template>

<style>
  @import "nprogress/nprogress.css";
  #nprogress .bar{
    background: #24fe8c !important;
  }
</style>
