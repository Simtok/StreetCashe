<template>
  <v-form>
    <v-container class="text-center"
      ><div class="display-3">Добавление оплаты (взнос)</div>
      <v-row justify="center">
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-select
                v-model="selected"
                :items="items"
                label="Фамилия И.О. / Адрес"
                item-text="name"
                item-value="id"
                persistent-hint
                return-object
              ></v-select>
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
                    v-model="dateOfPayments"
                    label="Дата оплаты"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dateOfPayments" @input="menu = false"></v-date-picker>
              </v-menu>
              <v-text-field label="Сумма оплаты" v-model="summ"></v-text-field>

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
// import format from 'date-fns/format'
import { ALLCITIZENS } from '@/graphql/Citizens/querys'
import { ADDPAYMENT, ALLPAYMENTS } from '@/graphql/Payments/querys'

export default {
  data: () => ({
    dateOfPayments: '',
    menu: false,
    modal: false,
    items: [],
    selected: { id: '' },
    summ: '',
    test: null,
  }),
  async mounted() {
    this.items = await this.$apollo
      .query({
        query: ALLCITIZENS,
      })
      .then(res =>
        res.data.getAllCitizen.map(el => {
          return { name: el.name + ' / ' + el.address, id: el.id }
        }),
      )
  },

  // computed: {
  //   formatedDate() {
  //     return this.dateOfExpenditure ? format(this.dateOfExpenditure, 'd MMM yyyy') : ''
  //   },
  // },
  methods: {
    clear() {
      return this.$router.push('/payments')
    },
    async submit() {
      let id = this.selected.id
      let dateOfPayments = this.dateOfPayments
      let summ = this.summ
      await this.$apollo.mutate({
        mutation: ADDPAYMENT,
        variables: {
          dateOfPayments: dateOfPayments,
          summ: summ,
          citizenId: id,
        },
        update: (cache, { data: { addPayment } }) => {
          let data = cache.readQuery({ query: ALLPAYMENTS })

          data.getAllPayments.push(addPayment)

          cache.writeQuery({ query: ALLPAYMENTS, data })
          return this.$router.push('/payments')
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
