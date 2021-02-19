<template>
  <v-card>
    <v-card-title>
      <span class="font-wight-bold">Данные об оплате</span>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Поиск"
        single-line
        hide-details
      ></v-text-field>
      <v-btn text rounded small class="ml-5" @click="addnewpay">
        <v-icon left>add</v-icon>Добавить оплату
      </v-btn>
    </v-card-title>
    <v-data-table :headers="headers" :items="peoples" :search="search">
      <template #item.dateOfPayments="{item}">
        {{ formatDate(item.dateOfPayments) }}
      </template>
      <template #item.actions="{ item }">
        <v-icon class="mr-4" small @click="editPayment(item.id)">mdi-pencil</v-icon>
        <DialogModal
          title="Удалить приход?"
          name="Удалить"
          myEmit="deletePayment"
          @deletePayment="deletePayment(item.id)"
        ></DialogModal>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import DialogModal from '@/components/DialogModal.vue'
import { ALLPAYMENTS, DELPAYMENT } from '@/graphql/Payments/querys'
import utilDate from '@/utils/formatDate'

export default {
  components: { DialogModal },
  data: () => ({
    ...utilDate,
    search: '',
    headers: [
      { text: 'Адрес', value: 'address' },
      { text: 'Фамилия И.О.', value: 'name' },
      { text: 'Период год/кв', value: 'period' },
      { text: 'Дата оплаты', value: 'dateOfPayments' },
      { text: 'Сумма', value: 'summ' },
      { text: 'Операции', value: 'actions', sortable: false },
    ],
    peoples: [],
  }),
  apollo: {
    peoples: {
      query: ALLPAYMENTS,
      update: ({ getAllPayments }) => {
        let mass = []
        getAllPayments.map(el => {
          let temp = {
            id: el.id,
            summ: el.summ,
            dateOfPayments: el.dateOfPayments,
            period: el.year.toString() + ' / ' + el.quarter.trim().substr(0, 4) + '.',
            name: el.citizenId.name,
            address:
              el.houseId.sity + ', ул. ' + el.houseId.street + ', дом. ' + el.houseId.homenumber,
            citizenId: el.citizenId.id,
          }
          mass.push(temp)
        })

        return mass.sort((prev, next) => {
          if (prev.period < next.period) return -1
          if (prev.period > next.period) return 1
        })
      },
    },
  },
  methods: {
    editPayment(val) {
      this.$router.push(`/editpayment/${val}`)
    },
    addnewpay() {
      return this.$router.push('/addpayment')
    },
    deletePayment(el) {
      this.$apollo.mutate({
        mutation: DELPAYMENT,
        variables: {
          id: el,
        },
        update: (cache, { data: { delPayment } }) => {
          let data = cache.readQuery({ query: ALLPAYMENTS })
          data.getAllPayments = data.getAllPayments.filter(elem => elem.id != delPayment.id)
          cache.writeQuery({ query: ALLPAYMENTS, data })
        },
      })
      this.getChange()
    },
  },
}
</script>

<style lang="scss" scoped></style>
