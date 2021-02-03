<template>
  <div>
    <v-row justify-center>
      <v-col cols="6">
        <v-card>
          <v-card-title>
            <span class="font-wight-bold"
              >Информация по платежам за {{ monthName[this.month] }}
              {{ this.$store.getters.getYear }}.</span
            >
          </v-card-title>
          <v-data-table :headers="paymentHeader" :items="paymentData"></v-data-table>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-title>
            <span class="font-wight-bold"
              >Информация по расходам за {{ monthName[this.month] }}
              {{ this.$store.getters.getYear }}.</span
            >
          </v-card-title>
          <v-data-table :headers="expensesHeader" :items="expensesData"></v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ALLPAYMENTS } from '@/graphql/Payments/querys'
import { ALLEXPENSES } from '@/graphql/Expenses/querys'
import dateFilter from '@/filters/dateFilter'
import mn from '@/utils/monthName'

export default {
  props: ['month'],
  data: () => ({
    monthName: mn,
    paymentData: [],
    expensesData: [],
    paymentHeader: [
      { text: 'Плательщик', value: 'payer' },
      { text: 'Адрес', value: 'address' },
      { text: 'Дата', value: 'dayOfPayment' },
      { text: 'Сумма', value: 'income' },
    ],
    expensesHeader: [
      { text: 'Дата', value: 'dayOfPayment' },
      { text: 'Сумма', value: 'consumption' },
      { text: 'Назначение расхода', value: 'target' },
    ],
  }),
  methods: {},
  async created() {
    let year = this.$store.getters.getYear
    let month = this.month

    let expenses = await this.$apollo
      .query({
        query: ALLEXPENSES,
      })
      .then(res =>
        res.data.getAllExpense.filter(u => {
          return (
            dateFilter(new Date(u.dateOfExpenditure), 'year') === year &&
            dateFilter(new Date(u.dateOfExpenditure), 'month') === month
          )
        }),
      )

    let payments = await this.$apollo
      .query({
        query: ALLPAYMENTS,
      })
      .then(res =>
        res.data.getAllPayments.filter(u => {
          return (
            dateFilter(new Date(u.dateOfPayments), 'year') === year &&
            dateFilter(new Date(u.dateOfPayments), 'month') === month
          )
        }),
      )

    this.paymentData = payments.map(v => {
      return {
        payer: v.citizenId.name,
        address: v.citizenId.address,
        dayOfPayment: v.dateOfPayments,
        income: v.summ,
      }
    })

    // value: 'dayOfPayment' },
    //       { text: 'Сумма', value: 'consumption' },
    //       { text: 'Назначение расхода', value: 'target' },
    //     ],
    this.expensesData = expenses.map(v => {
      return {
        dayOfPayment: v.dateOfExpenditure,
        consumption: v.summOfExpenditure,
        target: v.name,
      }
    })
  },
}
</script>

<style lang="scss" scoped></style>
