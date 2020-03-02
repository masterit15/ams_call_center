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
                    v-model="formData.regNumber"
                    label="Регистр. номер"
                    prepend-icon="fa-address-card-o"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="formData.selectstatus"
                    :items="status"
                    label="Статус"
                    @change="changeStatus(formData.selectstatus)"
                    prepend-icon="fa-share"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.creDate"
                    label="Дата создания"
                    id="create_date" 
                    data-multiple-dates-separator=" - " 
                    class='datepicker-here '
                    prepend-icon="fa-calendar"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
            v-model="formData.conDate"
            label="Дата контрольная"
            id="control_date" 
            data-multiple-dates-separator=" - " 
            class='datepicker-here '
            prepend-icon="fa-calendar"
          ></v-text-field>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="12">
                  <v-text-field v-model="formData.fio" label="ФИО" prepend-icon="fa-user"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-combobox
                    v-model="formData.address"
                    :items="addressArr"
                    :loading="loading"
                    :search-input.sync="addresssearch"
                    label="Адрес"
                    prepend-icon="fa-map-marker"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.phoneNumber"
                    v-mask="phoneMask"
                    label="Домашний"
                    prepend-icon="fa-phone"
                  ></v-text-field>
                  <v-text-field
                    v-model="formData.mobileNumber"
                    v-mask="mobileMask"
                    label="Мобильный"
                    prepend-icon="fa-mobile"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.text"
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
                      <span>JL</span>
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
                        <v-btn class="mx-0" depressed @click="comment(formData)">Добавить</v-btn>
                      </template>
                    </v-text-field>
                  </v-timeline-item>

                  <v-slide-x-transition group>
                    <v-timeline-item
                      v-for="(event, index) in timeline"
                      :key="index"
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
                        >{{ event.time | Fdate('datetime')}}</v-col>
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
                @click="editsPost(formData)"
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
const date = new Date();
import 'air-datepicker'
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
      create_date: "",
      create_time: "",
      control_date: "",
      control_time: "",
      phoneMask: "#-(###)-###-##-##",
      mobileMask: "#-(###)-###-##-##",
      post: {},
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
    this.formData.owner = this.user;
  },
  mounted() {
    this.initializeYandexMap();
    $('#create_date').datepicker({
      timepicker: true,
      language: 'ru',
      // range: true,
      })
    $('#control_date').datepicker({
      timepicker: true,
      language: 'ru',
      // range: true,
      }) 
  },
  watch: {
    addresssearch(val) {
      val && val !== this.formData.address && this.querySelections(val);
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
      timeline () {
        this.events = this.formData.timeline
        return this.events.slice().reverse()
      },
    },
  methods: {
    ...mapActions(["loadPost", "loadPostTimeline", "editPost", "deletePost", "editPostTimeline"]),
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
    editsPost(data){
      this.loader = 'saveLoader'
      this.editPost(data)
      .then(res => {
        this.events.push({
          id: this.nonce++,
          event: 'edited',
          text: 'Был изменен',
          time: new Date(),
          autor: this.user
        })
        this.overlay = false
        this.$message(res.data.message)
      })
      .catch(error => {
        this.$error(error)
      })
    },
    changeStatus(status){
      this.events.push({
          id: this.nonce++,
          event: 'changestatus',
          text: 'Был изменен на " '+status+' "',
          time: new Date(),
          autor: this.user
        })
    },
      comment (data) {
        this.events.push({
          id: this.nonce++,
          event: 'comment',
          text: this.input,
          time: new Date(),
          autor: this.user
        })
        let params = {
          postId: data._id,
          timeline: this.events
        }
        this.editPostTimeline(params)
        .then(res => {
          this.$message(res.data.message)
        })
        .catch(error => {
          this.$error(error)
        })
        this.input = null
      },
    refreshForm() {
      this.search = "";
      this.formData.fio = "";
      this.items = [];
      this.formData.control_date = "";
      this.formData.create_date = "";
      this.formData.creDate = "";
      this.formData.conDate = "";
      this.formData.address = null;
      this.formData.addressArr = [];
      this.formData.addresssearch = null;
      this.formData.states = [];
      this.select = "";
      this.formData.regNumber = "";
      this.formData.phone = "";
      this.formData.text = "";
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