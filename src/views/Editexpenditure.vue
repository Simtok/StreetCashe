<template>
  <v-form>
    <v-container class="text-center"
      ><div class="display-3">Корректировка расхода</div>
      <v-row justify="center">
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-text-field label="Назначение расхода" v-model="name"></v-text-field>
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
import dataUtils from '@/utils/formatDate'

export default {
  props: ['id'],
  data: () => ({
    ...dataUtils,
    name: '',
    summOfExpenditure: '',
    dateOfExpenditure: null,
    dateFormatted: null,
    menu: false,
    modal: false,
  }),
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.dateOfExpenditure)
    },
  },

  watch: {
    dateOfExpenditure() {
      this.dateFormatted = this.formatDate(this.dateOfExpenditure)
    },
  },
  async mounted() {
    await this.$apollo
      .query({
        query: GETEXPENSEBYID,
        variables: {
          id: this.id,
        },
        fetchPolicy: 'network-only',
      })
      .then(res => {
        let val = res.data.getExpense
        this.name = val.name
        this.summOfExpenditure = val.summOfExpenditure
        this.dateOfExpenditure = val.dateOfExpenditure
      })
  },
  methods: {
    clear() {
      return this.$router.push('/expenses')
    },

    submit() {
      let myId = this.id
      let name = this.name
      let date = this.dateOfExpenditure
      let summ = this.summOfExpenditure

      this.$apollo.mutate({
        mutation: EDITEXPENSEBYID,
        variables: {
          id: myId,
          name: name,
          dateOfExpenditure: date,
          summOfExpenditure: summ,
        },
        update: () => {
          return this.$router.push('/expenses')
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
