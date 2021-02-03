<template>
  <v-form>
    <v-container class="text-center"
      ><div class="display-3">Корректировка оплаты (взноса)</div>
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

              <v-btn class="mr-4" @click="submit">Корректировать</v-btn>
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
import { ALLPAYMENTS, EDITPAYMENT } from '@/graphql/Payments/querys'
import { GETCITIZEN, ALLCITIZENS } from '../graphql/Citizens/querys'

export default {
  props: ['id'],
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
    let myId = this.id

    let temp = await this.$apollo
      .query({
        query: GETCITIZEN,
        variables: {
          id: myId,
        },
      })
      .then(res => res.data.getPayWithCitizen)

    this.selected.id = temp[0].citizenId.id
    this.dateOfPayments = temp[0].dateOfPayments
    this.summ = temp[0].summ

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
      let id = this.id
      let dateOfPayments = this.dateOfPayments
      let summ = this.summ
      let citId = +this.selected.id
      await this.$apollo.mutate({
        mutation: EDITPAYMENT,
        variables: {
          id: id,
          dateOfPayments: dateOfPayments,
          summ: summ,
          citizenId: citId,
        },
        update: (cache, { data: { editPayment } }) => {
          let data = cache.readQuery({ query: ALLPAYMENTS })

          data.getAllPayments.map(elem => {
            if (elem.id === editPayment.id) {
              elem = editPayment
            }
          })
          cache.writeQuery({ query: ALLPAYMENTS, data })
          return this.$router.push('/payments')
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
