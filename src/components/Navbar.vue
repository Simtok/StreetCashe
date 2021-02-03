<template>
  <nav>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span class="braun--text darken-4 display-1"
          >Малиновая - Финансы : {{ date | dateFilter() }}</span
        >
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!--Dropdown menu -->

      <span class="pr-6" v-if="$store.state.authorize.tocken">
        Login as { {{ $store.state.authorize.name }} }
      </span>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" class="mr-3">
            <v-icon left>expand_more</v-icon>
            <span class="wihte--text">Меню</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index" :to="item.route">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn @click="exit">
        <v-icon>exit_to_app</v-icon>
        <span color="white--text">Выйти</span>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer">
      <v-subheader class="text-uppercase font-weight-bold text-h5 pt-8 pb-16">Опции</v-subheader>
      <v-list-item v-for="(item, index) in items" :key="index" :to="item.route">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import items from '@/js/items.js'
export default {
  data() {
    return {
      date: new Date(),
      drawer: true,
      items: items,
    }
  },
  mounted() {
    setInterval(() => {
      this.date = new Date()
    }, 1000)
  },
  methods: {
    exit() {
      return this.$router.push('/login')
    },
  },
}
</script>

<style scoped></style>
