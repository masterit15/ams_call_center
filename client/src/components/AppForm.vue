<template>
  <div v-if="appform" class="add_form elevation-20">
    <div class="add_form_close" :elevation="7">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon @click="appform = false" color="error">
            <v-icon>fa-close</v-icon>
          </v-btn>
        </template>
        <span>Закрыть</span>
      </v-tooltip>
    </div>
    <div class="add_button add_form_edit">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon dark color="green" @click="edit = !edit">
            <v-icon>fa-pencil-square-o</v-icon>
          </v-btn>
        </template>
        <span>Редактировать</span>
      </v-tooltip>
    </div>
    <div class="add_button add_form_delete">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" icon dark color="blue-grey" @click="deletePosts">
            <v-icon>fa-trash</v-icon>
          </v-btn>
        </template>
        <span>Удалить</span>
      </v-tooltip>
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
              v-model="post.regnumber"
              label="Регистр. номер"
              prepend-icon="fa-address-card-o"
              :disabled="disabledForm"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="post.selectstatus"
              :items="status"
              label="Статус"
              prepend-icon="fa-share"
              :disabled="disabledForm"
              @change="changeStatus(post.selectstatus)"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="post.credate"
              label="Дата создания"
              id="create_date"
              data-multiple-dates-separator=" - "
              class="datepicker-here"
              prepend-icon="fa-calendar"
              data-date-format="dd.mm.yyyy,"
              data-time-format="hh:ii:00"
              autocomplete="off"
              :disabled="disabledForm"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="post.condate"
              label="Дата контрольная"
              id="control_date"
              data-multiple-dates-separator=" - "
              class="datepicker-here"
              prepend-icon="fa-calendar"
              data-date-format="dd.mm.yyyy,"
              data-time-format="hh:ii:00"
              autocomplete="off"
              :disabled="disabledForm"
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12">
            <v-text-field
              :disabled="disabledForm"
              v-model="post.fio"
              label="ФИО"
              prepend-icon="fa-user"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-combobox
              v-model="post.address"
              :items="addressArr"
              :loading="loading"
              :search-input.sync="addresssearch"
              label="Адрес"
              prepend-icon="fa-map-marker"
              :disabled="disabledForm"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="post.phonenumber"
              v-mask="phoneMask"
              label="Домашний"
              prepend-icon="fa-phone"
              :disabled="disabledForm"
            ></v-text-field>
            <v-text-field
              v-model="post.mobilenumber"
              v-mask="mobileMask"
              label="Мобильный"
              prepend-icon="fa-mobile"
              :disabled="disabledForm"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <div class="text" v-if="disabledForm">
              <span>Текст обращения:</span>
              <br />
              {{post.text}}
            </div>
            <v-textarea
              v-else
              v-model="post.text"
              name="input-7-1"
              label="Текст обращения"
              prepend-icon="fa-pencil-square-o"
              value
              hint
              :disabled="disabledForm"
            ></v-textarea>
          </v-col>
        </v-col>

        <v-col class="timeline" sm="6">
          <v-timeline dense clipped>
            <v-timeline-item fill-dot class="white--text mb-12" color="orange" large>
              <template v-slot:icon>
                <v-avatar v-if="avatar !== ''" color="amber lighten-2 mx-3">
                  <img :src="avatar" :alt="userName" />
                </v-avatar>
                <v-avatar v-else color="indigo">
                  <v-icon dark>fa-user</v-icon>
                </v-avatar>
              </template>
              <v-text-field
                v-model="input"
                label="Добавить комментарий"
                @keydown.enter="comment"
                :disabled="!edited"
              ></v-text-field>
              <v-file-input
                :disabled="!edited"
                ref="file"
                show-size
                prepend-inner-icon="fa-upload"
                label="Прикрепить файл"
                :rules="rules"
                accept=".png,.jpeg,.jpg,.rar,.PDF,.pdf,.zip,.doc,.docx,.xls,.xlsx"
                @change="uploadCommentFile"
              ></v-file-input>
              <v-btn
                class="mx-0"
                :disabled="!edited"
                color="green"
                dark
                @click="comment(formData)"
              >Добавить</v-btn>
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
                  <v-col cols="6">{{ event.autor }}</v-col>
                  <v-col class="text-right" cols="5">{{ event.time | Fdate('datetime')}}</v-col>
                  <v-col cols="1" v-if="event.userId == userId">
                    <v-btn :id="'timeline_menu-'+index" icon>
                      <v-icon>fa-ellipsis-v</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12">
                    {{event.text}}
                    <div class="comment_file" v-if="event.file">
                      <v-dialog 
                      width="800" 
                      v-if="fileType(event.file) == 'fa-file-image-o'"
                      >
                        <template v-slot:activator="{ on }">
                          <v-img :src="event.file" :alt="event.file" v-on="on"></v-img>
                        </template>
                        <v-img :src="event.file" :alt="event.file"></v-img>
                      </v-dialog>
                      <a class="files" :href="event.file" v-else download>
                        <v-icon>{{fileType(event.file)}}</v-icon>
                      </a>
                    </div>
                  </v-col>
                </v-row>
                <v-menu
                  max-width="320"
                  :nudge-width="200"
                  :close-on-content-click="false"
                  :activator="'#timeline_menu-'+index"
                  left
                  offset-y
                  offset-x
                >
                  <v-list>
                    <v-list-item-group color="primary">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>fa-trash</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title @click="timelineDelete(event.id)">Удалить</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
                  </v-list>
                </v-menu>
              </v-timeline-item>
            </v-slide-x-transition>
          </v-timeline>
        </v-col>
      </v-row>
      <v-card-actions>
        <!-- <v-spacer></v-spacer> -->
        <v-btn v-if="disabledForm" :loading="saveLoader" :disabled="!saveLoader" color="info" @click="onSubmit">
          Сохранить
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>fa-refresh</v-icon>
            </span>
          </template>
        </v-btn>
        <v-btn v-else :loading="saveLoader" color="info" @click="updatePost(post)">
          Обновить
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>fa-refresh</v-icon>
            </span>
          </template>
        </v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script>
