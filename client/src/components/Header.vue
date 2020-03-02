<template>
  <header class="headers">
    <v-toolbar dark color="indigo">
      <v-btn class="menu-open" icon @click="miniVar = !miniVar" right>
        <v-icon>fa-outdent</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" dark color="amber lighten-3" icon @click="editor = !editor">
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
    <v-spacer></v-spacer>
    <transition name="slide-addform">
      <app-form
      v-if="editor"
      addParam="add"
      />
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
import AppForm from '~/components/AppForm.vue'
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
      miniVar: true,
      saveLoader: false,
      editor: false,
      maps: null
    };
  },
  created() {
    this.post.owner = this.user;
  },
  mounted() {
    this.initializeYandexMap();
    this.saveOption();
  },
  watch: {
    miniVar() {
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
    user() {
      console.log(this.user);
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
    ...mapGetters(["user", "isLoginedIn"])
  },
  methods: {
    ...mapActions(["addPost", "miniAside", "logout"]),
    async logouted() {
      await this.logout();
      if (this.isLoginedIn === "") {
        this.$router.push("/login");
      }
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
        this.miniAside(true);
      }
    },
    dateFormat(val) {
      return moment(val).format("YYYY-MM-DD в HH:mm:ss");
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
  },
  components: {
    AppForm
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