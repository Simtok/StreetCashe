<template>
  <v-app>
    <component :is="getIt"> <router-view></router-view></component>
  </v-app>
</template>

<script>
import LoginPage from '@/Layouts/LoginPage.vue'
import MainPage from '@/Layouts/MainPage.vue'
export default {
  name: 'App',
  components: {
    LoginPage,
    MainPage,
  },
  computed: {
    getIt() {
      return (this.$route.meta.layout || 'login') + '-page'
    },
  },
  data: () => ({
    //
  }),
}
</script>

<style>
@import './css/main.css';
</style>
