<template>
  <header class="headers">
    <v-toolbar dark color="indigo">
      <v-btn class="menu-open" icon @click="miniVar = !miniVar" right>
        <v-icon>fa-outdent</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn v-on="on" dark color="amber lighten-3" icon @click="overlay = true">
        <v-icon>fa-plus</v-icon>
      </v-btn>
                      </template>
                      <span>Добавить обращение</span>
                    </v-tooltip>
      <v-spacer></v-spacer>
      <v-divider vertical></v-divider>
      <v-btn dark icon @click="logouted()">
        <v-icon>fa-sign-out</v-icon>
      </v-btn>
    </v-toolbar>
    <!-- <div class="add_form_button">
      <v-btn class="mx-2" dark color="cyan" icon @click="overlay = true">
        <v-icon>fa-plus</v-icon>
      </v-btn>
    </div> -->
    <v-spacer></v-spacer>
    <transition name="slide-addform">
      <div v-if="overlay" class="add_form elevation-20">
        <div class="add_form_close" :elevation="7">
          <v-btn icon @click="overlay = false" color="error">
            <v-icon>fa-close</v-icon>
          </v-btn>
        </div>
        <v-divider></v-divider>
        <v-form ref="form">
          <v-container fluid>
            <v-alert
              v-model="alert"
              border="left"
              close-text="Закрыть"
              color="light-green accent-1"
              dark
              dismissible
            >{{alertText}}</v-alert>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="post.regNumber"
                  label="Регистр. номер"
                  prepend-icon="fa-address-card-o"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="post.selectstatus"
                  :items="status"
                  label="Статус"
                  prepend-icon="fa-share"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="3">
                <v-menu
                  ref="create_date"
                  v-model="create_date"
                  :close-on-content-click="false"
                  :return-value.sync="post.creDate"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="post.creDate"
                      label="Дата создания"
                      prepend-icon="fa-calendar"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="post.creDate" no-title scrollable locale="ru">
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="create_date = false">Закрыть</v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.create_date.save(post.creDate)"
                    >Сохранить</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="3">
                <v-menu
                  ref="create_time"
                  v-model="create_time"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="post.creTime"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="post.creTime"
                      label="Время создания"
                      prepend-icon="fa-clock-o"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="create_time"
                    v-model="post.creTime"
                    full-width
                    locale="ru"
                    @click:minute="$refs.create_time.save(post.creTime)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="3">
                <v-menu
                  ref="control_date"
                  v-model="post.control_date"
                  :close-on-content-click="false"
                  :return-value.sync="post.conDate"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="post.conDate"
                      label="Контрольная дата"
                      prepend-icon="fa-calendar"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="post.conDate" no-title scrollable locale="ru">
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="post.control_date = false">Закрыть</v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.control_date.save(post.conDate)"
                    >Сохранить</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="3">
                <v-menu
                  ref="control_time"
                  v-model="control_time"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="post.conTime"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="post.conTime"
                      label="Контрольное время"
                      prepend-icon="fa-clock-o"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="control_time"
                    v-model="post.conTime"
                    full-width
                    locale="ru"
                    @click:minute="$refs.control_time.save(post.conTime)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="12">
                <v-text-field v-model="post.fio" label="ФИО" prepend-icon="fa-user"></v-text-field>
              </v-col>
              <v-col cols="12">
                <!-- <v-text-field v-model="address" label="Адрес" prepend-icon="fa-"></v-text-field> -->
                <v-autocomplete
                  v-model="post.address"
                  :loading="loading"
                  :items="addressArr"
                  :search-input.sync="addresssearch"
                  cache-items
                  flat
                  hide-no-data
                  hide-details
                  prepend-icon="fa-map-marker"
                  label="Адрес"
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="post.phoneNumber"
                  v-mask="phoneMask"
                  label="Домашний"
                  prepend-icon="fa-phone"
                ></v-text-field>
                <v-text-field
                  v-model="post.mobileNumber"
                  v-mask="mobileMask"
                  label="Мобильный"
                  prepend-icon="fa-mobile"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="post.text"
                  name="input-7-1"
                  label="Текст обращения"
                  prepend-icon="fa-pencil-square-o"
                  value
                  hint
                ></v-textarea>
              </v-col>
            </v-row>
            <v-card-actions>
              <!-- <v-spacer></v-spacer> -->
              <v-btn
                :loading="saveLoader"
                :disabled="saveLoader"
                color="info"
                @click="loader = 'saveLoader', addPost(post)"
              >
                Сохранить
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>fa-refresh</v-icon>
                  </span>
                </template>
              </v-btn>
              <v-btn @click="refreshForm()">
                Очистить
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>fa-refresh</v-icon>
                  </span>
                </template>
              </v-btn>
              <v-btn color="error" @click="overlay = false">закрыть</v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </div>
    </transition>
  </header>
</template>

