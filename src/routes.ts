import About from "./pages/About.vue";
import Settings from "./pages/Settings.vue";
import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
} from "vue-router";
import ShowLog from "./pages/ShowLog.vue";
import CreateEntry from "./pages/CreateEntry.vue";
import NotFound from "./pages/NotFound.vue";
import { isValid } from "date-fns";
import { parseDate } from "./helpers/date";

function validDateParam(name: string) {
  return (to: RouteLocationNormalized) => {
    const params =
      typeof to.params[name] === "string" ? [to.params[name]] : to.params[name];

    console.log(params);

    for (const date of params) {
      if (!isValid(parseDate(date))) {
        return false;
      }
    }
  };
}

const routes = [
  { path: "/", redirect: "/log/today" },
  { path: "/settings", component: Settings },
  { path: "/about", component: About },

  {
    path: "/log/:date",
    component: ShowLog,
    beforeEnter: [validDateParam("date")],
  },
  {
    path: "/log/:date/entries/create",
    component: CreateEntry,
    beforeEnter: [validDateParam("date")],
  },

  // { path: "/statistics", component: ShowStatistics },

  { path: "/:catchAll(.*)*", component: NotFound },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
