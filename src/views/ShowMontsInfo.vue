<template>
  <div>
    <v-row justify="center">
      <v-col cols="6">
        <v-card>
          <v-card-title>
            <span class="font-wight-bold"
              >Информация по платежам за {{ this.quarter }} {{ this.$store.getters.getYear }}.</span
            >
          </v-card-title>
          <v-data-table :headers="paymentHeader" :items="paymentData"></v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ALLPAYMENTS } from '@/graphql/Payments/querys'
import dateFilter from '@/filters/dateFilter'

export default {
  props: ['quarter'],
  data: () => ({
    paymentData: [],
    paymentHeader: [
      { text: 'Плательщик', value: 'payer' },
      { text: 'Адрес', value: 'address' },
      { text: 'Дата', value: 'dayOfPayment' },
      { text: 'Сумма', value: 'income' },
    ],
  }),
  methods: {},
  async created() {
    let year = this.$store.getters.getYear
    let quarter = this.quarter

    let payments = await this.$apollo
      .query({
        query: ALLPAYMENTS,
      })
      .then(res =>
        res.data.getAllPayments.filter(u => {
          return dateFilter(new Date(u.dateOfPayments), 'year') === year && u.quarter === quarter
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
  },
}
</script>

<style lang="scss" scoped></style>
