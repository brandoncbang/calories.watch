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
  <CalorieEntriesList
      @edit-entry="editCalorieEntry"
      @delete-entry="deleteCalorieEntry"
      :calorie-entries="calorieEntries"
  />
  <CalorieTotal
      :calorie-entries="calorieEntries"
      :limit="settings.dailyLimit || null"
  />

  <CalorieEntryForm @saved="createCalorieEntry" class="mt-12">
    <template v-slot="heading">
      <h2 class="text-2xl">Add an entry</h2>
    </template>
  </CalorieEntryForm>

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
  import CalorieTotal from './components/CalorieTotal.vue';
  import CalorieEntryForm from './components/CalorieEntryForm.vue';
  import Field from './components/forms/Field.vue';
  import Button from './components/forms/Button.vue';
  import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/solid';

  import { reactive, ref, Ref, computed, watchEffect, watch } from 'vue';
  import { db, ICalorieEntry } from './db';
  import { getDateStart, getDateEnd } from './lib/date';

  const entriesDate = ref(getDateStart(new Date()));

  const calorieEntries: Ref<ICalorieEntry[]> = ref([]);

  function loadPreviousDay() {
    entriesDate.value.setDate(entriesDate.value.getDate() - 1);
    entriesDate.value = new Date(entriesDate.value);
  }

  function loadNextDay() {
    entriesDate.value.setDate(entriesDate.value.getDate() + 1);
    entriesDate.value = new Date(entriesDate.value);
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

  async function createCalorieEntry(data: ICalorieEntry) {
    try {
      db.calorieEntries.add({
        amount: data.amount,
        title: data.title,
        happenedAt: data.happenedAt,
      });

      getCalorieEntries();
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