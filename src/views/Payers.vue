<template>
  <v-card>
    <v-card-title>
      <span class="font-wight-bold">Домовладения улицы Малиновая</span>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Поиск"
        single-line
        hide-details
      ></v-text-field>
      <v-btn text rounded small class="ml-5" @click="addnewperson">
        <v-icon left>add</v-icon>Добавить жителя
      </v-btn>
    </v-card-title>
    <v-data-table :headers="headers" :items="massiv" :search="search">
      <template #item.actions="{ item }">
        <v-icon class="mr-4" small @click="editPerson(item.id)">mdi-pencil</v-icon>
        <DialogModal
          title="Удалить информацию о жителе?"
          name="Удалить"
          myEmit="deleteCitizen"
          @deleteCitizen="deleteCitizen(item.id)"
        ></DialogModal>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import DialogModal from '../components/DialogModal'
import { GETCITIZENBYID, ALLCITIZENS } from '../graphql/Citizens/querys'
// import { DELCITIZENBYID, ALLCITIZENS, GETCITIZENBYID } from '../graphql/Citizens/querys'

export default {
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Фамилия И.О.',
          align: 'start',
          value: 'name',
        },
        { text: 'Адрес', value: 'address' },
        { text: 'Телефон', value: 'phone' },
        { text: 'Дата рождения', value: 'birthday' },
        { text: 'Операции', value: 'actions' },
      ],
    }
  },
  components: {
    DialogModal,
  },
  methods: {
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}.${month}.${year}`
    },
    editPerson(val) {
      this.$router.push(`/EditPerson/${val}`)
    },
    addnewperson() {
      return this.$router.push('/addperson')
    },
    async deleteCitizen(el) {
      let payId = await this.$apollo
        .query({
          query: GETCITIZENBYID,
          variables: {
            id: el,
          },
        })
        .then(res =>
          res.data.getCitizenWithPays.payments.map(el => {
            return el.id
          }),
        )
      console.log(payId)
    },
    //   if (payId.length > 0) {
    //     alert('Удаление невозможно! Есть связанные данные!')
    //     return
    //   }

    //   this.$apollo.mutate({
    //     mutation: DELCITIZENBYID,
    //     variables: {
    //       id: el,
    //     },
    //     update: (cache, { data: { delCitizen } }) => {
    //       let data = cache.readQuery({ query: ALLCITIZENS })
    //       data.getAllCitizen = data.getAllCitizen.filter(elem => elem.id != delCitizen.id)
    //       cache.writeQuery({ query: ALLCITIZENS, data })
    //     },
    //   })
    // },
  },

  apollo: {
    massiv: {
      query: ALLCITIZENS,
      update(data) {
        let result = data.getAllCitizen.map(val => {
          return {
            name: val.name,
            address:
              val.houseId.sity +
              ', str. ' +
              val.houseId.street +
              ', дом № ' +
              val.houseId.homenumber,
            phone: val.phone,
            birthday: this.formatDate(val.birthday),
            id: val.id,
          }
        })
        return result
      },
    },
  },
}
</script>

<style lang="scss" scoped></style>
