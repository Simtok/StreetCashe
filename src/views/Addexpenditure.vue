<template>
  <v-form>
    <v-container class="text-center"
      ><div class="display-3">Добавление расхода</div>
      <v-row justify="center">
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-text-field label="Назначение расхода" v-model="nameOfExpenditure"></v-text-field>
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
                    v-model="dateFormatted"
                    label="Дата оплаты"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    @blur="dateOfExpenditure = parseDate(dateFormatted)"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dateOfExpenditure"
                  @input="menu = false"
                  locale="ru-RU"
                  :first-day-of-week="1"
                ></v-date-picker>
              </v-menu>
              <v-text-field label="Сумма оплаты" v-model="summOfExpenditure"></v-text-field>
              <v-btn class="mr-4" @click="submit">Добавить</v-btn>
              <v-btn @click="clear">Отмена</v-btn>
            </v-col>
          </v-row>
        </v-col></v-row
      >
    </v-container>
  </v-form>
</template>

<script>
import { ADDEXPENSE, ALLEXPENSES } from '@/graphql/Expenses/querys'
import utilDate from '@/utils/formatDate'

export default {
  data: () => ({
    ...utilDate,
    nameOfExpenditure: '',
    dateOfExpenditure: '',
    dateFormatted: '',
    summOfExpenditure: '',
    menu: false,
    modal: false,
  }),
  computed: {
    check() {
      return this.formatDate(this.dateOfExpenditure)
    },
  },
  watch: {
    dateOfExpenditure() {
      this.dateFormatted = this.formatDate(this.dateOfExpenditure)
    },
  },

  methods: {
    clear() {
      return this.$router.push('/expenses')
    },
    submit() {
      let name = this.nameOfExpenditure
      let dateOfExpenditure = this.dateOfExpenditure
      let summOfExpenditure = this.summOfExpenditure

      this.$apollo.mutate({
        mutation: ADDEXPENSE,
        variables: {
          name: name,
          dateOfExpenditure: dateOfExpenditure,
          summOfExpenditure: summOfExpenditure,
        },
        update: (cache, { data: { addExpense } }) => {
          let data = cache.readQuery({ query: ALLEXPENSES })
          data.getAllExpense.push(addExpense)
          cache.writeQuery({ query: ALLEXPENSES, data })
          return this.$router.push('/expenses')
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
