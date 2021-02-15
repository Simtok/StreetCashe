<template>
  <v-form>
    <v-container class="text-center"
      ><div class="display-3">Добавление оплаты (взнос)</div>
      <v-row justify="center">
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-select
                v-model="selected"
                :items="items"
                label="Фамилия И.О. / Адрес"
                item-text="name"
                item-value="citizenId"
                persistent-hint
                return-object
              ></v-select>
              <v-layout row wrap>
                <v-flex>
                  <v-select
                    v-model="year"
                    item-value="year"
                    item-text="year"
                    :items="yearValues"
                    label="За какой год"
                    max-width="50%"
                    min-width="50%"
                    class="px-4"
                  ></v-select>
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
                        label="Дата оплаты"
                        prepend-icon="mdi-calendar"
                        readonly
                        @blur="dateOfPayments = parseDate(dateFormatted)"
                        v-on="on"
                        class="px-4"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="dateOfPayments"
                      @input="menu = false"
                      locale="ru-RU"
                      :first-day-of-week="1"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex>
                  <v-select
                    v-model="quarter"
                    :items="quarterValues"
                    label="За какой квартал"
                    class="pr-4"
                  ></v-select>
                  <v-text-field class="pr-4" label="Сумма оплаты" v-model="summ"></v-text-field>
                </v-flex>
              </v-layout>

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
import { ALLCITIZENS } from '@/graphql/Citizens/querys'
import { ADDPAYMENT, ALLPAYMENTS } from '@/graphql/Payments/querys'
import dateFilter from '@/filters/dateFilter'

export default {
  data: vm => ({
    year: 0,
    yearValues: [],
    quarter: '',
    quarterValues: ['1 квартал', '2 квартал', '3 квартал', '4 квартал'],
    dateOfPayments: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu: false,
    modal: false,
    items: [],
    selected: { citizenId: '', houseId: '' },
    summ: '',
    test: null,
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.dateOfPayments)
    },
  },

  watch: {
    dateOfPayments() {
      this.dateFormatted = this.formatDate(this.dateOfPayments)
    },
  },
  async mounted() {
    for (let i = 2020; i <= 2030; i++) {
      this.yearValues.push(i)
    }
    this.year = +dateFilter(new Date(), 'year')
    let month = +dateFilter(new Date(), 'month')
    if (month <= 3) {
      this.quarter = '1 квартал'
    }
    if (month > 3 && month <= 6) {
      this.quarter = '2 квартал'
    }
    if (month > 6 && month <= 9) {
      this.quarter = '3 квартал'
    }
    if (month > 9) {
      this.quarter = '4 квартал'
    }

    this.items = await this.$apollo
      .query({
        query: ALLCITIZENS,
      })
      .then(res =>
        res.data.getAllCitizen.map(el => {
          return {
            name:
              el.name +
              ' / ' +
              el.houseId.sity +
              ', ул. ' +
              el.houseId.street +
              ', дом. ' +
              el.houseId.homenumber,
            citizenId: el.id,
            houseId: el.houseId.id,
          }
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
      return this.$router.push('/payments')
    },
    async submit() {
      let quarter = this.quarter
      let year = this.year
      let citizenId = this.selected.citizenId
      let houseId = this.selected.houseId
      let dateOfPayments = this.dateOfPayments
      let summ = this.summ

      await this.$apollo.mutate({
        mutation: ADDPAYMENT,
        variables: {
          dateOfPayments: dateOfPayments,
          summ: summ,
          citizenId: citizenId,
          houseId: houseId,
          quarter: quarter,
          year: year,
        },
        update: (cache, { data: { addPayment } }) => {
          let data = cache.readQuery({ query: ALLPAYMENTS })

          data.getAllPayments.push(addPayment)

          cache.writeQuery({ query: ALLPAYMENTS, data })
          return this.$router.push('/payments')
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
