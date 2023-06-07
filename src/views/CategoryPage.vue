<script setup>
import ForumList from '@/components/ForumList.vue';
import { onBeforeMount, ref } from 'vue';
import { getCategoryById, getForumsByCategoryId } from '@/data-provider/DataProvider';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const currentCategory = ref(null);
const forums = ref([]);

onBeforeMount(async () => {
  const [category, forumsData] = await Promise.all([
    getCategoryById(props.id),
    getForumsByCategoryId(props.id),
  ]);

  currentCategory.value = category;
  forums.value = forumsData;
});
</script>

<template>
  <template v-if="currentCategory && forums">
    <h1 class="push-top col-full">{{ currentCategory.name }}</h1>
    <ForumList
        :title="currentCategory.name"
        :forums="forums"
    />
  </template>
</template>
