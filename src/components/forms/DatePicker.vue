<template>
  <div class="relative flex items-center" ref="wrapperElement">
    <input class="w-56 px-4 cursor-pointer" ref="inputElement" type="text" required />
    <CalendarIcon class="absolute right-0 -mt-0.5 w-6 h-6 mr-4 pointer-events-none" />
    <div class="" ref="calendarParentElement"></div>
  </div>
</template>

<style>
  input.flatpickr-mobile {
    position: relative;
    width: 15rem;
    background: #fff;
  }

  input.flatpickr-mobile::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 1rem;
    width: 100%;
    opacity: 0;
  }
</style>

<script setup lang="ts">
  /**
   * A date picker that takes and outputs a Date value.
   */

  import { CalendarIcon } from '@heroicons/vue/outline';

  import { ref, computed, onMounted, watchEffect } from 'vue';
  import flatpickr from 'flatpickr';

  const props = defineProps<{ modelValue?: Date }>();

  const emit = defineEmits(['update:modelValue']);

  const wrapperElement = ref<HTMLElement | null>(null);
  const inputElement = ref<HTMLInputElement | null>(null);
  const calendarParentElement = ref<HTMLElement | null>(null);

  onMounted(() => {
    const datePicker = flatpickr(inputElement.value as Node, {
      altInput: true,
      altFormat: 'm/d/Y',
      // appendTo: wrapperElement.value as HTMLElement,
      onChange: (selectedDates) => {
        emit('update:modelValue', selectedDates[0]);
      },
      // positionElement: wrapperElement.value as HTMLElement,
      position: 'below center',
      static: true,
    });

    watchEffect(async () => {
      if (props.modelValue) datePicker.setDate(props.modelValue);
    });
  });
</script>