<template>
  <v-form ref="form">
    <v-container class="text-center"
      ><div class="display-3">Регистрация пользователя</div>
      <v-row justify="center">
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-text-field
                label="Имя пользователя"
                v-model.trim="name"
                :rules="[required('Name')]"
                ref="name"
              ></v-text-field>

              <v-text-field
                label="Логин"
                v-model.trim="login"
                :rules="[required('E-mail'), email()]"
                ref="login"
              ></v-text-field>

              <v-text-field
                label="Пароль"
                v-model.trim="password"
                counter
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPass = !showPass"
                :type="showPass ? 'text' : 'password'"
                :rules="[required('Пароль'), minlength('Пароль', 5)]"
                ref="pass"
              ></v-text-field>
              <v-btn class="mr-4" @click="submit">Зарегистрировать</v-btn>
              <v-btn @click="clear">Отмена</v-btn>
            </v-col>
          </v-row>
        </v-col></v-row
      >
    </v-container>
  </v-form>
</template>

<script>
import validator from '@/utils/validations.js'
import gql from 'graphql-tag'

const ADDUSER = gql`
  mutation($name: String!, $login: String!, $password: String!) {
    addAdmin(name: $name, login: $login, password: $password) {
      name
      login
      password
    }
  }
`

const CHECKUSER = gql`
  query($login: String!) {
    getAdminByName(login: $login) {
      id
      name
      login
      password
    }
  }
`
export default {
  data: () => ({
    ...validator,
    showPass: false,
    name: '',
    login: '',
    password: '',
    // valid: true,
  }),

  methods: {
    clear() {
      return this.$router.push('/login')
    },
    async submit() {
      let name = this.name
      let login = this.login
      let password = this.password
      let ifHasLogin = await this.$apollo
        .query({
          query: CHECKUSER,
          variables: {
            login: login,
          },
        })
        .then(u => u.data.getAdminByName)

      if (ifHasLogin) {
        alert(`Login ${ifHasLogin.login} Allready has!`)
        this.login = this.password = ''
        this.$refs.form.resetValidation()
        this.$refs.login.focus()
        return
      }

      let userInfo = await this.$apollo
        .mutate({
          mutation: ADDUSER,
          variables: {
            name: name,
            login: login,
            password: password,
          },
        })
        .then(u => {
          return u.data.addAdmin
        })
      if (userInfo) {
        this.$store.dispatch('get_authorize', userInfo)
        return this.$router.push('/home')
      }
    },
  },
}
</script>
