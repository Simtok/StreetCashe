<template>
  <v-dialog max-width="400px" v-model="dialog" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-icon small v-bind="attrs" v-on="on">
        mdi-delete
      </v-icon>
    </template>
    <v-card>
      <v-card-title>
        <h4>{{ title }}</h4>
      </v-card-title>
      <v-card-text>
        <h3>Запись будет удалена из базы данных!!!</h3>
      </v-card-text>
      <div class="py-2 ml-4">
        <v-btn class="error mr-4" @click="submit">Удалить</v-btn>
        <v-btn class="success" @click="dialog = false">Отмена</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: { name: String, title: String, myEmit: String },
  data: () => ({
    dialog: false,
  }),
  methods: {
    submit() {
      this.dialog = false
      this.$emit(this.myEmit)
    },
  },
}
</script>
