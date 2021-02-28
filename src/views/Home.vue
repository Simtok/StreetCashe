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

      <v-col cols="3" class="theme--light v-sheet" outlined>
        <v-card>
          <v-card-title>
            <span class="font-wight-bold"
              >Сводная информация по оплате за {{ $store.getters.getYear }} год</span
            >
          </v-card-title>
          <v-data-table :headers="payHeader" :items="year_data">
            <template #item.actions="{ item }">
              <v-icon class="mr-2" small @click="showQuarter(item.quarter)">mdi-pencil</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <v-col cols="5" class="theme--light v-sheet" outlined>
        <v-card>
          <v-card-title>
            <span class="font-wight-bold"
              >Сводная информация по расходам за {{ $store.getters.getYear }} год</span
            >
          </v-card-title>
          <v-data-table :headers="expenseHeader" :items="expenseData">
            <template #item.dateOfExpenditure="{value}"> {{ formatDate(value) }} </template>
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
import { ALLHOUSES } from '@/graphql/Houses/querys'
import dateFilter from '@/filters/dateFilter'
import mn from '@/utils/monthName'
import utilDate from '@/utils/formatDate'

export default {
  name: 'Home',
  data: () => ({
    ...utilDate,
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
    expenseHeader: [
      { text: ' Назначение расхода', value: 'name' },
      { text: ' Дата оплаты', value: 'dateOfExpenditure' },
      { text: ' Сумма оплаты', value: 'summOfExpenditure' },
    ],
    expenseData: [],
    saldo: 0,
  }),
  methods: {
    showQuarter(val) {
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

      let houses = await this.$apollo
        .query({
          query: ALLHOUSES,
        })
        .then(res => {
          let temp = res.data.getAllHouses.filter(u => u.citizens.length > 0)

          return temp.length
        })

      let expenses = await this.$apollo
        .query({
          query: ALLEXPENSES,
        })
        .then(res =>
          res.data.getAllExpense.filter(
            u => dateFilter(new Date(u.dateOfExpenditure), 'year') === year,
          ),
        )

      this.expenseData = expenses.sort(
        (prev, next) => prev.dateOfExpenditure - next.dateOfExpenditure,
      )

      // expenses.map(v => {
      //   let month = dateFilter(new Date(v.dateOfExpenditure), 'month')
      //   let expense = +v.summOfExpenditure
      //   if (month in expencesByYear) expencesByYear[month] += expense
      //   else expencesByYear[month] = expense
      // })

      let paymentsByQuarter = {}

      let payments = await this.$apollo
        .query({
          query: ALLPAYMENTS,
        })
        .then(res => {
          return res.data.getAllPayments.filter(u => u.year.toString() === year)
        })

      if (payments.length > 0) {
        payments.map(v => {
          let quarter = v.quarter
          let pay = +v.summ
          let houseId = v.houseId.id
          if (quarter in paymentsByQuarter) {
            paymentsByQuarter[quarter].payment += pay
            paymentsByQuarter[quarter].houseId.push(houseId)
          } else {
            paymentsByQuarter[quarter] = {
              payment: pay,
              houseId: [houseId],
            }
          }
        })

        let quarters = Object.keys(paymentsByQuarter).sort()
        // quarters = [...new Set(quarters)].sort()

        for (let i = 0; i < quarters.length; i++) {
          let quarter = quarters[i]
          let payment = paymentsByQuarter[quarter].payment
          let countHouses = [...new Set(paymentsByQuarter[quarter].houseId)].length
          let statisic = houses + ' / ' + countHouses
          let item = {
            quarter: quarter,
            income: payment,
            statisic: statisic,
          }
          this.year_data.push(item)
        }
      } else this.year_data = []
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
      let year = v.year.toString()
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
