<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

interface Props {
  label: string;
}

const props = defineProps<Props>();

const model = defineModel();
</script>

<template>
  <label class="flex flex-col">
    <span>{{ label }}</span>
    <input
      v-model="model"
      class="border-2 border-slate-800 mt-1.5 px-3 py-2 text-base bg-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-300"
      type="text"
      v-bind="$attrs"
    />
  </label>
</template>
