<template>
  <div id="applications">
    <v-card
      class="py-2 px-4"
      color="rgba(0, 0, 0, .3)"
      dark
      flat
      link
      min-width="100"
      style="position: fixed; top: 115px; right: -35px; border-radius: 8px;"
      @click="filter = !filter"
    >
      <v-icon large>fa-filter</v-icon>
    </v-card>
    <transition name="slide-addform">
      <div id="app_filter" class="primary" v-show="filter">
        <div class="add_form_close primary" :elevation="7">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon @click="filter = false" color="red">
                <v-icon>fa-close</v-icon>
              </v-btn>
            </template>
            <span>Закрыть</span>
          </v-tooltip>
        </div>
        <v-row class="px-0">
          <v-col sm="6">
            <v-btn-toggle v-model="sortIsmain" mandatory>
              <v-btn large depressed value="main">Мои</v-btn>
              <v-btn large depressed value="all">Все</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col sm="6">
            <template v-if="$vuetify.breakpoint.mdAndUp">
              <v-btn-toggle v-model="sortDesc" mandatory>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" large depressed :value="false">
                      <v-icon>fa-chevron-up</v-icon>
                    </v-btn>
                  </template>
                  <span>По возрастанию</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" large depressed :value="true">
                      <v-icon>fa-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <span>По убыванию</span>
                </v-tooltip>
              </v-btn-toggle>
            </template>
          </v-col>
          <v-divider></v-divider>
          <v-col sm="12" class="px-6">
            <v-text-field
              v-model="interval"
              label="По дате"
              id="datefilter"
              data-multiple-dates-separator=" - "
              class="datepicker-here"
              clearable
              flat
              dark
              solo-inverted
              hide-details
              prepend-inner-icon="fa-calendar"
              data-date-format="dd.mm.yyyy,"
              data-time-format="hh:ii:00"
              autocomplete="off"
              @change="getPosts"
            ></v-text-field>
          </v-col>
          <v-divider></v-divider>
          <v-col sm="12" class="px-6">
            <v-select
              v-model="searchParamVal"
              :items="searchParam"
              label="Искать по:"
              flat
              dark
              solo-inverted
              hide-details
            ></v-select>
          </v-col>
          <v-divider></v-divider>
          <v-col sm="12" class="px-6">
            <v-text-field
              v-model="search"
              clearable
              flat
              dark
              solo-inverted
              hide-details
              prepend-inner-icon="fa-search"
              label="Поиск"
            ></v-text-field>
          </v-col>

          <v-divider></v-divider>
          <v-col sm="12" class="px-6">
            <v-select
              v-model="sortBy"
              flat
              dark
              solo-inverted
              hide-details
              :items="postsstatus"
              prepend-inner-icon="fa-filter"
              label="Фильтр по"
            ></v-select>
          </v-col>
          <v-tooltip bottom v-if="showXML">
            <template v-slot:activator="{ on }">
              <v-btn dark block large color="red" v-on="on" @click="exportXML(posts)">
                <v-icon>fa-file-excel-o</v-icon> 
                Экспорт
              </v-btn>
            </template>
            <span>Выгрузить в XML</span>
          </v-tooltip>
          <transition name="slide-addform">
            <v-card class="my-4" v-if="expFile">
              <a class="btn" :href="'export/'+expFile" download>{{expFile}}</a>
            </v-card>
          </transition>
        </v-row>
      </div>
    </transition>

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
        <div class="no_pos" v-if="posts.length == 0">
          <h3>Нет обращений</h3>
        </div>
        <v-col v-else v-for="(item, index) in posts" :key="index" cols="12" sm="6" md="4" lg="4">
          <v-hover v-slot:default="{ hover }">
            <v-card
              :elevation="hover ? 16 : 2"
              class="mx-auto"
              min-height="460"
              @click="openEditForm(item, index)"
            >
              <v-toolbar dark :color="statuscolor(item.selectstatus)">
                <v-toolbar-title>{{item.selectstatus}}</v-toolbar-title>
              </v-toolbar>
              <v-card-title class="subtitle-2" color="#26c6da">ФИО: {{ item.fio }}</v-card-title>
              <v-divider class="mx-4"></v-divider>
              <v-card-subtitle>
                <span>
                  <strong>Дата:</strong>
                  {{item.credate}}
                </span>
                <v-divider></v-divider>
                <span>
                  <strong>Контрольная дата:</strong>
                  {{item.condate}}
                </span>
                <v-divider></v-divider>
                <span>
                  <strong>Телефон:</strong>
                  {{item.phonenumber}}
                </span>
                <v-divider></v-divider>
                <span>
                  <strong>Адрес:</strong>
                  {{item.address}}
                </span>
                <v-divider></v-divider>
                <span>
                  <strong>Номер обращения:</strong>
                  {{item.regnumber}}
                </span>
                <v-divider></v-divider>

                <v-card-text>{{ item.text }}</v-card-text>
              </v-card-subtitle>
              <!-- <v-card-actions>
              <v-btn :disabled="showText(index)" icon @click="eYndex = index">
                <v-icon>{{ showText(index) ? 'fa-chevron-up' : 'fa-chevron-down' }}</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn class="add_button" color="green" icon @click="openEditForm(item, index)">
                <v-icon>fa-pencil-square-o</v-icon>
              </v-btn>
              <v-btn color="red" icon @click="deletePosts(item.id, index)">
                <v-icon>fa-trash</v-icon>
              </v-btn>
              </v-card-actions>-->
              <v-expand-transition>
                <!-- <div v-show="showText(index)"> -->
                <!-- <v-divider></v-divider>

                <v-card-text>{{ item.text }}</v-card-text>-->
                <!-- <v-btn text block @click="eYndex = null">
                  <v-icon>fa-chevron-up</v-icon>
                </v-btn>-->
                <!-- </div> -->
              </v-expand-transition>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
      <v-row class="mt-2" align="center" justify="center">
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

        <v-pagination
          v-if="pageLength >= 2"
          v-model="page"
          :length="pageLength"
          :total-visible="limit"
        ></v-pagination>
      </v-row>
    </v-container>
    <transition name="slide-addform">
      <app-form v-if="editor" addParam="add" :edited="true" :formData="post" />
    </transition>
  </div>
