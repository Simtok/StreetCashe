<template>
  <v-form>
    <v-container class="text-center"
      ><div class="display-3">Добавление жителя</div>
      <v-row justify="center">
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-text-field label="Фамилия И.О." v-model="name"></v-text-field>
              <v-text-field label="Адрес" v-model="address"></v-text-field>
              <v-text-field label="Телефон" v-model="phone"></v-text-field>
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
import { ALLCITIZENS, ADDCITIZEN } from '@/graphql/Citizens/querys'

export default {
  data: () => ({
    name: '',
    address: '',
    phone: '',
  }),
  methods: {
    clear() {
      return this.$router.push('/payers')
    },
    submit() {
      let name = this.name
      let address = this.address
      let phone = this.phone
      this.$apollo.mutate({
        mutation: ADDCITIZEN,
        variables: {
          name: name,
          address: address,
          phone: phone,
        },
        update: (cache, { data: { addCitizen } }) => {
          let data = cache.readQuery({ query: ALLCITIZENS })
          data.getAllCitizen.push(addCitizen)
          cache.writeQuery({ query: ALLCITIZENS, data })
          return this.$router.push('/payers')
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
