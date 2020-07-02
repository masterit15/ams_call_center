<template>
    <v-navigation-drawer
      v-model="drawer"
      :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
      color="primary"
      :expand-on-hover="expandOnHover"
      :src="barImage"
      :mini-variant="miniVariant"
      :right="right"
      :width="width"
      :fixed="fixed"
      v-bind="$attrs"
      absolute
      permanent
    >
    <template v-slot:img="props">
      <v-img
        :gradient="`to bottom, ${barColor}`"
        v-bind="props"
      />
    </template>

      <v-list dense nav class="py-0">
        <v-list-item two-line>
          <v-btn class="menu-open" icon @click="miniVariant = !miniVariant" right>
            <v-icon>fa-outdent</v-icon>
          </v-btn>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item v-for="item in items" :key="item.title" link>
          <router-link :to="item.href">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </router-link>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
export default {
  data() {
    return {
      drawer: true,
      items: [
        { title: "Главная", icon: "fa-home", href: "/" },
        { title: "Обращения", icon: "fa-file", href: "/applications" },
        { title: "Архив", icon: "fa-archive", href: "/archive" },
        { title: "Статистика", icon: "fa-pie-chart", href: "/statistic" },
        { title: "Пользователи", icon: "fa-users", href: "/users" },
      ],
      right: false,
      width: 300,
      fixed: true,
      background: false,
      miniVariant: Boolean(localStorage.getItem('sidebar')) || true,
      expandOnHover: Boolean(localStorage.getItem('sidebar')) || true,
    };
  },
  watch: {
    miniVariant(){
      let main = document.querySelector("body");
      if (!this.miniVariant) {
        main.classList.remove("close");
        main.classList.add("open");
        localStorage.setItem("asideOpen", "open");
        this.expandOnHover = false
        localStorage.setItem('sidebar', 0)
      } else {
        localStorage.setItem('sidebar', 1)
        main.classList.remove("open");
        main.classList.add("close");
        localStorage.setItem("asideOpen", "close");
        this.expandOnHover = true
      }
    }
  },
  computed: {
    ...mapGetters([
    'user',
    'avatar', 
    'isLoginedIn', 
    'barColor', 
    'barImage'
    ])
  },
  mounted(){
    let main = document.querySelector("body");
      if (localStorage.getItem("asideOpen") === "open") {
        main.classList.remove("close");
        main.classList.add("open");
        this.miniVariant = false
        this.expandOnHover = false
      } else {
        main.classList.remove("open");
        main.classList.add("close");
        this.miniVariant = true
        this.expandOnHover = true
      }
  },
  methods: {
    ...mapActions([''])
  }
};
</script>

<style scoped>
.v-navigation-drawer{
  position: fixed;
  min-width: 80px;
  z-index: 20;
}
.logout {
  position: fixed;
  left: 10px;
  bottom: 20px;
  z-index: 20;
}
.v-list-item--link {
  /* text-align: center; */
  width: 100%;
  margin: 15px 0;
}
.v-list-item--link a {
  display: block;
  color: #fff !important;
  position: relative;
  float: left;
  text-align: center;
  width: 100%;
}
.open .v-list-item--link a .v-list-item__content {
  float: left;
  display: block;
}
.v-list-item__content,
.v-list-item__icon {
  float: none;
  margin: 0 15px;
}
.v-navigation-drawer:hover .v-list-item__content,
.v-list-item__icon {
  float: left;
}
.v-list-item--link a .v-list-item__content {
  display: none;
}
.v-navigation-drawer:hover a .v-list-item__content {
  display: block;
}
.v-navigation-drawer:hover .v-list-item--link {
  text-align: left;
}
.v-navigation-drawer--is-mouseover .v-btn--icon.v-size--default {
  float: right;
}
.menu-open {
  margin: 22px;
  display: block;
  transform: rotate(180deg);
  transition: all 0.3s ease;
}
.open .menu-open {
  float: right;
  transform: rotate(0deg);
  transition: all 0.3s ease;
}
</style>