import { Reactive, reactive, watch } from "vue";

export type Settings = {
  dailyLimit: number | null;
};

const defaultSettings: Settings = {
  dailyLimit: null,
};

export function useSettings(): Reactive<Settings> {
  if (window.localStorage.getItem("settings") === null) {
    window.localStorage.setItem("settings", JSON.stringify(defaultSettings));
  }

  const settings = reactive(
    JSON.parse(window.localStorage.getItem("settings")!) as Settings,
  );

  watch(settings, (value) => {
    window.localStorage.setItem("settings", JSON.stringify(value));
  });

  return settings;
}
