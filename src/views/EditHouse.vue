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
              <v-btn class="mr-4" @click="submit">Изменить</v-btn>
              <v-btn @click="clear">Отмена</v-btn>
            </v-col>
          </v-row>
        </v-col></v-row
      >
    </v-container>
  </v-form>
</template>

<script>
import { EDITHOUSE, GETHOUSE } from '@/graphql/Houses/querys'

export default {
  props: ['id'],
  data: () => ({
    sity: '',
    street: '',
    homenumber: '',
  }),
  async mounted() {
    let temp = await this.$apollo.query({
      query: GETHOUSE,
      variables: {
        id: this.id,
      },
      fetchPolicy: 'network-only',
    })

    this.sity = temp.data.getHouse.sity
    this.street = temp.data.getHouse.street
    this.homenumber = temp.data.getHouse.homenumber
  },
  methods: {
    clear() {
      this.$router.push('/buildings')
    },
    submit() {
      this.$apollo.mutate({
        mutation: EDITHOUSE,
        variables: {
          id: this.id,
          sity: this.sity,
          street: this.street,
          homenumber: this.homenumber,
        },
        update: () => {
          return this.$router.push('/buildings')
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
