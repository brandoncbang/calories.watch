<template>
  <div class="flex justify-between text-3xl">
    <button @click="loadPreviousDay" aria-label="previous day" title="Previous Day">
      <ArrowLeftIcon class="w-5 h-5" />
    </button>

    <DatePicker v-model="entriesDate" />
    
    <button @click="loadNextDay" aria-label="next day" title="Next Day">
      <ArrowRightIcon class="w-5 h-5" />
    </button>
  </div>

  <h2 class="mt-12 text-2xl">Entries</h2>
  <CalorieEntriesList @delete-entry="deleteCalorieEntry" :calorie-entries="calorieEntries" />

  <div
      :class="{ 'text-red-600': settings.dailyLimit && totalCalories > settings.dailyLimit }"
      class="mt-6"
  >
    <h2 class="text-2xl">Total</h2>
    <p class="mt-2 text-3xl">
      <span>{{ totalCalories }}</span>
      <span v-if="settings.dailyLimit"> / {{ settings.dailyLimit }}</span>
    </p>
  </div>

  <form @submit.prevent="createCalorieEntry" class="mt-12">
    <h2 class="text-2xl">Add an entry</h2>
    <p class="mt-2">
      <Field 
          v-model.number="calorieEntryInput.amount"
          type="number"
          label="Amount"
          placeholder="800"
      />
    </p>
    <p class="mt-2">
      <Field 
          v-model="calorieEntryInput.title"
          type="text"
          label="Title"
          placeholder="Burrito"
      />
    </p>
    <p class="mt-2">
      <Field 
          v-model="calorieEntryInput.happenedAt"
          type="datetime-local"
          label="Happened At"
      />
    </p>

    <p class="mt-6 text-center">
      <Button type="submit">
        Save entry
      </Button>
    </p>
  </form>

  <form @submit.prevent="saveSettings" class="mt-12">
    <h2 class="text-2xl">Settings</h2>
    <p class="mt-2">
      <Field
          v-model.lazy.number="settings.dailyLimit"
          type="number"
          label="Daily Limit"
      />
    </p>
  </form>
</template>

<script setup lang="ts">
  import DatePicker from './components/forms/DatePicker.vue';
  import CalorieEntriesList from './components/CalorieEntriesList.vue';
  import Field from './components/forms/Field.vue';
  import Button from './components/forms/Button.vue';
  import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/solid';

  import { reactive, ref, Ref, computed, watchEffect, watch } from 'vue';
  import { db, ICalorieEntry } from './db';
  import { toDatetimeLocalValue, getDateStart, getDateEnd } from './lib/date';

  const entriesDate = ref(getDateStart(new Date()));

  const todayIsLoaded = computed(() => {
    return entriesDate.value >= getDateStart(new Date()) && entriesDate.value <= getDateEnd(new Date());
  });

  const calorieEntries: Ref<ICalorieEntry[]> = ref([]);

  const totalCalories = computed(() => {
    return calorieEntries.value.reduce((sum, entry) => sum + entry.amount, 0);
  });

  const totalIsOverLimit = computed(() => {
    return settings.dailyLimit && totalCalories > settings.dailyLimit;
  });

  const calorieEntryInput = reactive({
    amount: null,
    title: null,
    happenedAt: null,
  });

  function loadPreviousDay() {
    entriesDate.value.setDate(entriesDate.value.getDate() - 1);
    entriesDate.value = new Date(entriesDate.value);
  }

  function loadNextDay() {
    entriesDate.value.setDate(entriesDate.value.getDate() + 1);
    entriesDate.value = new Date(entriesDate.value);
  }

  function loadToday() {
    entriesDate.value = new Date();
  }

  async function getCalorieEntries() {
    calorieEntries.value = await db.calorieEntries
      .where('happenedAt')
      .between(
        getDateStart(new Date(entriesDate.value)),
        getDateEnd(new Date(entriesDate.value))
      )
      .sortBy('happenedAt');
  }

  async function createCalorieEntry() {
    if (!calorieEntryInput.amount || !calorieEntryInput.title) {
      return;
    }

    try {
      db.calorieEntries.add({
        amount: calorieEntryInput.amount,
        title: calorieEntryInput.title,
        happenedAt: new Date(calorieEntryInput.happenedAt ?? toDatetimeLocalValue(new Date()))
      });

      getCalorieEntries();

      calorieEntryInput.amount = null;
      calorieEntryInput.title = null;
      calorieEntryInput.happenedAt = null;
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteCalorieEntry(id: number) {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      await db.calorieEntries.delete(id);

      getCalorieEntries();
    } catch (error) {
      console.log(error);
    }
  }

  watchEffect(() => {
    getCalorieEntries();
  });

  const settings = reactive(loadSettings());

  function saveSettings() {
    window.localStorage.settings = JSON.stringify(settings);
  }

  function loadSettings() {
    if (!window.localStorage.settings) {
      return {
        dailyLimit: null,
      }
    }

    return JSON.parse(window.localStorage.settings)
  }

  watch(settings, () => {
    saveSettings();
  });
</script>