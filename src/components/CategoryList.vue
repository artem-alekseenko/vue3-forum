<script setup>
import ForumList from '@/components/ForumList.vue';
import { useForumsStore } from '@/stores/ForumsStore';
import { onMounted, ref } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
});

const forumsStore = useForumsStore();
const forums = ref(null);
onMounted(async () => {
  const promises = props.categories.map((category) => forumsStore.getForumsByCategoryId(category.id));
  forums.value = await Promise.all(promises);
});
</script>

<template>
  <div v-if="!forums">
    Loading...
  </div>
  <template v-else>
    <ForumList
        v-for="(category, index) in props.categories"
        :key="category.id"
        :forums="forums[index]"
        :title="category.name"
        :category-id="category.id"
    />
  </template>
</template>
