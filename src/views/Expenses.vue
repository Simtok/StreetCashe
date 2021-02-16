<template>
  <v-card>
    <v-card-title>
      <span class="font-wight-bold">Спиcок затрат по улице</span>
      <v-spacer></v-spacer>

      <v-btn text rounded small class="ml-5" @click="addnewExpenditure">
        <v-icon left>add</v-icon>Добавить расход
      </v-btn>
    </v-card-title>
    <v-data-table :headers="headers" :items="massiv">
      <template #item.dateOfExpenditure="{value}"> {{ formatDate(value) }} </template>
      <template #item.actions="{ item }">
        <v-icon class="mr-4" small @click="editExpenses(item.id)">mdi-pencil</v-icon>
        <DialogModal
          title="Удалить расход?"
          name="Удалить"
          myEmit="deleteExpense"
          @deleteExpense="deleteExpense(item.id)"
        ></DialogModal>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import DialogModal from '../components/DialogModal'
import { ALLEXPENSES, DELEXPENSEBYID } from '@/graphql/Expenses/querys'
import utilDate from '@/utils/formatDate'

export default {
  components: { DialogModal },
  data() {
    return {
      ...utilDate,
      massiv: [],
      headers: [
        { text: 'Цель затрат', value: 'name' },
        { text: 'Дата оплаты', value: 'dateOfExpenditure' },
        { text: 'Сумма', value: 'summOfExpenditure' },
        { text: 'Операции', value: 'actions' },
      ],
    }
  },
  methods: {
    editExpenses(val) {
      this.$router.push(`/editexpenditure/${val}`)
    },
    addnewExpenditure() {
      return this.$router.push('/addexpenditure')
    },
    deleteExpense(el) {
      this.$apollo.mutate({
        mutation: DELEXPENSEBYID,
        variables: {
          id: el,
        },
        update: (cache, { data: { delExpense } }) => {
          let data = cache.readQuery({ query: ALLEXPENSES })
          data.getAllExpense = data.getAllExpense.filter(elem => elem.id != delExpense.id)
          cache.writeQuery({ query: ALLEXPENSES, data })
        },
      })
    },
  },
  apollo: {
    massiv: {
      query: ALLEXPENSES,
      update(data) {
        return data.getAllExpense
      },
    },
  },
}
</script>

<style lang="scss" scoped></style>
