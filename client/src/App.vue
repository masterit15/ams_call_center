<template>
  <div id="app">
    <v-app>
      <component :is="layout">
        <router-view></router-view>
      </component>
    </v-app>
  </div>
</template>

<script>
import EmptyLayout from '~/layouts/Emptylayout.vue'
import MainLayout from '~/layouts/Mainlayout.vue'
import {mapActions, mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters(['isLoginedIn']),
    layout(){
      return (this.$route.meta.layout || 'empty') + '-layout'
    }
  },
  components: {
    EmptyLayout, MainLayout
  }
};
</script>
<style>
@import '../node_modules/air-datepicker/dist/css/datepicker.css';
.main-content {
  position: relative;
}
.slide-fade-enter-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(50px);
  opacity: 0;
}
</style>