<script setup>
import ForumList from '@/components/ForumList.vue';
import { onBeforeMount, ref } from 'vue';
import { DataProvider } from '@/data-provider/DataProvider';
import { useAsyncDataLoadedStatus } from '@/composables/AsyncDataLoadedStatus';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const currentCategory = ref(null);
const forums = ref([]);
const { isAsyncDataLoaded, setAsyncDataStatusLoaded } = useAsyncDataLoadedStatus();

const dataProvider = DataProvider.getInstance();

onBeforeMount(async () => {
  const [category, forumsData] = await Promise.all([
    dataProvider.getCategoryById(props.id),
    dataProvider.getForumsByCategoryId(props.id),
  ]);

  currentCategory.value = category;
  forums.value = forumsData;
  setAsyncDataStatusLoaded();
});
</script>

<template>
  <template v-if="isAsyncDataLoaded">
    <h1 class="push-top col-full">
      {{ currentCategory.name }}
    </h1>
    <ForumList
      :title="currentCategory.name"
      :forums="forums"
    />
  </template>
</template>
