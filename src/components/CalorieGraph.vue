<template>
  <canvas ref="canvasElement" height="200" class="w-full"></canvas>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import Chart from 'chart.js/auto';
  import annotationPlugin, { LineAnnotationOptions } from 'chartjs-plugin-annotation';
  import { eachDayOfInterval, format, isSameDay } from 'date-fns';
  import { ICalorieEntry } from '../db';

  interface Props {
    calorieEntries: ICalorieEntry[];
    startDate: Date;
    endDate: Date;
    limit?: number;
  }

  const props = defineProps<Props>();

  const canvasElement = ref<HTMLCanvasElement | null>(null);

  interface ICalorieTotal {
    amount?: number | null;
    date: Date;
  }

  const dailyCalorieTotals = computed(() => {
    let dates = eachDayOfInterval({
      start: new Date(props.startDate),
      end: new Date(props.endDate),
    })

    let result: ICalorieTotal[] = dates.map(date => {
      return {
        amount: null,
        date: date,
      }
    });

    for (const entry of props.calorieEntries) {
      if (result.some((total) => isSameDay(total.date, entry.happenedAt))) {
        let matchingDailyTotal = result.filter((total) => isSameDay(total.date, entry.happenedAt))[0];
        
        if (!matchingDailyTotal.amount) {
          matchingDailyTotal.amount = 0;
        }

        matchingDailyTotal.amount += entry.amount;
      }
    }

    return result;
  });

  function getLabels(): string[] {
    return dailyCalorieTotals.value.map(total => {
      return format(total.date, 'M/d');
    });
  }

  function getData(): (number | null | undefined)[] {
    return dailyCalorieTotals.value.map(total => total.amount);
  }

  onMounted(() => {
    if (!canvasElement.value) return;

    Chart.register(annotationPlugin);

    const chart = new Chart(canvasElement.value, {
      type: 'line',
      data: {
        labels: getLabels(),
        datasets: [
          {
            label: 'Daily Calorie Intake',
            data: getData(),
            fill: false,
            borderColor: 'rgb(30, 41, 59)',
            backgroundColor: 'rgb(30, 41, 59)',
            tension: 0,
            pointRadius: 3,
            spanGaps: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          }
        },
        plugins: {
          annotation: {
            annotations: {
              limit: {
                type: 'line',
                yMin: props.limit ?? 0,
                yMax: props.limit ?? 0,
                borderColor: 'rgba(220, 38, 38, 0.75)',
                borderWidth: 2,
                drawTime: 'beforeDatasetsDraw',
                display: props.limit !== null,
              }
            }
          }
        }
      }
    });

    watch(props, (newProps, oldProps) => {
      chart.data.datasets[0].data = getData();
      chart.data.labels = getLabels();

      let limitAnnotation = chart.options.plugins?.annotation?.animations?.limit as LineAnnotationOptions;

      if (limitAnnotation && newProps.limit) {
        limitAnnotation.yMin = newProps.limit;
        limitAnnotation.yMax = newProps.limit;
      };

      chart.update();
    });
  });
</script>