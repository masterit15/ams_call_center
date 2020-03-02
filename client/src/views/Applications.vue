<template>
  <div>
    <v-toolbar dark color="indigo darken-3" class="mb-1">
      <v-btn-toggle v-model="sortIsmain" mandatory>
        <v-btn large depressed color="blue" value="main">Мои</v-btn>
        <v-btn large depressed color="blue" value="all">Все</v-btn>
      </v-btn-toggle>
      <v-spacer></v-spacer>
      <v-btn @click="exportXML(posts)">Выгрузить в XML</v-btn>

      <input 
      id="datefilter" 
      type="text" 
      data-multiple-dates-separator=" - " 
      class='datepicker-here '/>

      <v-dialog v-model="expDialog" max-width="290">
        <v-card>
          <a class="btn" :href="expFile" download>Скачать</a>
        </v-card>
      </v-dialog>
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
        <v-col
          v-for="(item, index) in posts"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="4"
        >
          <v-card class="mx-auto" min-height="460">
            <v-toolbar dark :color="statuscolor(item.selectstatus)">
              <v-toolbar-title>{{item.selectstatus}}</v-toolbar-title>
            </v-toolbar>
            <v-card-title class="subtitle-2" color="#26c6da">ФИО: {{ item.fio }}</v-card-title>
            <v-divider class="mx-4"></v-divider>
            <v-card-subtitle>
              <span>
                <strong>Дата:</strong>
                {{item.creDate | Fdate('data') }}
              </span>
              <v-divider></v-divider>
              <span>
                <strong>Контрольная дата:</strong>
                {{item.conDate | Fdate('data') }}
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

    <transition name="slide-addform">
      <EditForm
      v-if="editor"
      :formData="post"
      />
    </transition>
  </div>
</template>
<script>
import axios from "axios";
import ymaps from "ymaps";
import { mapGetters, mapActions } from "vuex";
import EditForm from '~/components/EditForm.vue'
export default {
  components: {
    EditForm
  },
  data() {
    return {
      events: [],
      input: null,
      nonce: 0,
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
      expFile: "",
      expDialog: false,
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
  mounted() {
    $('#datefilter').datepicker({
      timepicker: true,
      language: 'ru',
      range: true,
      multipledatesseparator: " - "
      })
  },
  computed: {
    ...mapGetters(["posts", "postsstatus", "message", "pagination"]),
    timeline () {
        return this.events.slice().reverse()
      },
  },
  methods: {
    ...mapActions(["loadPost", "editPost", "deletePost", "exportsXML"]),
    comment () {
        const time = (new Date()).toTimeString()
        this.events.push({
          id: this.nonce++,
          text: this.input,
          time: time.replace(/:\d{2}\sGMT-\d{4}\s\((.*)\)/, (match, contents, offset) => {
            return ` ${contents.split(' ').map(v => v.charAt(0)).join('')}`
          }),
        })

        this.input = null
      },
    exportXML(data) {
      this.exportsXML(data)
        .then(res => {
          this.expFile = res.data.files;
          this.expDialog = true;
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
    async openEditForm(post) {
      this.post = await post;
      setTimeout(() => {
        this.editor = !this.editor;
      }, 0);
      
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
  },
};
</script>
<style>
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
.v-sheet{
  position: relative;
  z-index: 99;
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