<template>
  <v-form>
    <v-container class="text-center"
      ><div class="display-3">Корректировка данных жителя {{ id }}</div>
      <v-row justify="center">
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-text-field label="Фамилия И.О." v-model="massiv.name"></v-text-field>
              <v-text-field label="Адрес" v-model="massiv.address"></v-text-field>
              <v-text-field label="Телефон" v-model="massiv.phone"></v-text-field>
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
import { ALLCITIZENS, GETCITIZENBYID, EDITCITIZENBYID } from '@/graphql/Citizens/querys'

export default {
  props: ['id'],
  data: () => ({
    massiv: { name: '', address: '', phone: '' },
  }),
  async mounted() {
    let myId = this.id
    this.massiv = await this.$apollo
      .query({
        query: GETCITIZENBYID,
        variables: {
          id: myId,
        },
      })
      .then(res => res.data.getCitizen)
  },
  methods: {
    clear() {
      return this.$router.push('/payers')
    },
    submit() {
      let myId = this.id
      let name = this.massiv.name
      let address = this.massiv.address
      let phone = this.massiv.phone
      this.$apollo.mutate({
        mutation: EDITCITIZENBYID,
        variables: {
          id: myId,
          name: name,
          address: address,
          phone: phone,
        },
        update: (cache, { data: { editCitizen } }) => {
          let data = cache.readQuery({ query: ALLCITIZENS })
          data.getAllCitizen.map(elem => {
            if (elem.id === editCitizen.id) {
              elem = editCitizen
            }
          })
          cache.writeQuery({ query: ALLCITIZENS, data })
          return this.$router.push('/payers')
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