</template>
<script>
function isEmpty(obj) {
  for (let key in obj) {
    // если тело цикла начнет выполняться - значит в объекте есть свойства
    return false;
  }
  return true;
}
import axios from "axios";
import ymaps from "ymaps";
import { mapGetters, mapActions } from "vuex";
import EditForm from "~/components/EditForm.vue";
import AppForm from "~/components/AppForm.vue";
export default {
  components: {
    EditForm,
    AppForm
  },
  data() {
    return {
      eYndex: null,
      loader: null,
      postloading: true,
      filter: false,
      alert: false,
      alertText: "",
      post: {},
      states: [],
      addressArr: [],
      addresssearch: null,
      status: ["Все", "Не обработан", "В работе", "Обработана"],
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
      expFile: "",
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
      sortIsmain: "all",
      editMode: false,
      itemsPerPageArray: [6, 9, 12],
      interval: null,
      dateinterval: {
        from: null,
        to: null
      },
      items: [],
      page: 1,
      limit: 6,
      pageLength: 0,
      maploader: null,
      maps: null
    };
  },
  watch: {
    sortIsmain() {
      this.getPosts();
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
      localStorage.setItem("page_limit", this.limit);
    },
    addresssearch(val) {
      val && val !== this.post.address && this.querySelections(val);
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
    if (localStorage.getItem("page_limit") !== null) {
      this.limit = localStorage.getItem("page_limit");
    } else {
      this.limit = 6;
    }
    this.initializeYandexMap();
    this.getPosts()
  },
  updated() {
    if (this.posts.length == 0) {
      this.postloading = true;
    } else {
      this.postloading = false;
    }
  },
  mounted() {
    const that = this;
    $("#datefilter").datepicker({
      timepicker: true,
      language: "ru",
      range: true,
      multipledatesseparator: " - ",
      onSelect: function(formattedDate, date, inst) {
        if (date) {
          that.interval = formattedDate;
          that.dateinterval.from = new Date(date[0]);
          if (date.length > 1) that.dateinterval.to = new Date(date[1]);
        }
      }
    });
  },
  computed: {
    ...mapGetters(["posts", "postsstatus", "pagination", "userId"]),
    showXML() {
      if (
        this.sortBy != "Все" ||
        this.sortIsmain != "all" ||
        this.search != "" ||
        (this.interval != null && this.interval != "")
      ) {
        return true;
      }
      return false;
    },
    timeline() {
      return this.events.slice().reverse();
    }
  },
  methods: {
    ...mapActions(["loadPost", "editPost", "deletePost", "exportsXML"]),
    exportXML() {
      switch (this.searchParamVal) {
        case "по ФИО":
          this.searchParamVal = "fio";
          break;
        case "по мобильному":
          this.searchParamVal = "mobilenumber";
          break;
        case "по телефону":
          this.searchParamVal = "phonenumber";
          break;
        case "по адресу":
          this.searchParamVal = "address";
          break;
        case "по тексту обращения":
          this.searchParamVal = "text";
          break;
      }
      let params = {
        status: this.sortBy,
        pagin: {
          page: this.page,
          limit: this.limit,
          status: this.sortBy,
          searchparam: this.searchParamVal,
          search: this.search,
          sortIsmain: this.sortIsmain,
          dateintervalfrom: this.dateinterval.from,
          dateintervalto: this.dateinterval.to,
          userId: this.userId
        }
      };
      this.exportsXML(params)
        .then(res => {
          this.expFile = res.data.fileName;
        })
        .catch(error => {
          console.log(error);
        });
    },
    showText(index) {
      if (this.eYndex == index) {
        return true;
      }
      return false;
    },
    getPosts() {
      switch (this.searchParamVal) {
        case "по ФИО":
          this.searchParamVal = "fio";
          break;
        case "по мобильному":
          this.searchParamVal = "mobilenumber";
          break;
        case "по телефону":
          this.searchParamVal = "phonenumber";
          break;
        case "по адресу":
          this.searchParamVal = "address";
          break;
        case "по тексту обращения":
          this.searchParamVal = "text";
          break;
      }
      let params = {
        status: this.sortBy,
        pagin: {
          page: this.page,
          limit: this.limit,
          status: this.sortBy,
          searchparam: this.searchParamVal,
          search: this.search,
          sortIsmain: this.sortIsmain,
          dateintervalfrom: this.dateinterval.from,
          dateintervalto: this.dateinterval.to,
          userId: this.userId
        }
      };
      this.loadPost(params);
    },
    statuscolor(val) {
      switch (val) {
        case "Не обработан":
          return "red";
          break;
        case "В работе":
          return "amber";
          break;
        case "Обработана":
          return "green";
          break;
      }
    },
    async openEditForm(post) {
      this.post = await post;
      if (!isEmpty(this.post) && this.editor) {
        this.editor = false;
      }
      setTimeout(() => {
        this.editor = !this.editor;
      }, 0);
    },
    async deletePosts(id) {
      await this.deletePost(id)
        .then(res => {
          console.log(res);
          this.snackbarText = res.data.message;
          this.snackbar = true;
        })
        .catch(err => {
          this.snackbarText = res.data.message;
          this.snackbar = true;
        });
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
<style>
#app_filter {
  position: fixed;
  right: 0px;
  top: 0px;
  width: 350px;
  background-color: #fff;
  box-shadow: 0 10px 13px -6px rgba(0, 0, 0, 0.2),
    0 20px 31px 3px rgba(0, 0, 0, 0.14), 0 8px 38px 7px rgba(0, 0, 0, 0.12) !important;
  height: 100%;
  padding: 30px 15px;
  z-index: 20;
}
#app_filter .v-card {
  padding: 15px;
}
.slide-addform-enter-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-addform-enter,
.slide-addform-leave-to {
  transform: translateX(50px);
  opacity: 0;
}
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
.v-sheet {
  position: relative;
}
.v-card__text {
  max-height: 95px;
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