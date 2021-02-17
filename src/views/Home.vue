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
          <v-data-table :headers="summaryHeaders" :items="yearsData">
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

      <v-col cols="4" class="theme--light v-sheet" outlined>
        <v-card>
          <v-card-title>
            <span class="font-wight-bold"
              >Сводная информация по оплате за {{ $store.getters.getYear }} год</span
            >
          </v-card-title>
          <v-data-table :headers="payHeader" :items="year_data">
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
  data: () => ({
    monthName: mn,
    yearInfo: '',
    myStore: '',
    summaryHeaders: [
      { text: 'Год', value: 'year' },
      { text: 'Доход', value: 'yearIncome' },
      { text: 'Расход', value: 'yearConsumption' },
      { text: 'Остаток', value: 'remains', sortable: false },
      { text: '', value: 'actions', sortable: false },
    ],
    yearsData: [],
    payHeader: [
      { text: 'Период', value: 'quarter' },
      { text: 'Доход', value: 'income' },
      { text: 'Статистика', value: 'statisic' },
      { text: '', value: 'actions', sortable: false },
    ],
    year_data: [],
    saldo: 0,
  }),
  methods: {
    showMonth(val) {
      this.$router.push(`/monthinfo/${val}`)
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
        .then(res => {
          console.log(res, year)
          return res.data.getAllPayments.filter(u => u.year.toString() === year)
        })

      payments.map(v => {
        let quarter = v.quarter
        let payment = +v.summ
        if (quarter in paymentsByYear) paymentsByYear[quarter] += payment
        else paymentsByYear[quarter] = payment
      })

      console.log(payments)
      expenses.map(v => {
        let month = dateFilter(new Date(v.dateOfExpenditure), 'month')
        let expense = +v.summOfExpenditure
        if (month in expencesByYear) expencesByYear[month] += expense
        else expencesByYear[month] = expense
      })

      let monthByYear = Object.keys(paymentsByYear).sort()
      // monthByYear = [...new Set(monthByYear)].sort()

      for (let i = 0; i < monthByYear.length; i++) {
        let quarter = monthByYear[i]
        let payment = paymentsByYear[quarter]
        // let expence = expencesByYear[month] || 0
        let item = {
          quarter: quarter,
          income: payment,
        }
        this.year_data.push(item)
      }

      this.$store.dispatch('set_year', year)
    },
  },

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
    // mixData() {
    //   return this.dataList
    // },
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
