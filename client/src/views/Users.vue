<template>
  <v-container>
    <v-row>
      <v-snackbar v-model="snackbar" :timeout="3000" :top="true" :right="true">
        {{ message }}
        <v-btn color="blue" text @click="snackbar = false">
          <v-icon>fa-times-circle</v-icon>
        </v-btn>
      </v-snackbar>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-card>
          <v-toolbar dark color="green">
            <v-toolbar-title>Список пользователей</v-toolbar-title>
          </v-toolbar>
          <v-simple-table height="400px">
            <template v-slot:default>
              <thead :dense="true" :fixed-header="true">
                <tr>
                  <th lass="text-left">ID</th>
                  <th lass="text-left">Ававтар</th>
                  <th lass="text-left">Логин</th>
                  <th lass="text-left">Email</th>
                  <th lass="text-left">ФИО</th>
                  <th lass="text-left">Роль</th>
                  <th lass="text-left">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in users" :key="index">
                  <td>{{ item.id }}</td>
                  <td>
                    <v-dialog width="800" v-if="item.avatar !== ''">
                      <template v-slot:activator="{ on }">
                        <v-avatar>
                          <v-img :src="item.avatar" :alt="item.avatar" v-on="on"></v-img>
                        </v-avatar>
                      </template>
                      <img :src="item.avatar" :alt="item.login" />
                    </v-dialog>
                    <v-avatar v-else color="indigo">
                      <v-icon dark>fa-user</v-icon>
                    </v-avatar>
                  </td>
                  <td>{{ item.login }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.username }}</td>
                  <td>{{ item.permission }}</td>
                  <td>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn color="green" v-on="on" icon @click="openEditorUser(item, index)">
                          <v-icon>fa-pencil-square-o</v-icon>
                        </v-btn>
                      </template>
                      <span>Редактировать</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn color="blue-grey" v-on="on" icon @click="deleteUse(item._id, index)">
                          <v-icon>fa-trash</v-icon>
                        </v-btn>
                      </template>
                      <span>Удалить</span>
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <v-col col="12">
            <v-dialog v-model="dialog" persistent max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark v-on="on" @click="newUser">
                  <v-icon>fa-address-card-o</v-icon>Добавить пользователя
                </v-btn>
              </template>
              <v-card>
                <v-toolbar dark color="green">
                  <v-toolbar-title>Добавить пользователя</v-toolbar-title>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn class="close_btn" v-on="on" icon @click="dialog = false" color="red">
                        <v-icon>fa-close</v-icon>
                      </v-btn>
                    </template>
                    <span>Закрыть</span>
                  </v-tooltip>
                </v-toolbar>
                <!-- <v-form v-model="valid"> -->
                <v-col cols="12">
                  <ValidationProvider
                    name="Email"
                    rules="required|email"
                    v-slot="{ errors, valid }"
                  >
                    <v-text-field
                      v-model="authData.email"
                      :error-messages="errors"
                      :success="valid"
                      label="E-mail"
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
                      label="Логин"
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
                      label="ФИО"
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
                        counter
                        hint="Не менее 8 символов"
                        @click:append="showpassw = !showpassw"
                      ></v-text-field>
                    </ValidationProvider>
                  </ValidationObserver>
                </v-col>
                <v-col cols="12">
                  <v-avatar v-if="authData.avatar !== ''">
                    <img :src="authData.avatar" :alt="authData.login" />
                  </v-avatar>
                  <v-file-input
                    v-else
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
                <v-col cols="12">
                  <v-select
                    v-model="authData.permission"
                    :items="permissionItems"
                    label="Роль пользователя"
                  ></v-select>
                </v-col>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="!edited"
                    type="submit"
                    left
                    color="green"
                    @click="addUser(authData)"
                  >Сохранить</v-btn>
                  <v-btn
                    v-if="edited"
                    type="submit"
                    left
                    color="green"
                    @click="editUse(authData)"
                  >Обновить</v-btn>
                </v-card-actions>
                <!-- </v-form> -->
              </v-card>
            </v-dialog>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";
export default {
  data: () => ({
    pass: "",
    pass2: "",
    showpassw: false,
    dialog: false,
    editordialog: false,
    valid: false,
    editor: false,
    permissionItems: ["Администратор", "Сотрудник"],
    fio: "",
    search: "",
    message: "",
    snackbar: false,
    ifeditUser: false,
    searchParam: ["по ФИО"],
    searchParamVal: "fio",
    user: {},
    authData: {
      saveswitch: false,
      login: "",
      email: "",
      avatar: "",
      username: "",
      permission: "Сотрудник",
      password: ""
    },
    emailRules: [
      v => !!v || "Не верный E-mail",
      v => /.+@.+/.test(v) || "Не верный E-mail"
    ],
    rules: [
      value =>
        !value ||
        value.size < 2000000 ||
        "Размер аватара не должен превышать 2 МБ!"
    ],
    page: 1,
    limit: 6,
    confirmation: ""
  }),
  watch: {},
  created() {
    this.getAllUsers();
  },
  computed: {
    ...mapGetters(["users"]),
    edited() {
      if (
        this.authData.login == "" &&
        this.authData.username == "" &&
        this.authData.password == ""
      ) {
        return false;
      }
      return true;
    }
  },
  methods: {
    ...mapActions([
      "register",
      "getUsers",
      "editUser",
      "deleteUser",
      "getUser",
      "uploadFiles"
    ]),
    getAllUsers() {
      let params = {
        page: this.page,
        limit: this.limit
        // searchparam: this.searchParamVal,
        // search: this.search
      };
      this.getUsers(params);
    },
    newUser() {
      this.authData = {
        saveswitch: false,
        login: "",
        username: "",
        avatar: "",
        permission: "Сотрудник",
        password: ""
      };
    },
    addUser(data) {
      this.dialog = false;
      this.register(data)
        .then(res => {
          console.log(res);
          this.message = res.data.message;
          this.snackbar = true;
          this.getAllUsers();
        })
        .catch(error => {
          console.log(error);
          this.message = error;
          this.snackbar = true;
        });
    },
    previewFiles(event) {
      this.authData.avatar = event;
      this.uploadFiles(event)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    openEditorUser(data) {
      data.password = "";
      this.authData = data;
      this.dialog = true;
      // this.getUser(data.id)
    },
    editUse(data) {
      this.dialog = false;
      this.editUser(data)
        .then(res => {
          console.log(res);
          this.message = res.data.message;
          this.snackbar = true;
          this.getAllUsers();
        })
        .catch(error => {
          console.log(error);
          this.message = error;
          this.snackbar = true;
        });
    },
    deleteUse(data) {
      this.deleteUser(data)
        .then(res => {
          console.log(res);
          this.message = res.data.message;
          this.snackbar = true;
          this.getAllUsers();
        })
        .catch(error => {
          console.log(error);
          this.message = error;
          this.snackbar = true;
        });
    }
  }
};
</script>
<style scoped>
.close_btn{
  position: absolute;
  right: 30px;
}
.v-data-table td,
.v-data-table th{
  padding: 15px;
}
</style>