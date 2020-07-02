<template>
  <header class="headers">
    <v-toolbar >
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn class="add_button" v-on="on" icon @click="openEditForm">
            <v-icon>fa-plus</v-icon>
          </v-btn>
        </template>
        <span>Добавить обращение</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-btn id="user_settings" text x-large class="my-0">
        <v-avatar v-if="avatar !== ''" color="amber lighten-2 mx-3">
          <img :src="avatar" :alt="userName" />
        </v-avatar>
        <v-avatar v-else color="indigo">
          <v-icon dark>fa-user</v-icon>
        </v-avatar>
        {{userName}}
      </v-btn>
      <v-menu
        :close-on-content-click="false"
        activator="#user_settings"
        offset-y
        origin="bottom"
        transition="slide-y-transition"
      >
        <v-card>
          <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                icon
                @click="userSettings(item.fp)"
                :id="item.fp == 'theam' ? 'theam_setting' : ''"
              >
                <v-menu
                  max-width="320"
                  :close-on-content-click="false"
                  activator="#theam_setting"
                  :nudge-width="300"
                  left
                  offset-y
                  offset-x
                >
                  <theam-setting />
                </v-menu>

                
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <router-link v-if="item.fp == 'prophile'" to="/prophile">{{item.text}}</router-link>
                  <v-list-item-title v-else v-text="item.text"></v-list-item-title>
                </v-list-item-content>
                
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-menu>
    </v-toolbar>
    <v-spacer></v-spacer>
    <transition name="slide-addform">
      <app-form v-if="editor" :edited="false" addParam="add" />
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
const date = new Date();
import ymaps from "ymaps";
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import { mask } from "vue-the-mask";
import AppForm from "~/components/AppForm.vue";
import TheamSetting from "~/components/TheamSetting.vue";
export default {
  directives: {
    mask
  },
  data() {
    return {
      search: "",
      menu: false,
      create_date: "",
      create_time: "",
      control_date: "",
      control_time: "",
      phoneMask: "#-(###)-###-##-##",
      mobileMask: "#-(###)-###-##-##",
      items: [
        { text: "Тема", icon: "fa-paint-brush", fp: "theam" },
        { text: "Профиль", icon: "fa-user", fp: "prophile"},
        { text: "Выйти", icon: "fa-sign-out", fp: "logout" }
      ],
      post: {
        fio: "",
        creDate: date.toISOString().substr(0, 10), //null,
        creTime: date.getHours() + ":" + date.getMinutes(),
        conDate: null,
        conTime: date.getHours() + ":" + date.getMinutes(),
        address: null,
        selectstatus: "Не обработанная",
        regNumber: "",
        phoneNumber: "",
        mobileNumber: "",
        text: "",
        owner: null
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
      editor: false,
      maps: null
    };
  },
  created() {
    this.post.owner = this.user;
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
  computed: {
    ...mapGetters(["userName", "isLoginedIn", "avatar"])
  },
  methods: {
    ...mapActions(["addPost", "logout"]),
    async userSettings(fp) {
      if (fp == "logout") {
        await this.logout()
        .then(res => {
          this.$router.push("/login");
        })
        .catch(err => {
          console.log(err)
        })
      }
    },
    openEditForm() {
      if (this.editor) {
        this.editor = false;
      }
      setTimeout(() => {
        this.editor = !this.editor;
      }, 0);
    }
  },
  components: {
    AppForm,
    TheamSetting
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