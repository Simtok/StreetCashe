<template>
  <v-form>
    <v-container class="text-center"
      ><div class="display-3">Авторизация пользователя</div>
      <v-row justify="center">
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-text-field
                label="Логин"
                v-model.trim="login"
                :rules="[required('E-mail'), email()]"
              ></v-text-field>

              <v-text-field
                label="Пароль"
                v-model.trim="password"
                counter
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPass = !showPass"
                :type="showPass ? 'text' : 'password'"
                :rules="[required('Пароль'), minlength('Пароль', 5)]"
              ></v-text-field>
              <v-btn class="mr-4" @click="submit">Войти</v-btn>
              <v-btn @click="register">Регистрация</v-btn>
            </v-col>
          </v-row>
        </v-col></v-row
      >
    </v-container>
  </v-form>
</template>

<script>
import gql from 'graphql-tag'
import validator from '@/utils/validations.js'

const CHECKUSER = gql`
  query($login: String!, $password: String!) {
    getAdmin(login: $login, password: $password) {
      id
      name
      login
      password
    }
  }
`

export default {
  data: () => ({
    showPass: false,
    ...validator,
    value: true,
    login: '',
    password: '',
  }),
  methods: {
    register() {
      return this.$router.push('/register')
    },

    async submit() {
      let login = this.login
      let password = this.password
      let resolve = await this.$apollo.query({
        query: CHECKUSER,
        variables: {
          login: login,
          password: password,
        },
      })
      if (resolve.data.getAdmin.login) {
        this.$store.dispatch('get_authorize', resolve.data.getAdmin)
      }

      return this.$router.push('/home')
    },
  },
}
</script>
