<template>
  <v-app>
    <router-view />
    <v-footer color="#fc9652" class="py-0">
      <v-col
        class="text-center px-2 py-0 d-flex justify-space-between"
        cols="12"
      >
      <div>
        <router-link to="/term&conditions" style="font-size: 0.8rem; text-decoration: none;" class="py-0 pr-2 ma-0">Term of Services</router-link>
        <router-link to="/term&conditions" style="text-decoration: none; font-size: 0.8rem;" class="pa-0 ma-0">Help Center</router-link>
      </div>
      <p style="font-size: 0.8rem;" class="pa-0 ma-0">&#169;{{ new Date().getFullYear() }}</p>
      </v-col>
  </v-footer>
  </v-app>
</template>