function dateFormate(format = "date") {
  const options = {};
  if (format.includes("date")) {
    options.day = "2-digit"; // параметр отображения numeric | 2-digit
    options.month = "2-digit"; // параметр отображения long | 2-digit
    options.year = "numeric"; // параметр отображения numeric | 2-digit
  }
  if (format.includes("time")) {
    options.hour = "2-digit"; // параметр отображения numeric | 2-digit
    options.minute = "2-digit"; // параметр отображения numeric | 2-digit
    options.second = "2-digit"; // параметр отображения numeric | 2-digit
  }
  return new Intl.DateTimeFormat("ru-RU", options).format(new Date());
}
import ymaps from "ymaps";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import { mask } from "vue-the-mask";
export default {
  directives: {
    mask
  },
  props: {
    edited: Boolean,
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
      commentheight: 140,
      post: {
        fio: "",
        credate: dateFormate("datetime"), //null,
        condate: null,
        address: null,
        selectstatus: "Не обработан",
        regnumber: "",
        phonenumber: "",
        mobilenumber: "",
        text: "",
        userId: null
      },
      commentFile: "",
      rules: [
        value =>
          !value ||
          value.size < 2000000 ||
          "Размер аватара не должен превышать 2 МБ!"
      ],
      states: [],
      addressArr: [],
      addresssearch: null,
      status: ["Не обработан", "В работе", "Обработана"],
      loader: null,
      alert: false,
      alertText: "",
      loading: false,
      maploader: null,
      saveLoader: false,
      overlay: true,
      appform: true,
      edit: false,
      added: false,
      maps: null
    };
  },
  mounted() {
    this.initializeYandexMap();
    if (!this.edited) {
      this.appform = true;
    }
    const that = this;
    $("#create_date")
      .datepicker({
        timepicker: true,
        language: "ru",
        onSelect: function(formattedDate, date, inst) {
          if (date) {
            that.post.credate = formattedDate;
          }
        }
      })
      .data("datepicker");
    $("#control_date")
      .datepicker({
        timepicker: true,
        language: "ru",
        // range: true,
        onSelect: function(formattedDate, date, inst) {
          if (date) {
            that.post.condate = formattedDate;
          }
        }
      })
      .data("datepicker");
  },
  watch: {
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
  created() {
    if (this.formData !== undefined) {
      this.post = this.formData;
      this.loadTimeline(this.formData.id);
    }
  },
  computed: {
    ...mapGetters([
      'userName', 
      'userId', 
      'timelines',
      'avatar'
      ]),
    timeline() {
      if (this.edited) {
        this.events = this.timelines;
      }
      if (this.timelines !== undefined) {
        return this.events.slice().reverse();
      }
    },
    disabledForm() {
      if (this.formData !== undefined && !this.edit) {
        return true;
      }
      return false;
    }
  },
  methods: {
    ...mapActions([
      "addPost",
      "miniAside",
      "logout",
      "loadPost",
      "loadPostTimeline",
      "editPost",
      "deletePost",
      "editPostTimeline",
      "deleteTimelineItem",
      "getUser",
      "loadTimeline",
      "uploadFiles"
    ]),
    fileType(filename) {
      let fType = filename.split('.').pop()
      var icon = 'fa-file'
      switch (fType) {
        case 'gif':
          icon = 'fa-file-image-o'
          break;
        case 'png':
          icon = 'fa-file-image-o'
          break;
        case 'jpg':
          icon = 'fa-file-image-o'
          break;
        case 'jpeg':
          icon = 'fa-file-image-o'
          break;  
        case 'pdf':
          icon = 'fa-file-pdf-o'
          break;
        case 'PDF':
          icon = 'fa-file-pdf-o'
          break;
        case 'doc':
          icon = 'fa-file-word-o'
          break;
        case 'docx':
          icon = 'fa-file-word-o'
          break;
        case 'xls':
          icon = 'fa-file-pdf-o'
          break; 
        case 'xlsx':
          icon = 'fa-file-pdf-o'
          break;
        case 'zip':
          icon = 'fa-file-archive-o'
          break;  
        case 'rar':
          icon = 'fa-file-archive-o'
          break; 
      }
      return icon
    },
    fileIcon(ftype) {
      var icon = 'fa-file'
      switch (fType) {
        case 'pdf':
          icon = 'fa-file-pdf-o'
          break;
        case 'PDF':
          icon = 'fa-file-pdf-o'
          break;
        case 'doc':
          icon = 'fa-file-word-o'
          break;
        case 'docx':
          icon = 'fa-file-word-o'
          break;
        case 'xls':
          icon = 'fa-file-pdf-o'
          break; 
        case 'xlsx':
          icon = 'fa-file-pdf-o'
          break;
        case 'zip':
          icon = 'fa-file-archive-o'
          break;  
        case 'rar':
          icon = 'fa-file-archive-o'
          break; 
      }
      return icon
    },
    async onSubmit() {
      this.loader = "saveLoader";
      this.post.userId = this.userId;
      this.post.credate = new Date(this.post.credate);
      this.post.condate = new Date(this.post.condate);
      await this.addPost(this.post)
        .then(res => {
          console.log(res.data.message);
          this.$message(res.data.message);
          this.loadPost();
          this.edited = false;
        })
        .catch(err => {
          console.log(res.data.message);
          this.$error(err);
        });
    },
    async deletePosts() {
      let res = await this.deletePost(this.post.id);
      if (res.data.success) {
        this.$message(res.data.message);
        this.appform = false;
        this.loadPost();
      } else {
        this.$error(res.data.message);
      }
    },
    timelineColor(event) {
      var ev;
      switch (event) {
        case "message":
          ev = "pink";
          break;
        case "edited":
          ev = "blue";
          break;
        case "changestatus":
          ev = "green";
          break;
        case "created":
          ev = "lime";
          break;
        default:
          ev = "pink";
          break;
      }
      return ev;
    },
    async timelineDelete(id) {
      if (confirm("Вы уверены что хотите удалить комментарий?")) {
        let res = await this.deleteTimelineItem(id)
        if(res.data.success){
          this.$message(res.data.message)
          this.loadTimeline(this.formData.id)
        }
      }
    },
    updatePost(data) {
      this.loader = "saveLoader";
      this.editPost(data)
        .then(async res => {
          let params = {
            event: "edited",
            text: "Обращение было обновлено",
            time: new Date(),
            postId: this.formData.id,
            userId: this.userId
          };
          await this.editPostTimeline(params)
            .then(res => {
              this.loadTimeline(this.formData.id);
              this.$message(res.data.message);
            })
            .catch(err => {
              this.$error(err);
            });
          this.overlay = false;
          this.$message(res.data.message);
        })
        .catch(err => {
          this.$error(err);
        });
    },
    async changeStatus(status) {
      this.formData.credate = this.credate;
      this.formData.condate = this.condate;
      let res = await this.editPost(this.formData);
      if (res.data.success) {
        let params = {
          event: "changestatus",
          text: 'Был изменен на статус " ' + status + ' "',
          time: new Date(),
          postId: this.formData.id,
          userId: this.userId
        };
        await this.editPostTimeline(params)
          .then(res => {
            this.loadTimeline(this.formData.id);
            this.$message(res.data.message);
          })
          .catch(error => {
            this.$error(error);
          });
      }
    },
    uploadCommentFile(event) {
      // this.$refs.file.$refs.input.files[0]
      this.uploadFiles(event)
        .then(res => {
          this.commentFile = res;
        })
        .catch(err => {
          console.log(err);
        });
    },
    async comment(data) {
      let params = {
        event: "comment",
        text: this.input,
        time: new Date(),
        file: this.commentFile,
        postId: this.formData.id,
        userId: this.userId
      };
      await this.editPostTimeline(params)
        .then(res => {
          this.loadTimeline(this.formData.id);
          this.$message(res.data.message);
        })
        .catch(error => {
          this.$error(error);
        });
      this.input = null;
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
.add_form .timeline{
  max-height: 770px;
  overflow-y: scroll;
}
.text {
  padding: 20px 35px;
}
.text span {
  color: rgba(0, 0, 0, 0.38);
  font-size: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none;
}
.comment_file {
  width: 100%;
  height: 100%;
  max-width: 170px;
  cursor: pointer;
  margin: 0px 0px 15px 15px;
  float: right;
  position: relative;
  display: block;
}
.comment_file .files{
  position: absolute;
  width: 100%;
  height: 100%;
  min-height: 55px;
  text-align: center;
}
.comment_file .files .fa{
  font-size: 3rem;
}
.add_form_close,
.add_form_edit,
.add_form_delete {
  overflow: hidden;
}
.v-form {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.v-list-item__content {
  text-align: left;
}
.v-timeline-item .v-input__prepend-outer {
  display: none !important;
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