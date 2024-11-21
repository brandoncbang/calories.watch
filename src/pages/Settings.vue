<script setup lang="ts">
import { useSettings } from "../helpers/settings";
import NumberField from "../components/forms/NumberField.vue";

const settings = useSettings();
</script>

<template>
  <form>
    <h2 class="text-2xl">Settings</h2>
    <p class="mt-4">
      <NumberField v-model.number="settings.dailyLimit" label="Daily Limit" />
    </p>
  </form>
</template>
