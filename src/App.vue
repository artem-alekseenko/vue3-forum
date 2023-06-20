<script setup>
import TheNavbar from '@/components/TheNavbar.vue';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

const isReady = ref(false);
const router = useRouter();

onBeforeMount(() => {
  router.beforeEach(() => {
    isReady.value = false;
  });
});
</script>

<template>
  <the-navbar />
  <div class="container">
    <router-view
      v-show="isReady"
      @ready="isReady = true"
    />
    <div
      v-show="!isReady"
      class="push-top"
    >
      Loading...
    </div>
  </div>
</template>
