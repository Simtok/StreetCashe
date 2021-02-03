<template>
  <v-form>
    <v-container class="text-center"
      ><div class="display-3">Корректировка расхода --- {{ id }}</div>
      <v-row justify="center">
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-text-field label="Назначение расхода" v-model="massiv.name"></v-text-field>
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="massiv.dateOfExpenditure"
                    label="Дата оплаты"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="massiv.dateOfExpenditure"
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>

              <v-text-field label="Сумма оплаты" v-model="massiv.summOfExpenditure"></v-text-field>
              <v-btn class="mr-4" @click="submit">Изменить</v-btn>
              <v-btn @click="clear">Отмена</v-btn>
            </v-col>
          </v-row>
        </v-col></v-row
      >
    </v-container>
  </v-form>
</template>

<script>
import { GETEXPENSEBYID, EDITEXPENSEBYID } from '@/graphql/Expenses/querys'

export default {
  props: ['id'],
  data: () => ({
    massiv: { name: '', dateOfExpenditure: '', summOfExpenditure: '' },
    menu: false,
    modal: false,
  }),
  async mounted() {
    let myId = this.id
    this.massiv = await this.$apollo
      .query({
        query: GETEXPENSEBYID,
        variables: {
          id: myId,
        },
      })
      .then(res => res.data.getExpense)
  },
  methods: {
    clear() {
      return this.$router.push('/expenses')
    },

    submit() {
      let myId = this.id
      let name = this.massiv.name
      let date = this.massiv.dateOfExpenditure
      let summ = this.massiv.summOfExpenditure

      this.$apollo.mutate({
        mutation: EDITEXPENSEBYID,
        variables: {
          id: myId,
          name: name,
          dateOfExpenditure: date,
          summOfExpenditure: summ,
        },
        update: () => {
          // let data = cache.readQuery({ query: ALLEXPENSES })
          // console.log('Data before - ', data)
          // data.getAllExpense.map(elem => {
          //   if (elem.id === editExpense.id) {
          //     elem = editExpense
          //   }
          // })
          // console.log('Data after - ', data)
          // cache.writeQuery({ query: ALLEXPENSES, data })
          return this.$router.push('/expenses')
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
