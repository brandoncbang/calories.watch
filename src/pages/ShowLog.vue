<script setup lang="ts">
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/vue/solid";
import DatePicker from "../components/forms/DatePicker.vue";
import CalorieGraph from "../components/CalorieGraph.vue";
import { computed, Ref, ref, watchEffect } from "vue";
import {
  addDays,
  endOfDay,
  isSameDay,
  startOfDay,
  sub,
  subDays,
} from "date-fns";
import { db, ICalorieEntry } from "../helpers/db";
import CalorieEntriesList from "../components/CalorieEntriesList.vue";
import CalorieTotal from "../components/CalorieTotal.vue";
import { useSettings } from "../helpers/settings";
import { useRoute } from "vue-router";
import { formatDate, parseDate } from "../helpers/date";

// const selectedDate = ref(startOfDay(new Date()));

const route = useRoute();

const selectedDate = computed(() => {
  return parseDate(route.params.date as string);
});

const settings = useSettings();

// TODO: Make graph component determine x axis based on range length (show by day, month, etc.)

const dateRangeLengthInDays = ref<7 | 30 | 365 | 1825>(7);

const dateRangeStart = computed(() => {
  return sub(selectedDate.value, {
    days: dateRangeLengthInDays.value,
  });
});

const calorieEntries: Ref<ICalorieEntry[]> = ref([]);

const calorieEntriesFromSelectedDate = computed(() => {
  return calorieEntries.value.filter((entry) =>
    isSameDay(selectedDate.value, entry.happenedAt),
  );
});

async function getCalorieEntries() {
  if (!dateRangeStart.value) {
    calorieEntries.value = await db.calorieEntries
      .toCollection()
      .sortBy("happenedAt");
    return;
  }

  calorieEntries.value = await db.calorieEntries
    .where("happenedAt")
    .between(startOfDay(dateRangeStart.value), endOfDay(selectedDate.value))
    .sortBy("happenedAt");
}

watchEffect(() => {
  getCalorieEntries();
});
</script>

<template>
  <div class="flex flex-col flex-1 max-h-full">
    <div class="flex justify-between mb-4 text-3xl">
      <RouterLink
        :to="`/log/${formatDate(subDays(selectedDate, 1))}`"
        title="Previous Day"
      >
        <ArrowLeftIcon class="w-5 h-5" />
        <span class="sr-only">previous day</span>
      </RouterLink>

      <DatePicker v-model="selectedDate" />

      <RouterLink
        :to="`/log/${formatDate(addDays(selectedDate, 1))}`"
        title="Next Day"
      >
        <span class="sr-only">next day</span>
        <ArrowRightIcon class="w-5 h-5" />
      </RouterLink>
    </div>

    <CalorieGraph
      :calorie-entries="calorieEntries"
      :start-date="dateRangeStart"
      :end-date="selectedDate"
      :limit="settings.dailyLimit"
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
        :limit="settings.dailyLimit"
      />

      <Button @click="screen = 'form'">Create entry</Button>
    </div>
  </div>
</template>
