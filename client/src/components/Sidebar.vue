<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :color="color"
      :expand-on-hover="expandOnHover"
      :mini-variant="miniVariant"
      :right="right"
      :width="width"
      :fixed="fixed"
      absolute
      dark
    >
      <v-list dense nav class="py-0">
        <v-list-item two-line>
          <v-list-item-avatar color="amber lighten-2">
          <v-icon dark>fa-user-o</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{user}}</v-list-item-title>
          </v-list-item-content>
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
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
        { title: "Настройки", icon: "fa-cogs", href: "/options" }
      ],
      color: "indigo",
      colors: ["primary", "blue", "success", "red", "teal"],
      right: false,
      width: 300,
      fixed: true,
      background: false
    };
  },
  mounted() {
  },
  computed: {
    ...mapGetters(['user', 'isLoginedIn', 'miniVariant', 'expandOnHover'])
  },
};
</script>

<style>
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
.headers, .main-content {
  margin-left: 80px;
  transition: margin-left 0.3s ease;
}
.open .main-content, .open .headers {
  margin-left: 300px;
  transition: margin-left 0.3s ease;
}
</style>