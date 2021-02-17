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
              <v-layout
                ><v-flex>
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="dateFormatted"
                        label="День рождения"
                        prepend-icon="mdi-calendar"
                        readonly
                        @blur="birthday = parseDate(dateFormatted)"
                        v-on="on"
                        class="pr-6"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="birthday"
                      @input="menu = false"
                      locale="ru-RU"
                      :first-day-of-week="1"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex> <v-text-field label="Телефон" v-model="phone"></v-text-field> </v-flex
              ></v-layout>
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
  data: vm => ({
    name: '',
    phone: '',
    birthday: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    selected: { id: '' },
    items: [],
    menu: false,
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.birthday)
    },
  },

  watch: {
    birthday() {
      this.dateFormatted = this.formatDate(this.birthday)
    },
  },
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
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}.${month}.${year}`
    },
    parseDate(date) {
      if (!date) return null

      const [day, month, year] = date.split('.')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
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
