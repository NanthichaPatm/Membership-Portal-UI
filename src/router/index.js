import { createRouter, createWebHistory } from "vue-router";
import ProfileView from "../views/Profile.vue";
import BenefitView from "../views/Benefit.vue";
import ActivityView from "../views/Activity.vue";
import AboutView from "@/views/AboutView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: AboutView,
    },
    {
      path: "/account",
      name: "profile",
      component: ProfileView,
    },
    {
      path: "/benefit",
      name: "benefit",
      component: BenefitView,
    },
    {
      path: "/activities",
      name: "activities",
      component: ActivityView,
    },
  ],
});

export default router;