<script>
function gettanggal(str) {
  if (str != null) {
    return (
      str.substring(8, 10) +
      "/" +
      str.substring(5, 7) +
      "/" +
      str.substring(0, 4)
    );
  }
  return "";
}
const date = new Date()
import ymaps from "ymaps";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import { mask } from 'vue-the-mask'
export default {
  directives: {
      mask,
    },
  data() {
    return {
      search: "",
      menu: false,
      create_date: "",
      create_time: "",
      control_date: "",
      control_time: "",
      phoneMask: '#-(###)-###-##-##',
      mobileMask: '#-(###)-###-##-##',
      post: {
        fio: "",
        creDate: date.toISOString().substr(0, 10), //null,
        creTime: date.getHours()+':'+date.getMinutes(),
        conDate: null,
        conTime: date.getHours()+':'+date.getMinutes(),
        address: null,
        selectstatus: "Не обработанная",
        regNumber: "",
        phoneNumber: "",
        mobileNumber: "",
        text: "",
        owner: null,
      },
      states: [],
      addressArr: [],
      addresssearch: null,
      status: ["Не обработанная", "В работе", "Обработанная"],
      loader: null,
      alert: false,
      alertText: "",
      loading: false,
      maploader: null,
      miniVar: true,
      saveLoader: false,
      overlay: false,
      maps: null
    };
  },
  created() {
    this.post.owner = this.user
  },
  mounted() {
    this.initializeYandexMap();
    this.saveOption();
  },
  watch: {
    miniVar(){
      let main = document.querySelector("body");
      if (!this.miniVar) {
        main.classList.remove("close");
        main.classList.add("open");
        localStorage.setItem("asideOpen", "open");
        this.miniAside(this.miniVar);
      } else {
        main.classList.remove("open");
        main.classList.add("close");
        localStorage.setItem("asideOpen", "close");
        this.miniAside(this.miniVar);
      }
    },
    user(){
      console.log(this.user)
    },
    addresssearch(val) {
      val && val !== this.post.address && this.querySelections(val);
    },
    loader() {
      const l = this.loader;
      this[l] = !this[l];
      setTimeout(() => {
        this[l] = false;
        this.menu = false;
      }, 3000);
      this.loader = null;
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions(['addPost', 'miniAside', 'logout']),
    logouted(){
      this.logout()
      // this.$router.push('/login').then(res =>{
      //   console.log(res)
      // })
      // .catch(error => {
      //   console.log(error)
      // })
      
      // .then(res => {
      //   console.log(res)
      //   this.$router.push('/login')
      //   .then(r => {
      //     console.log(r)
      //   })
      //   .catch(e => {
      //     console.log(e)
      //   })
      // })
      // .catch(e => {
      //   console.log(e)
      // })
    },
    saveOption() {
      let main = document.querySelector("body");
      if (localStorage.getItem("asideOpen") === "open") {
        main.classList.remove("close");
        main.classList.add("open");
        this.miniAside(false);
      } else {
        main.classList.remove("open");
        main.classList.add("close");
        this.miniAside(true)
      }
    },
    // sideOpen(param) {
    //   console.log(param)
    //   let main = document.querySelector("body");
    //   if (!param) {
    //     main.classList.remove("close");
    //     main.classList.add("open");
    //     localStorage.setItem("asideOpen", "open");
    //     this.miniAside(param);
    //   } else {
    //     main.classList.remove("open");
    //     main.classList.add("close");
    //     localStorage.setItem("asideOpen", "close");
    //     this.miniAside(param);
    //   }
      
    // },
    // setCookie(name, value, expires, path, domain, secure) {
    //   document.cookie =
    //     name +
    //     "=" +
    //     escape(value) +
    //     (expires ? "; expires=" + expires : "") +
    //     (path ? "; path=" + path : "") +
    //     (domain ? "; domain=" + domain : "") +
    //     (secure ? "; secure" : "");
    // },
    // getCookie(name) {
    //   let cookie = " " + document.cookie;
    //   let search = " " + name + "=";
    //   let setStr = null;
    //   let offset = 0;
    //   let end = 0;
    //   if (cookie.length > 0) {
    //     offset = cookie.indexOf(search);
    //     if (offset != -1) {
    //       offset += search.length;
    //       end = cookie.indexOf(";", offset);
    //       if (end == -1) {
    //         end = cookie.length;
    //       }
    //       setStr = unescape(cookie.substring(offset, end));
    //     }
    //   }
    //   return setStr;
    // },
    dateFormat(val) {
      return moment(val).format("YYYY-MM-DD в HH:mm:ss");
    },
    // logout() {
    //   this.$router.push("/login?message=logout");
    // },
    refreshForm() {
      this.search = "";
      this.post.fio = "";
      this.items = [];
      this.post.control_date = "";
      this.post.create_date = "";
      this.post.creDate = "";
      this.post.conDate = "";
      this.post.address = null;
      this.post.addressArr = [];
      this.post.addresssearch = null;
      this.post.states = [];
      this.select = "";
      this.post.regNumber = "";
      this.post.phone = "";
      this.post.text = "";
      // this.overlay = false
    },
    initializeYandexMap() {
      ymaps
        .load(
          "https://api-maps.yandex.ru/2.1/?apikey=256e028a-94b5-496f-b948-394772dc151a&lang=ru_RU"
        )
        .then(maps => {
          this.maps = maps;
        })
        .catch(error => console.log("Ошибка!", error));
    },
    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      this.maps.suggest(v).then(res => {
        for (let i = 0; i < res.length; i++) {
          this.states.push(res[i].value);
        }
        this.addressArr = this.states.filter(e => {
          this.loading = false;
          return (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1;
        });
      });
    }
  }
};
</script>

<style scoped>
.slide-addform-enter-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-addform-enter,
.slide-addform-leave-to {
  transform: translateX(50px);
  opacity: 0;
}
.v-form{
  width: 100%;
  height: 100%;
  overflow: auto;
}
.v-list-item__content {
  text-align: left;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>