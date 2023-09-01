import { createRouter, createWebHashHistory, RouterOptions } from "vue-router";
import compLists from "/packages/list.json";

const routes: any[] = [
  {
    path: "/",
    redirect: "/components/watermask",
  },
];

compLists.forEach((comp: any) => {
  routes.push({
    title: comp.compZhName,
    name: comp.compName,
    path: `/components/${comp.compName}`,
    component: () =>
      import(`/packages/components/${comp.compName}/docs/README.md`),
  });
});
console.log("routes", routes);

const routerConfig = {
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to: any, from: any) {
    if (to.path !== from.path) {
      return { top: 0 };
    }
  },
};

const router = createRouter(routerConfig as RouterOptions);
export default router;
