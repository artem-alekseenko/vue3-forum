<script setup>
import ForumList from '@/components/ForumList.vue';
import { useForumsStore } from '@/stores/ForumsStore';
import { onBeforeMount, ref } from 'vue';
import { useAsyncDataLoadedStatus } from '@/composables/AsyncDataLoadedStatus';

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
});

const forums = ref(null);
const { isAsyncDataLoaded, setAsyncDataStatusLoaded } = useAsyncDataLoadedStatus();

const forumsStore = useForumsStore();
onBeforeMount(async () => {
  const promises = props.categories.map((category) => forumsStore.getForumsByCategoryId(category.id));
  forums.value = await Promise.all(promises);
  setAsyncDataStatusLoaded();
});
</script>

<template>
  <template v-if="isAsyncDataLoaded">
    <ForumList
      v-for="(category, index) in props.categories"
      :key="category.id"
      :forums="forums[index]"
      :title="category.name"
      :category-id="category.id"
    />
  </template>
</template>
