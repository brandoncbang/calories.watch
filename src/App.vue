<template>
  <div class="mb-24">
    <template v-if="!screen">
      <div class="flex justify-between mb-6 text-3xl">
        <button @click="loadPreviousDay" aria-label="previous day" title="Previous Day">
          <ArrowLeftIcon class="w-5 h-5" />
        </button>

        <DatePicker v-model="selectedDate" />
        
        <button @click="loadNextDay" aria-label="next day" title="Next Day">
          <ArrowRightIcon class="w-5 h-5" />
        </button>
      </div>

      <CalorieIntakeGraph
          :calorie-entries="calorieEntries"
          :start-date="rangeStartDate"
          :end-date="selectedDate"
          :limit="settings.dailyLimit || null"
      />

      <h2 class="mt-6 text-2xl">Entries</h2>
      <CalorieEntriesList
          @edit-entry="editCalorieEntry"
          @delete-entry="deleteCalorieEntry"
          :calorie-entries="calorieEntriesFromSelectedDate"
      />

      <div class="flex items-center justify-between mt-6">
        <CalorieTotal
            :calorie-entries="calorieEntriesFromSelectedDate"
            :limit="settings.dailyLimit || null"
        />

        <Button @click="screen = 'form'">Create entry</Button>
      </div>      
    </template>

    <template v-if="screen === 'form'">
      <h2 class="text-2xl">Add a calorie entry</h2>
      <CalorieEntryForm @saved="createCalorieEntry" @canceled="screen = null" />
    </template>

    <template v-if="screen === 'settings'">
      <form @submit.prevent="saveSettings">
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

    <template v-if="screen === 'about'">
      <h2 class="text-2xl">About</h2>
      <p class="mt-2">Made by Brandon Bang</p>
    </template>

    <div class="fixed bottom-0 left-0 right-0 flex p-1 mt-12 space-x-1 bg-white border-t-2 justify-evenly border-slate-800">
      <button @click="screen = null" class="flex-1 py-4">
        <span
            :class="{ 'border-b-2': screen === null }"
            class="border-slate-800"
        >
          Entries
        </span>
      </button>
      <button @click="screen = 'settings'" class="flex-1 py-4">
        <span
            :class="{ 'border-b-2': screen === 'settings' }"
            class="border-slate-800"
        >
          Settings
        </span>
      </button>
      <button @click="screen = 'about'" class="flex-1 py-4">
        <span
            :class="{ 'border-b-2': screen === 'about' }"
            class="border-slate-800"
        >
          About
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import DatePicker from './components/forms/DatePicker.vue';
  import CalorieIntakeGraph from './components/CalorieGraph.vue';
  import CalorieEntriesList from './components/CalorieEntriesList.vue';
  import CalorieTotal from './components/CalorieTotal.vue';
  import CalorieEntryForm from './components/CalorieEntryForm.vue';
  import Field from './components/forms/Field.vue';
  import Button from './components/forms/Button.vue';
  import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/solid';

  import { reactive, ref, Ref, computed, watchEffect, watch } from 'vue';
  import { db, ICalorieEntry } from './db';
  import { startOfDay, endOfDay, isSameDay } from 'date-fns';

  const screen: Ref<string | null> = ref(null);

  const selectedDate = ref(startOfDay(new Date()));

  const rangeStartDate = computed(() => {
    let date = new Date(selectedDate.value);
    date.setDate(date.getDate() - 7);

    return date;
  })

  function loadPreviousDay() {
    selectedDate.value.setDate(selectedDate.value.getDate() - 1);
    selectedDate.value = new Date(selectedDate.value);
  }

  function loadNextDay() {
    selectedDate.value.setDate(selectedDate.value.getDate() + 1);
    selectedDate.value = new Date(selectedDate.value);
  }

  const calorieEntries: Ref<ICalorieEntry[]> = ref([]);

  const calorieEntriesFromSelectedDate = computed(() => {
    return calorieEntries.value.filter(entry => isSameDay(selectedDate.value, entry.happenedAt));
  });

  async function getCalorieEntries() {
    calorieEntries.value = await db.calorieEntries
      .where('happenedAt')
      .between(
        startOfDay(rangeStartDate.value),
        endOfDay(selectedDate.value)
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

      screen.value = null;
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