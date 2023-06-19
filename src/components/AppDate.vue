<script setup>
import dayjs from 'dayjs/esm';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedDate from 'dayjs/plugin/localizedFormat';
import { computed } from 'vue';

dayjs.extend(relativeTime);
dayjs.extend(localizedDate);

const props = defineProps({
  timestamp: {
    type: [Number, Object],
    required: true,
  },
});

const normalizedTimestamp = computed(() => props.timestamp?.seconds || props.timestamp);

const diffForHumans = dayjs.unix(normalizedTimestamp.value).fromNow();
const humanFriendlyDate = dayjs.unix(normalizedTimestamp.value).format('llll');
</script>

<template>
  <span :title="humanFriendlyDate">
    {{ diffForHumans }}
  </span>
</template>
