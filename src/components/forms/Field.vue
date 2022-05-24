<template>
  <label class="flex flex-col">
    <span>{{ label }}</span>
    <input
        class="border-2 border-slate-800 px-3 py-1.5 text-base placeholder:text-slate-400 focus:outline-none focus:ring focus:ring-slate-400"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>

<script setup lang="ts">
  interface Props {
    type?: string;
    label: string;
    placeholder?: string;
    modelValue?: any|null;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
  });

  const emits = defineEmits(['update:modelValue']);
</script>