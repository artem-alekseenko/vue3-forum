<script setup>
import ForumList from '@/components/ForumList.vue';
import { useCategoriesStore } from '@/stores/CategoriesStore';
import { useForumsStore } from '@/stores/ForumsStore';
import { ref, watchEffect } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const category = ref(null);
const categoriesStore = useCategoriesStore();
const categoryPromise = categoriesStore.getCategoryById(props.id);
watchEffect(async () => {
  category.value = await categoryPromise;
});

const forums = ref([]);
const forumsStore = useForumsStore();
watchEffect(async () => {
  if (category.value?.forums) {
    const forumPromises = await category.value.forums.map((forumId) => forumsStore.forum(forumId));
    forums.value = await Promise.all(forumPromises);
  }
});
</script>

<template>
  <template v-if="category && forums">
    <h1 class="push-top col-full">{{ category.name }}</h1>
    <ForumList
        :title="category.name"
        :forums="forums"
    />
  </template>
</template>
