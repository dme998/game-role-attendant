const routes = [
  {
    path: "/result",
    component: () => import("pages/RoleResultPage.vue"),
  },

  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },

  {
    path: "/host",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/HostPage.vue") }],
  },

  {
    path: "/join",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/JoinPage.vue") }],
  },

  {
    path: "/lobby/:roomCode",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/LobbyPage.vue") }],
    props: true,
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
