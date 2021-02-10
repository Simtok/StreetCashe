<template>
  <v-form>
    <v-container class="text-center"
      ><div class="display-3">Добавление жителя</div>
      <v-row justify="center">
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-text-field label="Фамилия И.О." v-model="name"></v-text-field>
              <v-select
                v-model="selected"
                :items="items"
                label="Адрес регистрации"
                item-text="name"
                item-value="id"
                persistent-hint
                return-object
              ></v-select>
              <v-text-field label="День рождения" v-model="birthday"></v-text-field>
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
import { ALLHOUSES } from '@/graphql/Houses/querys'

export default {
  data: () => ({
    name: '',
    phone: '',
    birthday: '',
    selected: { id: '' },
    items: [],
  }),
  async mounted() {
    this.items = await this.$apollo
      .query({
        query: ALLHOUSES,
      })
      .then(res =>
        res.data.getAllHouses.map(el => {
          return { name: el.sity + ', ул. ' + el.street + ', дом. ' + el.homenumber, id: el.id }
        }),
      )
  },
  methods: {
    clear() {
      return this.$router.push('/payers')
    },
    submit() {
      let name = this.name
      let phone = this.phone
      let birthday = this.birthday
      let houseId = this.selected.id
      this.$apollo.mutate({
        mutation: ADDCITIZEN,
        variables: {
          name: name,
          houseId: houseId,
          birthday: birthday,
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
