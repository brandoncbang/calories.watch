<script setup lang="ts">
import { useSettings } from "../helpers/settings";
import Field from "../components/forms/Field.vue";

const settings = useSettings();
</script>

<template>
  <form @submit.prevent="saveSettings">
    <h2 class="text-2xl">Settings</h2>
    <p class="mt-4">
      <Field v-model.lazy.number="settings.dailyLimit" type="number" label="Daily Limit" />
    </p>
  </form>
</template>
