<template>
  <div class="home text-center ">
    <h1>
      Сводный баланс (доход - расход) :
      <span :class="saldo >= 0 ? 'norm' : 'problem'">{{ saldo }}</span>
    </h1>

    <v-row justify="space-around">
      <v-col cols="4">
        <v-card>
          <v-card-title>
            <span class="font-wight-bold">Сводная информация по годам.</span></v-card-title
          >
          <v-data-table :headers="leftHeaders" :items="yearsData">
            <template #item.remains="{ item }">
              <span :class="item.yearIncome > item.yearConsumption ? 'norm' : 'problem'">
                {{ (item.yearIncome - item.yearConsumption).toFixed(2) }}
              </span>
            </template>
            <template #item.actions="{ item }">
              <v-icon class="mr-2" small @click="onClickRow(item)">mdi-pencil</v-icon>
            </template>
          </v-data-table>
        </v-card></v-col
      >

      <v-col cols="8" class="theme--light v-sheet" outlined>
        <v-card>
          <v-card-title>
            <span class="font-wight-bold"
              >Сводная информация за {{ $store.getters.getYear }} год</span
            >
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Поиск"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="year_data" :search="search">
            <template #item.month="{item}">
              {{ monthName[item.month] }}
            </template>
            <template #item.remains="{ item }">
              <span :class="item.income > item.consumption ? 'norm' : 'problem'">
                {{ (item.income - item.consumption).toFixed(2) }}
              </span>
            </template>
            <template #item.actions="{ item }">
              <v-icon class="mr-2" small @click="showMonth(item.month)">mdi-pencil</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
import { ALLPAYMENTS } from '@/graphql/Payments/querys'
import { ALLEXPENSES } from '@/graphql/Expenses/querys'
import dateFilter from '@/filters/dateFilter'
import mn from '@/utils/monthName'

export default {
  name: 'Home',
  methods: {
    showMonth(val) {
      this.$router.push(`/monthinfo/${val}`)
    },
    get_item() {
      return 'item.remains'
    },
    async onClickRow(data) {
      this.year_data.length = 0
      let year = ''

      let check = data === Object(data)

      if (check) {
        year = data.year
      } else {
        year = data
      }

      let paymentsByYear = {}
      let expencesByYear = {}

      let expenses = await this.$apollo
        .query({
          query: ALLEXPENSES,
        })
        .then(res =>
          res.data.getAllExpense.filter(
            u => dateFilter(new Date(u.dateOfExpenditure), 'year') === year,
          ),
        )

      let payments = await this.$apollo
        .query({
          query: ALLPAYMENTS,
        })
        .then(res =>
          res.data.getAllPayments.filter(
            u => dateFilter(new Date(u.dateOfPayments), 'year') === year,
          ),
        )

      payments.map(v => {
        let month = dateFilter(new Date(v.dateOfPayments), 'month')
        let payment = +v.summ
        if (month in paymentsByYear) paymentsByYear[month] += payment
        else paymentsByYear[month] = payment
      })

      expenses.map(v => {
        let month = dateFilter(new Date(v.dateOfExpenditure), 'month')
        let expense = +v.summOfExpenditure
        if (month in expencesByYear) expencesByYear[month] += expense
        else expencesByYear[month] = expense
      })

      let monthByYear = Object.keys(paymentsByYear).concat(Object.keys(expencesByYear))
      monthByYear = [...new Set(monthByYear)].sort()

      for (let i = 0; i < monthByYear.length; i++) {
        let month = monthByYear[i]
        let payment = paymentsByYear[month] || 0
        let expence = expencesByYear[month] || 0
        let item = {
          month: month,
          income: payment,
          consumption: expence,
        }
        this.year_data.push(item)
      }

      this.$store.dispatch('set_year', year)
    },
  },

  data: () => ({
    monthName: mn,
    yearInfo: '',
    myStore: '',
    search: '',
    leftHeaders: [
      { text: 'Год', value: 'year' },
      { text: 'Доход', value: 'yearIncome' },
      { text: 'Расход', value: 'yearConsumption' },
      { text: 'Остаток', value: 'remains', sortable: false },
      { text: '', value: 'actions', sortable: false },
    ],
    yearsData: [],
    headers: [
      { text: 'Период', value: 'month' },
      { text: 'Доход', value: 'income' },
      { text: 'Расход', value: 'consumption' },
      { text: 'Остаток', value: 'remains', sortable: false },
      { text: '', value: 'actions', sortable: false },
    ],
    year_data: [],
    saldo: 0,
  }),
  async mounted() {
    let expenses = await this.$apollo
      .query({
        query: ALLEXPENSES,
      })
      .then(res => res.data.getAllExpense)

    let payments = await this.$apollo
      .query({
        query: ALLPAYMENTS,
      })
      .then(res => res.data.getAllPayments)

    let paymentsByYears = {}

    payments.map(v => {
      let year = dateFilter(new Date(v.dateOfPayments), 'year')
      let payment = +v.summ
      if (year in paymentsByYears) paymentsByYears[year] += payment
      else paymentsByYears[year] = payment
    })

    let expencesByYears = {}

    expenses.map(v => {
      let year = dateFilter(new Date(v.dateOfExpenditure), 'year')
      let expense = +v.summOfExpenditure
      if (year in expencesByYears) expencesByYears[year] += expense
      else expencesByYears[year] = expense
    })

    let years = Object.keys(paymentsByYears).concat(Object.keys(expencesByYears))
    years = [...new Set(years)].sort()

    for (let i = 0; i < years.length; i++) {
      let year = years[i]
      let payment = paymentsByYears[year] || 0
      let expence = expencesByYears[year] || 0
      let temp = +payment - +expence
      this.saldo += temp
      let item = {
        year: year,
        yearIncome: payment,
        yearConsumption: expence,
      }
      this.yearsData.push(item)
    }

    if (this.$store.getters.getYear == '') {
      this.$store.dispatch('set_year', years[0])
    }

    this.onClickRow(this.$store.getters.getYear)
  },
  computed: {
    mixData() {
      return this.dataList
    },
  },

  // apollo: {
  //   payers: {
  //     query: ALLCITIZENS,
  //     update(data) {
  //       return data.getAllCitizen
  //     },
  //   },

  //   expenses: {
  //     query: ALLEXPENSES,
  //     update(data) {
  //       return data.getAllExpense
  //     },
  //   },

  //   payments: {
  //     query: ALLPAYMENTS,
  //     update(data) {
  //       return data.getAllPayments
  //     },
  //   },
  // },
}
</script>

<style scoped>
.problem {
  color: red;
}
.norm {
  color: green;
}
</style>
