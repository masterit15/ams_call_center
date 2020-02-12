<template>
  <div>
    <v-toolbar dark color="indigo darken-3" class="mb-1">
      <v-btn-toggle v-model="sortIsmain" mandatory>
          <v-btn large depressed color="blue" value="main">
            Мои
          </v-btn>
          <v-btn large depressed color="blue" value="all">
            Все
          </v-btn>
        </v-btn-toggle>
        <v-spacer></v-spacer>
      <v-col cols="2">
        <v-select
          v-model="searchParamVal"
          :items="searchParam"
          label="Искать по:"
          flat
          solo-inverted
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="search"
          clearable
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="fa-search"
          label="Поиск"
        ></v-text-field>
      </v-col>
      <template v-if="$vuetify.breakpoint.mdAndUp">
        <v-spacer></v-spacer>
        <v-col cols="3">
          <v-select
            v-model="sortBy"
            flat
            solo-inverted
            hide-details
            :items="postsstatus"
            prepend-inner-icon="fa-filter"
            label="Фильтр по"
          ></v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-btn-toggle v-model="sortDesc" mandatory>
          <v-btn large depressed color="blue" :value="false">
            <v-icon>fa-chevron-up</v-icon>
          </v-btn>
          <v-btn large depressed color="blue" :value="true">
            <v-icon>fa-chevron-down</v-icon>
          </v-btn>
        </v-btn-toggle>
      </template>
    </v-toolbar>
    <div class="post_loader" v-if="postloading">
      <div class="loader">
        <v-progress-circular :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
      </div>
    </div>

    <v-container>
      <v-snackbar
        v-model="snackbar"
        :multi-line="multiLine"
        :timeout="2000"
        :color="snackbarcolor"
        :top="snackbar_y === 'top'"
        :right="snackbar_x === 'right'"
      >
        {{ snackbarText }}
        <v-btn color="red" text @click="snackbar = false">
          <v-icon>fa-times-circle</v-icon>
        </v-btn>
      </v-snackbar>
      <v-row>
        <v-col v-for="(item, index) in posts" :key="index" cols="12" sm="6" md="4" lg="4">
          <v-card class="mx-auto" min-height="460">
            <v-toolbar dark :color="statuscolor(item.selectstatus)">
              <v-toolbar-title>{{item.selectstatus}}</v-toolbar-title>
            </v-toolbar>
            <v-card-title class="subtitle-2" color="#26c6da">ФИО: {{ item.fio }}</v-card-title>
            <v-divider class="mx-4"></v-divider>
            <v-card-subtitle>
              <span>
                <strong>Дата:</strong>
                {{item.creDate | moment("YYYY-MM-DD в HH:mm:ss")}}
              </span>
              <v-divider></v-divider>
              <span>
                <strong>Контрольная дата:</strong>
                {{item.conDate | moment("YYYY-MM-DD в HH:mm:ss")}}
              </span>
              <v-divider></v-divider>
              <span>
                <strong>Телефон:</strong>
                {{item.phoneNumber}}
              </span>
              <v-divider></v-divider>
              <span>
                <strong>Адрес:</strong>
                {{item.address}}
              </span>
              <v-divider></v-divider>
              <span>
                <strong>Номер обращения:</strong>
                {{item.regNumber}}
              </span>
              <v-divider></v-divider>
            </v-card-subtitle>
            <v-card-actions>
              <!-- <v-btn color="deep-purple accent-4" text>Подробнее</v-btn> -->
              <v-btn :disabled="showText(index)" icon @click="eYndex = index">
                <v-icon>{{ showText(index) ? 'fa-chevron-up' : 'fa-chevron-down' }}</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="green" icon @click="openEditForm(item, index)">
                <v-icon>fa-pencil-square-o</v-icon>
              </v-btn>
              <v-btn color="red" icon @click="deletePost(item._id, index)">
                <v-icon>fa-trash</v-icon>
              </v-btn>
            </v-card-actions>
            <v-expand-transition>
              <div v-show="showText(index)">
                <v-divider></v-divider>

                <v-card-text>{{ item.text }}</v-card-text>
                <v-btn text block @click="eYndex = null">
                  <v-icon>fa-chevron-up</v-icon>
                </v-btn>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="pageLength >= 2" class="mt-2" align="center" justify="center">
        <span class="grey--text">Элементов на странице</span>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn dark text color="primary" class="ml-2" v-on="on">
              {{ limit }}
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(number, index) in itemsPerPageArray"
              :key="index"
              @click="updateItemsPerPage(number)"
            >
              <v-list-item-title>{{ number }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-spacer></v-spacer>

        <v-pagination v-model="page" :length="pageLength" :total-visible="limit"></v-pagination>
      </v-row>
    </v-container>
    <transition name="slide-editform">
      <div v-if="editor" class="add_form elevation-20">
        <div class="add_form_close" :elevation="7">
          <v-btn icon @click="editor = false" color="error">
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
              <v-col cols="12" sm="6">
                <v-menu
                  ref="create_date"
                  v-model="post.create_date"
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
                    <v-btn text color="primary" @click="post.create_date = false">Закрыть</v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.create_date.save(post.creDate)"
                    >Сохранить</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
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
              <v-spacer></v-spacer>
              <v-col cols="12">
                <v-text-field v-model="post.fio" label="ФИО" prepend-icon="fa-user"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-combobox
                  v-model="post.address"
                  :items="addressArr"
                  :loading="loading"
                  :search-input.sync="addresssearch"
                  label="Адрес"
                  prepend-icon="fa-map-marker"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="post.phoneNumber"
                  label="Номер телефона"
                  prepend-icon="fa-phone"
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
                @click="loader = 'saveLoader', editPost(post)"
              >
                Сохранить
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>fa-refresh</v-icon>
                  </span>
                </template>
              </v-btn>
              <v-btn color="error" @click="editor = false">закрыть</v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </div>
    </transition>
  </div>
</template>
<script>
import axios from "axios"
import ymaps from "ymaps"
import { mapGetters, mapActions } from "vuex"
export default {
  data() {
    return {
      eYndex: null,
      loader: null,
      postloading: true,
      alert: false,
      alertText: "",
      post: {},
      states: [],
      addressArr: [],
      addresssearch: null,
      status: ["Все", "Не обработанная", "В работе", "Обработанная"],
      searchParam: [
        "по ФИО",
        "по мобильному",
        "по телефону",
        "по адресу",
        "по тексту обращения"
      ],
      searchParamVal: "fio",
      loading: false,
      saveLoader: false,
      editor: false,
      snackbar: false,
      multiLine: true,
      snackbar_x: null,
      snackbar_y: "top",
      snackbarcolor: "info",
      snackbarText: "",
      search: "",
      sortDesc: false,
      sortBy: "Все",
      sortIsmain: 'all',
      editMode: false,
      itemsPerPageArray: [6, 9, 12],
      items: [],
      page: 1,
      limit: 6,
      pageLength: 0,
      maploader: null,
      maps: null
    };
  },
  watch: {
    sortIsmain(){
      this.getPosts();
    },
    searchParamVal() {
      switch (this.searchParamVal) {
        case "по ФИО":
          this.searchParamVal = "fio";
          break;
        case "по мобильному":
          this.searchParamVal = "mobileNumber";
          break;
        case "по телефону":
          this.searchParamVal = "phoneNumber";
          break;
        case "по адресу":
          this.searchParamVal = "address";
          break;
        case "по тексту обращения":
          this.searchParamVal = "text";
          break;
      }
    },
    search() {
      this.getPosts();
    },
    sortBy() {
      this.getPosts();
    },
    page() {
      this.getPosts();
    },
    pagination() {
      this.pageLength = this.pagination.pageCount;
    },
    limit() {
      this.getPosts();
    },
    addresssearch(val) {
      val && val !== this.post.address && this.querySelections(val);
    },
    message() {
      if (this.message != "") {
        this.snackbarText = this.message;
        this.snackbar = true;
      }
    },
    sortDesc() {
      var val = this.sortDesc;
      this.posts.sort(function(a, b) {
        if (val) {
          return new Date(b.creDate) - new Date(a.creDate);
        } else {
          return new Date(a.creDate) - new Date(b.creDate);
        }
      });
    },
    loader() {
      const l = this.loader;
      this[l] = !this[l];
      setTimeout(() => {
        this[l] = false;
        this.menu = false;
        this.editor = false;
      }, 2000);

      this.loader = null;
    }
  },
  created() {
    this.initializeYandexMap();
    this.getPosts();
  },
  updated() {
    if (this.posts.length == 0) {
      this.postloading = true;
    } else {
      this.postloading = false;
    }
  },
  computed: {
    ...mapGetters(["posts", "postsstatus", "message", "pagination"])
  },
  methods: {
    showText(index) {
      if (this.eYndex == index) {
        return true;
      }
      return false;
    },
    getPosts() {
      let params = {
        status: this.sortBy,
        pagin: {
          page: this.page,
          limit: this.limit,
          searchparam: this.searchParamVal,
          search: this.search,
          sortIsmain: this.sortIsmain
        }
      };
      this.loadPost(params);
    },
    ...mapActions(["loadPost", "editPost", "deletePost"]),
    statuscolor(val) {
      switch (val) {
        case "Не обработанная":
          return "red";
          break;
        case "В работе":
          return "amber";
          break;
        case "Обработанная":
          return "green";
          break;
      }
    },
    openEditForm(post) {
      this.post = post;
      this.editor = true;
    },
    updateItemsPerPage(number) {
      this.limit = number;
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
.v-card__subtitle span {
  display: block;
  padding: 10px 0px 2px 0px;
}
.post_loader {
  position: relative;
  background-color: #fafafa;
  width: 100%;
  min-height: 400px;
}
.post_loader .loader {
  position: absolute;
  width: 100%;
  height: 100%;
}
.post_loader .loader .v-progress-circular {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.v-card__text {
  max-height: 185px;
  overflow: hidden;
}
.slide-editform-enter-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-editform-enter,
.slide-editform-leave-to {
  transform: translateX(50px);
  opacity: 0;
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