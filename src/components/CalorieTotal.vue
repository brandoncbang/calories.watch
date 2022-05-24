<template>
  <div
      :class="{ 'text-red-600': limit && totalCalories > limit }"
      class="mt-6"
  >
    <h2 class="text-2xl">Total</h2>
    <p class="mt-2 text-3xl">
      <span>{{ totalCalories }}</span>
      <span v-if="limit"> / {{ limit }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { ICalorieEntry } from '../db';

  interface Props {
    calorieEntries: ICalorieEntry[];
    limit?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    calorieEntries: () => [],
  });

  const totalCalories = computed(() => {
    return props.calorieEntries.reduce((sum, entry) => sum + entry.amount, 0);
  });
</script>