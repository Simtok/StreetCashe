<template>
  <v-form>
    <v-container class="text-center"
      ><div class="display-3">Корректировка данных жителя {{ id }}</div>
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
import { GETCITIZENBYID, EDITCITIZENBYID } from '@/graphql/Citizens/querys'
import { ALLHOUSES } from '@/graphql/Houses/querys'

//  ALLCITIZENS,

export default {
  props: ['id'],
  data: () => ({
    name: '',
    phone: '',
    birthday: null,
    dateFormatted: null,
    selected: { id: '' },
    items: [],
    menu: false,
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.dateOfPayments)
    },
  },

  watch: {
    birthday() {
      this.dateFormatted = this.formatDate(this.birthday)
    },
  },
  async mounted() {
    await this.$apollo
      .query({
        query: GETCITIZENBYID,
        variables: {
          id: this.id,
        },
        fetchPolicy: 'network-only',
      })
      .then(res => {
        let temp = res.data.getCitizen

        this.name = temp.name
        this.phone = temp.phone
        this.birthday = temp.birthday
        this.selected.id = temp.houseId.id
      })

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
      let myId = this.id
      let name = this.name
      let birthday = this.birthday
      let phone = this.phone
      let houseId = +this.selected.id
      this.$apollo.mutate({
        mutation: EDITCITIZENBYID,
        variables: {
          id: myId,
          name: name,
          birthday: birthday,
          phone: phone,
          houseId: houseId,
        },
        update: () => {
          // cache, { data: { editCitizen } }
          // let data = cache.readQuery({ query: ALLCITIZENS })
          // data.getAllCitizen.map(elem => {
          //   if (elem.id === editCitizen.id) {
          //     elem = editCitizen
          //   }
          // })
          // cache.writeQuery({ query: ALLCITIZENS, data })
          return this.$router.push('/payers')
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
