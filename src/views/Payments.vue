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

export default {
  components: { DialogModal },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Адрес', value: 'address' },
        { text: 'Фамилия И.О.', value: 'name' },
        { text: 'Период год/кв', value: 'period' },
        { text: 'Дата', value: 'dateOfPayments' },
        { text: 'Сумма', value: 'summ' },
        { text: 'Операции', value: 'actions' },
      ],
      peoples: [],
    }
  },
  async mounted() {
    let mass = await this.$apollo.query({
      query: ALLPAYMENTS,
    })
    mass.data.getAllPayments.map(el => {
      let temp = {
        id: el.id,
        summ: el.summ,
        dateOfPayments: el.dateOfPayments,
        period: el.year.toString() + ' / ' + el.quarter.trim().substr(0, 4) + '.',
        name: el.citizenId.name,
        address: el.houseId.sity + ', ул. ' + el.houseId.street + ', дом. ' + el.houseId.homenumber,
        citizenId: el.citizenId.id,
      }
      this.peoples.push(temp)
    })
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
    },
  },
}
</script>

<style lang="scss" scoped></style>
