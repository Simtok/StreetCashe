<template>
  <v-form>
    <v-container class="text-center"
      ><div class="display-3">Добавить строение</div>
      <v-row justify="center">
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-text-field label="Город" v-model="sity"></v-text-field>
              <v-text-field label="Улица" v-model="street"></v-text-field>
              <v-text-field label="Номер дома" v-model="homenumber"></v-text-field>
              <v-btn class="mr-4" @click="submit">Добавить</v-btn>
              <v-btn @click="clear">Отмена</v-btn>
            </v-col>
          </v-row>
        </v-col></v-row
      >
    </v-container>
  </v-form>
</template>

<script>
import { ADDHOUSE, ALLHOUSES } from '@/graphql/Houses/querys'
export default {
  data: () => ({
    sity: 'Суздаль',
    street: 'Малиновая',
    homenumber: '',
  }),
  methods: {
    clear() {
      this.$router.push('/buildings')
    },
    submit() {
      this.$apollo.mutate({
        mutation: ADDHOUSE,
        variables: {
          sity: this.sity,
          street: this.street,
          homenumber: this.homenumber,
        },
        update: (cache, { data: { addHouse } }) => {
          let data = cache.readQuery({ query: ALLHOUSES })
          data.getAllHouses.push(addHouse)
          cache.writeQuery({ query: ALLHOUSES, data })
          return this.$router.push('/buildings')
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
