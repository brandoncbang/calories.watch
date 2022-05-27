<template>
  <div class="flex flex-col h-screen max-w-screen-md px-4 py-3 pb-24 mx-auto">
    <template v-if="!screen">
      <div class="flex flex-col flex-1 max-h-full">
        <div class="flex justify-between mb-4 text-3xl">
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
            :start-date="dateRangeStart"
            :end-date="selectedDate"
            :limit="settings.dailyLimit || null"
        />
        <div class="flex justify-center mt-2 space-x-4 text-sm">
          <label>
            <input type="radio" v-model="dateRangeLengthInDays" value="7" />
            <span class="ml-1">1W</span>
          </label>
          <label>
            <input type="radio" v-model="dateRangeLengthInDays" value="30" />
            <span class="ml-1">1M</span>
          </label>
          <label>
            <input type="radio" v-model="dateRangeLengthInDays" value="365" />
            <span class="ml-1">1Y</span>
          </label>
          <label>
            <input type="radio" v-model="dateRangeLengthInDays" value="1825" />
            <span class="ml-1">Max</span>
          </label>
        </div>

        <h2 class="mt-6 text-2xl">Entries</h2>
        <CalorieEntriesList
            class="flex-grow"
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
      </div>     
    </template>

    <template v-if="screen === 'form'">
      <CalorieEntryForm
          @saved="createCalorieEntry"
          @canceled="screen = null; calorieEntryToEdit = null"
          :entry-to-edit="calorieEntryToEdit"
          :selected-date="selectedDate"
      />
    </template>

    <template v-if="screen === 'settings'">
      <form @submit.prevent="saveSettings">
        <h2 class="text-2xl">Settings</h2>
        <p class="mt-4">
          <Field
              v-model.lazy.number="settings.dailyLimit"
              type="number"
              label="Daily Limit"
          />
        </p>
      </form>
    </template>

    <template v-if="screen === 'about'">
      <About />
    </template>

    <div class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-800">
      <div class="flex max-w-screen-md p-1 mx-auto space-x-1 justify-evenly">
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
  import About from './components/About.vue';

  import { reactive, ref, Ref, computed, watchEffect, watch } from 'vue';
  import { db, ICalorieEntry } from './db';
  import { startOfDay, endOfDay, isSameDay, sub } from 'date-fns';

  const screen: Ref<'form' | 'settings' | 'about' | null> = ref(null);

  const selectedDate = ref(startOfDay(new Date()));

  // TODO: Make graph component determine x axis based on range length (show by day, month, etc.)

  const dateRangeLengthInDays = ref<7 | 30 | 365 | 1825>(7);

  const dateRangeStart = computed(() => {
    return sub(selectedDate.value, {
      days: dateRangeLengthInDays.value,
    });
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
    if (!dateRangeStart.value) {
      calorieEntries.value = await db.calorieEntries.toCollection().sortBy('happenedAt');
      return;
    }

    calorieEntries.value = await db.calorieEntries
      .where('happenedAt')
      .between(
        startOfDay(dateRangeStart.value),
        endOfDay(selectedDate.value)
      )
      .sortBy('happenedAt');
  }

  async function createCalorieEntry(data: ICalorieEntry) {
    if (data.id) {
      updateCalorieEntry(data);
      return;
    }

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

  const calorieEntryToEdit = ref<ICalorieEntry | null>(null);

  async function editCalorieEntry(id: number) {
    try {
      calorieEntryToEdit.value = await db.calorieEntries.get(id) ?? null;

      screen.value = 'form';
    } catch (error) {
      console.log(error);
    }
  }

  async function updateCalorieEntry(data: ICalorieEntry) {
    try {
      db.calorieEntries.put({
        id: data.id,
        amount: data.amount,
        title: data.title,
        happenedAt: data.happenedAt,
      });

      calorieEntryToEdit.value = null;
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