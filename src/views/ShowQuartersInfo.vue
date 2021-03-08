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
      <v-col cols="3">
        <v-card>
          <v-card-title>
            <span class="font-wight-bold"
              >Не заплатили за {{ this.quarter }} {{ this.$store.getters.getYear }}.</span
            >
          </v-card-title>
          <v-data-table :headers="noPayHeader" :items="noPaymentData">
            <template #item.payer="{ item }">
              <span :class="'problem'">
                {{ item.payer }}
              </span>
            </template>
            <template #item.address="{ item }">
              <span :class="'problem'">
                {{ item.address }}
              </span>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ALLPAYMENTS } from '@/graphql/Payments/querys'
import { ALLCITIZENS } from '@/graphql/Citizens/querys'

export default {
  props: ['quarter'],
  data: () => ({
    paymentData: [],
    noPaymentData: [],
    paymentHeader: [
      { text: 'Плательщик', value: 'payer' },
      { text: 'Адрес', value: 'address' },
      { text: 'Дата', value: 'dayOfPayment' },
      { text: 'Сумма', value: 'income' },
    ],
    noPayHeader: [
      { text: 'Плательщик', value: 'payer' },
      { text: 'Адрес', value: 'address' },
    ],
  }),
  methods: {},

  async created() {
    let year = this.$store.getters.getYear
    let quarter = this.quarter

    let citizens = await this.$apollo.query({
      query: ALLCITIZENS,
    })

    let payments = await this.$apollo
      .query({
        query: ALLPAYMENTS,
      })
      .then(res =>
        res.data.getAllPayments.filter(u => u.year.toString() === year && u.quarter === quarter),
      )

    let payers = []

    this.paymentData = payments.map(v => {
      payers.push(v.houseId.id)
      return {
        payer: v.citizenId.name,
        address: 'г. ' + v.houseId.sity + ', ул. ' + v.houseId.street + ', ' + v.houseId.homenumber,
        dayOfPayment: v.dateOfPayments,
        income: v.summ,
      }
    })

    //   things.thing = things.thing.filter((thing, index, self) =>
    //        index === self.findIndex((t) => (
    //           t.place === thing.place && t.name === thing.name
    // ))
    //   )

    this.noPaymentData = citizens.data.getAllCitizen
      .filter(u => !payers.includes(u.houseId.id))
      .filter((item, index, arr) => index === arr.findIndex(t => t.houseId.id === item.houseId.id))
      .map(v => {
        return {
          payer: v.name,
          address:
            'г. ' + v.houseId.sity + ', ул. ' + v.houseId.street + ', ' + v.houseId.homenumber,
        }
      })
  },
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
