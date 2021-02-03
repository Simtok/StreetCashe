<template>
  <v-app>
    <Navbar></Navbar>
    <v-main class="mx-8 mt-10">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '../components/Navbar'
export default {
  components: {
    Navbar,
  },
}
</script>
