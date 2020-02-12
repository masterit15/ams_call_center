<template>
  <v-container>

<v-row>
      <v-card class="mt-4 mx-auto" max-width="400">
        <v-toolbar dark color="blue" class="text-center">
              <v-toolbar-title >Авторизация</v-toolbar-title>
            </v-toolbar>
        <v-alert
      v-model="error"
      type="error"
      dismissible
      icon="fa-exclamation-triangle"
    >
    <strong>Неверный логин или пароль!</strong>
    </v-alert>
    <v-spacer></v-spacer>
        <v-form v-model="valid" @submit.prevent="submitHandler()">
          <v-container>
            <v-row>
              <!-- <v-col cols="12">
                <v-text-field v-model="authData.email" :rules="emailRules" label="E-mail" required></v-text-field>
              </v-col> -->
              <v-col cols="12">
                <v-text-field v-model="authData.login" label="Логин" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="authData.password"
                  :append-icon="showpassw ? 'fa-eye' : 'fa-eye-slash'"
                  :rules="[passwrules.required, passwrules.min]"
                  :type="showpassw ? 'text' : 'password'"
                  label="Пароль"
                  hint="Не менее 8 символов"
                  counter
                  @click:append="showpassw = !showpassw"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-switch 
                v-model="saveswitch"
                color="success"
                label="Запомнить меня?"
                ></v-switch>
              </v-col>
            </v-row>
          </v-container>
          <div class="text-center">
            <v-btn type="submit" color="indigo darken-1" class="ma-2 white--text">
              Войти
              <v-icon right dark>fa-sign-in</v-icon>
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
import messages from '~/plugins/messages.js'
export default {
  data: () => ({
    showpassw: false,
    valid: false,
    error: false,
    saveswitch: false,
    authData: {
      login: "",
      // email: "",
      password: ""
    },
    // emailRules: [
    //   v => !!v || "Не верный E-mail",
    //   v => /.+@.+/.test(v) || "Не верный E-mail"
    // ],
    passwrules: {
      required: value => !!value || "Обязательный.",
      min: v => v.length >= 8 || "Минимум 8 символов"
      // emailMatch: () => ('The email and password you entered don\'t match'),
    }
  }),
  watch: {
    saveswitch(){
      if(this.saveswitch){
        localStorage.setItem('login', this.authData.login)
        localStorage.setItem('password', this.authData.password)
      }
    }
  },
  created() {
    // if (
    //   localStorage.getItem("user_login") != null &&
    //   localStorage.getItem("user_password") != null
    // ) {
    //   let saveAuthParam = {
    //     saveswitch: false,
    //     email: localStorage.getItem("user_login"),
    //     password: localStorage.getItem("user_password")
    //   };
    //   this.auth(saveAuthParam);
    // }
  },
  mounted() {
    // if (messages[this.$route.query.message]) {
    //   this.$message(messages[this.$route.query.message])
    // }
  },
  computed: {
    ...mapGetters(["login"])
  },
  methods: {
    ...mapActions(['auth']),
    async submitHandler() {
      await this.auth(this.authData)
      .then(res => {
        if(res.status === 200){
          this.$router.push('/')
        }
      })
      .catch(error => {
        if(error){
          this.error = true
          console.log("Что-то пошло не так")
        }
      })
      
    }
  }
};
</script>