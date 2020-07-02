<template>
  <div class="auth_page" style="background-image: url(../assets/img/login_phone.jpg)">
    <v-container>
      <v-row>
        <v-card class="auth_form mx-auto" max-width="460">
          <!-- <v-toolbar dark color="indigo darken-1" class="text-center">
            <v-toolbar-title>Авторизация</v-toolbar-title>
          </v-toolbar> -->
          <v-tabs background-color="indigo darken-1" dark grow>
            <v-tab href="#auth">Авторизация</v-tab>
            <v-tab href="#reg">Регистрация</v-tab>
          
            <v-tab-item value="auth">
              <v-card flat>
                <v-form v-model="valid" @submit.prevent="submitHandler()">
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field 
                        v-model="authData.login" 
                        label="Логин" 
                        required
                        prepend-icon="fa-user"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="authData.password"
                          :append-icon="showpassw ? 'fa-eye' : 'fa-eye-slash'"
                          :rules="[passwrules.required, passwrules.min]"
                          :type="showpassw ? 'text' : 'password'"
                          label="Пароль"
                          hint="Не менее 8 символов"
                          prepend-icon="fa-unlock-alt"
                          counter
                          @click:append="showpassw = !showpassw"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-switch v-model="saveswitch" color="success" label="Запомнить меня?"></v-switch>
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
            </v-tab-item>

            <v-tab-item value="reg">
          <v-card flat>
            <v-container>
              <v-row>
            <v-col cols="12">
                <ValidationProvider name="Email" rules="required|email" v-slot="{ errors, valid }">
                  <v-text-field
                    v-model="authData.email"
                    :error-messages="errors"
                    :success="valid"
                    prepend-icon="fa-user"
                    label="E-mail"
                    required
                  ></v-text-field>
                </ValidationProvider>
            </v-col>
            <v-col cols="12">
              <ValidationProvider name="Name" rules="required" v-slot="{ errors, valid }">
                <v-text-field
                  v-model="authData.username"
                  :error-messages="errors"
                  :success="valid"
                  prepend-icon="fa-id-card-o"
                  label="ФИО"
                  required
                ></v-text-field>
              </ValidationProvider>
            </v-col>
            <v-col cols="12">
              <ValidationProvider name="Login" rules="required" v-slot="{ errors, valid }">
                <v-text-field
                  v-model="authData.login"
                  :error-messages="errors"
                  :success="valid"
                  prepend-icon="fa-user"
                  label="Логин"
                  required
                ></v-text-field>
              </ValidationProvider>
            </v-col>
            <v-col cols="12">
              <ValidationObserver>
                <ValidationProvider rules="required|password:@confirm" v-slot="{ errors }">
                  <v-text-field
                    v-model="authData.password"
                    :append-icon="showpassw ? 'fa-eye' : 'fa-eye-slash'"
                    :type="showpassw ? 'text' : 'password'"
                    :error-messages="errors"
                    label="Пароль"
                    prepend-icon="fa-unlock-alt"
                    hint="Не менее 8 символов"
                    counter
                    @click:append="showpassw = !showpassw"
                  ></v-text-field>
                </ValidationProvider>
                <ValidationProvider name="confirm" rules="required|min:8" v-slot="{ errors }">
                  <v-text-field
                    v-model="confirmation"
                    :append-icon="showpassw ? 'fa-eye' : 'fa-eye-slash'"
                    :type="showpassw ? 'text' : 'password'"
                    :error-messages="errors"
                    label="Повторите пароль"
                    prepend-icon="fa-unlock-alt"
                    counter
                    hint="Не менее 8 символов"
                    @click:append="showpassw = !showpassw"
                  ></v-text-field>
                </ValidationProvider>
              </ValidationObserver>
            </v-col>
            <v-col cols="12">
              <v-file-input
                class="user_avatar"
                :rules="rules"
                @change="previewFiles"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Аватарка пользователя"
                prepend-icon="fa-camera-retro"
                label="Аватар"
                show-size
                name="avatar"
              ></v-file-input>
            </v-col>
            </v-row>
            </v-container>
            <div class="text-center">
                    <v-btn type="submit" color="indigo darken-1" class="ma-2 white--text" @click="addUser(authData)">
                      Регистрация
                      <v-icon right dark>fa-sign-in</v-icon>
                    </v-btn>
                  </div>
          </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
import messages from "~/plugins/messages.js";
export default {
  data: () => ({
    showpassw: false,
    valid: false,
    saveswitch: false,
    authData: {
      saveswitch: false,
      login: "",
      email: "exemple@exemple.ru",
      avatar: "",
      username: "",
      permission: "Сотрудник",
      password: ""
    },
    emailRules: [
      v => !!v || "Не верный E-mail",
      v => /.+@.+/.test(v) || "Не верный E-mail"
    ],
    passwrules: {
      required: value => !!value || "Обязательный.",
      min: v => v.length >= 8 || "Минимум 8 символов",
      emailMatch: () => "The email and password you entered don't match"
    },
    pass: "",
    pass2: "",
    showpassw: false,
    valid: false,
    fio: "",
    confirmation: "",
    rules: [
      value =>
        !value ||
        value.size < 2000000 ||
        "Размер аватара не должен превышать 2 МБ!"
    ],
  }),
  watch: {
    saveswitch() {
      if (this.saveswitch) {
        localStorage.setItem("login", this.authData.login);
        localStorage.setItem("password", this.authData.password);
      }
    }
  },
  computed: {
    ...mapGetters(["login"])
  },
  methods: {
    ...mapActions([
      'auth', 
      'createChat',
      'register',
      'uploadFiles',
      ]),
    async submitHandler() {
      let res = await this.auth(this.authData)
      if(res.data.success){
          let user = res.data; 
          this.$router.push('/') 
      }else{
        this.$error(res.data.message);
      }
    },
    addUser(data) {
      this.register(data)
        .then(res => {
          console.log(res);
          this.$message(res.data.message);
          this.getAllUsers();
        })
        .catch(error => {
          this.$error(res.data.message);
        });
    },
    previewFiles(event) {
      this.uploadFiles(event)
      .then(res => {
        this.authData.avatar = res
        //console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    },
  }
};
</script>
<style>
.theme--light.v-tabs-items{
  background-color: transparent;
}
</style>