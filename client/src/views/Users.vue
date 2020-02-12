<template>
  <v-container>
    <v-row>
      <v-col col="12">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on">Добавить пользователя</v-btn>
          </template>
          <v-card>
            <v-toolbar dark color="green">
              <v-toolbar-title>Добавить пользователя</v-toolbar-title>
            </v-toolbar>
            <v-form v-model="valid" @submit="register(authData)">
              <v-col cols="12">
                <!-- <ValidationProvider name="Email" rules="required|email" v-slot="{ errors, valid }">
                  <v-text-field
                    v-model="authData.email"
                    :error-messages="errors"
                    :success="valid"
                    label="E-mail"
                    required
                  ></v-text-field>
                </ValidationProvider>-->
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
                    v-model="authData.userName"
                    :error-messages="errors"
                    :success="valid"
                    label="ФИО"
                    required
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12">
                <ValidationObserver>
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
                </ValidationObserver>
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
                <v-btn color="red" text @click="dialog = false">Закрыть</v-btn>
                <v-btn type="submit" color="green" text @click="dialog = false">Сохранить</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-col>
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
                  <th lass="text-left">Логин</th>
                  <th lass="text-left">ФИО</th>
                  <th lass="text-left">Роль</th>
                  <th lass="text-left">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in users" :key="index">
                  <td>{{ item.login }}</td>
                  <td>{{ item.userName }}</td>
                  <td>{{ item.permission }}</td>
                  <td>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn color="green" v-on="on" icon @click="editUser(item, index)">
                          <v-icon>fa-pencil-square-o</v-icon>
                        </v-btn>
                      </template>
                      <span>Редактировать</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn color="red" v-on="on" icon @click="deletePost(item._id, index)">
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
    valid: false,
    editor: false,
    permissionItems: ["Администратор", "Сотрудник"],
    fio: "",
    search: "",
    searchParam: ["по ФИО"],
    searchParamVal: "fio",
    user: {},
    authData: {
      saveswitch: false,
      // email: "",
      login: "",
      userName: "",
      permission: "Сотрудник",
      password: ""
    },
    page: 1,
    limit: 6,
    confirmation: ""
  }),
  watch: {
    permissionItems() {
      switch (this.permissionItems) {
        case "Администратор":
          this.authData.permission = "admin";
          break;
        case "Сотрудник":
          this.authData.permission = "employee";
          break;
      }
    }
  },
  created() {
    this.getAllUsers();
  },
  // mounted() {
  //   this.getAllUsers()
  // },
  computed: {
    ...mapGetters(["users"])
  },
  methods: {
    ...mapActions(["register", "getUsers"]),
    getAllUsers() {
      let params = {
        page: this.page,
        limit: this.limit,
        searchparam: this.searchParamVal,
        search: this.search
      };
      this.getUsers(params);
    },
    editUser(user) {
      this.user = user;
      this.editor = true;
    },
  }
};
</script>
<style scoped>
.v-data-table td,
.v-data-table th {
  padding: 15px;
}
</style>