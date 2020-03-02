<template>
<div v-if="overlay" class="add_form elevation-20">
        <div class="add_form_close" :elevation="7">
          <v-btn icon @click="overlay = false" color="error">
            <v-icon>fa-close</v-icon>
          </v-btn>
        </div>
        <v-divider></v-divider>
        <v-form ref="form">
            <v-alert
              v-model="alert"
              border="left"
              close-text="Закрыть"
              color="light-green accent-1"
              dark
              dismissible
            >{{alertText}}</v-alert>
            <v-row>
              <v-col sm="6">
                <v-col cols="12">
                  <v-text-field
                    v-model="post.regNumber"
                    label="Регистр. номер"
                    prepend-icon="fa-address-card-o"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="post.selectstatus"
                    :items="status"
                    label="Статус"
                    prepend-icon="fa-share"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field
            v-model="post.creDate"
            label="Дата создания"
            id="create_date" 
            data-multiple-dates-separator=" - " 
            class='datepicker-here '
            prepend-icon="fa-calendar"
            data-time-format='hh:ii:00'
          ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
            v-model="post.conDate"
            label="Дата контрольная"
            id="control_date" 
            data-multiple-dates-separator=" - " 
            class='datepicker-here '
            prepend-icon="fa-calendar"
            data-time-format='hh:ii:00'
          ></v-text-field>
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
              </v-col>

              <v-col sm="6">
                <v-timeline dense clipped>
                  <v-timeline-item fill-dot class="white--text mb-12" color="orange" large>
                    <template v-slot:icon>
                      <v-icon>fa-user</v-icon>
                    </template>
                    <v-text-field
                      v-model="input"
                      hide-details
                      flat
                      label="Добавить комментарий"
                      solo
                      @keydown.enter="comment"
                    >
                      <template v-slot:append>
                        <v-btn class="mx-0" depressed @click="comment">Добавить</v-btn>
                      </template>
                    </v-text-field>
                  </v-timeline-item>
                  <v-slide-x-transition group>
                    <v-timeline-item
                      v-for="event in timeline"
                      :key="event.id"
                      class="mb-4"
                      :color="timelineColor(event.event)"
                      small
                    >
                      <v-row justify="space-between">
                        <v-col
                          cols="6"
                        >{{ event.autor }}
                        </v-col>
                        <v-col
                          class="text-right"
                          cols="6"
                        >{{ event.time }}</v-col>
                        <v-col cols="12" v-text="event.text"></v-col>
                      </v-row>
                    </v-timeline-item>
                  </v-slide-x-transition>
                </v-timeline>
              </v-col>
            </v-row>
            <v-card-actions>
              <!-- <v-spacer></v-spacer> -->
              <v-btn
                :loading="saveLoader"
                :disabled="saveLoader"
                color="info"
                @click="onSubmit"
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
        </v-form>
      </div>
</template>

<script>
const options = {}
options.day = '2-digit' // параметр отображения numeric | 2-digit
options.month = '2-digit' // параметр отображения long | 2-digit
options.year = 'numeric' // параметр отображения numeric | 2-digit
options.hour = '2-digit' // параметр отображения numeric | 2-digit
options.minute = '2-digit' // параметр отображения numeric | 2-digit
options.second = '2-digit' // параметр отображения numeric | 2-digit
let dates = new Intl.DateTimeFormat('ru-RU', options).format(new Date())
let datearr = dates.split(',')
let nowdate = datearr[0]+''+datearr[1]
import ymaps from "ymaps";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import { mask } from "vue-the-mask";
export default {
  directives: {
    mask
  },
  props: {
    formData: Object
  },
  data() {
    return {
      events: [],
      input: null,
      nonce: 0,
      search: "",
      menu: false,
      phoneMask: "#-(###)-###-##-##",
      mobileMask: "#-(###)-###-##-##",
      post: {
        fio: "",
        creDate: nowdate, //null,
        conDate: null,
        address: null,
        selectstatus: "Не обработанная",
        regNumber: "",
        phoneNumber: "",
        mobileNumber: "",
        text: "",
        owner: null,
        timeline: []
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
      saveLoader: false,
      overlay: true,
      maps: null
    };
  },
  created() {
    this.post.owner = this.user;
  },
  mounted() {
    this.initializeYandexMap();
    const that = this
    $('#create_date').datepicker({
      timepicker: true,
      language: 'ru',
      onSelect: function (formattedDate, date, inst) {
        if (date) {
          that.post.creDate = formattedDate
        }
      }
      }).data('datepicker');
    $('#control_date').datepicker({
      timepicker: true,
      language: 'ru',
      // range: true,
      onSelect: function (formattedDate, date, inst) {
        if (date) {
          that.post.conDate = formattedDate
        }
      }
      }).data('datepicker');
  },
  watch: {
    formData(){
      this.post = this.formData
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
    ...mapGetters(['user']),
      timeline () {
        return this.events.slice().reverse()
      },
    },
  methods: {
    ...mapActions(["addPost", "miniAside", "logout"]),
    onSubmit(){
      this.loader = 'saveLoader'
      this.post.timeline = this.events
      this.addPost(this.post)
    },
      comment () {
        const options = {}
        options.day = '2-digit' // параметр отображения numeric | 2-digit
        options.month = '2-digit' // параметр отображения long | 2-digit
        options.year = 'numeric' // параметр отображения numeric | 2-digit
        options.hour = '2-digit' // параметр отображения numeric | 2-digit
        options.minute = '2-digit' // параметр отображения numeric | 2-digit
        options.second = '2-digit' // параметр отображения numeric | 2-digit
        let dates = new Intl.DateTimeFormat('ru-RU', options).format(new Date())
        let datearr = dates.split(', ')
        let nowdate = datearr[0]+' '+datearr[1]
        this.events.push({
          id: this.nonce++,
          event: 'comment',
          text: this.input,
          time: nowdate,
          autor: this.user
        })
        this.input = null
      },
      timelineColor(event){
        var ev
        switch (event) {
          case 'message':
            ev = 'pink'
            break;
          case 'edited':
            ev = 'blue'
            break;
          case 'changestatus':
            ev = 'green'
            break;  
          default:
            ev = 'pink'
            break;
        }
        return ev
      },
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
.v-form {
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