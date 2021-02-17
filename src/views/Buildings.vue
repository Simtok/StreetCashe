<template>
  <v-container class="text-center">
    <v-row justify="center">
      <v-col cols="8">
        <v-card>
          <v-card-title>
            <span class="font-wight-bold">Информация о зарегистрированных строенях</span>
            <v-spacer></v-spacer>

            <v-btn text rounded small class="ml-5" @click="addnewhouse">
              <v-icon left>add</v-icon>Добавить строение
            </v-btn>
          </v-card-title>
          <v-data-table :headers="head" :items="info">
            <template #item.actions="{ item }">
              <v-icon class="mr-4" small @click="editHouse(item.id)">mdi-pencil</v-icon>
              <DialogModal
                title="Удалить строение?"
                name="Удалить"
                myEmit="deleteHouse"
                @deleteHouse="del(item.id)"
              ></DialogModal>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ALLHOUSES, DELHOUSE, GETHOUSE } from '@/graphql/Houses/querys'
import DialogModal from '../components/DialogModal'

export default {
  components: {
    DialogModal,
  },
  data: () => ({
    info: [],
    head: [
      { text: 'Город', value: 'sity' },
      { text: 'Улица', value: 'street' },
      { text: 'Номер дома', value: 'homenumber' },
      { text: 'Операции', value: 'actions' },
    ],
  }),
  methods: {
    async del(el) {
      let check = await this.$apollo
        .query({
          query: GETHOUSE,
          variables: {
            id: el,
          },
        })
        .then(res => {
          console.log(res.data.getHouse.payments)
          return res.data.getHouse.payments.length + res.data.getHouse.citizens.length
        })

      if (check > 0) {
        alert('Удаление невозможно! Есть связанные данные!')
        return
      }
      this.$apollo.mutate({
        mutation: DELHOUSE,
        variables: {
          id: el,
        },
        update: (cache, { data: { delHouse } }) => {
          let data = cache.readQuery({ query: ALLHOUSES })
          data.getAllHouses = data.getAllHouses.filter(elem => elem.id != delHouse.id)
          cache.writeQuery({ query: ALLHOUSES, data })
        },
      })
    },
    editHouse(val) {
      this.$router.push(`/edithouse/${val}`)
    },
    addnewhouse() {
      this.$router.push('/addhouse')
    },
  },
  apollo: {
    info: {
      query: ALLHOUSES,
      update(data) {
        return data.getAllHouses
      },
    },
  },
}
</script>
