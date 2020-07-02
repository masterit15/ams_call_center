<template>
  <div id="settings-wrapper">
<v-card class="text-center mb-0 px-4 py-4" width="320" height="435">
          <strong class="mb-3 d-inline-block">Настройки темы</strong>
          <v-item-group v-model="color">
            <v-item v-for="color in colors" :key="color" :value="color">
              <template v-slot="{ active, toggle }">
                <v-avatar
                  :class="active && 'v-settings__item--active'"
                  :color="color"
                  class="v-settings__item"
                  size="25"
                  @click="toggle"
                />
              </template>
            </v-item>
          </v-item-group>
          <v-divider class="my-4 secondary" />
          <v-row align="center" no-gutters>
            <v-col cols="auto">Темная тема</v-col>
            <v-spacer />
            <v-col cols="auto">
              <v-switch
                v-model="$vuetify.theme.dark"
                class="ma-0 pa-0"
                color="secondary"
                hide-details
              />
            </v-col>
          </v-row>
          <v-divider class="my-4 secondary" />
          <v-row align="center" no-gutters>
            <v-col cols="auto">Задать фон</v-col>
            <v-spacer />
            <v-col cols="auto">
              <v-switch v-model="showImg" class="ma-0 pa-0" color="secondary" hide-details />
            </v-col>
          </v-row>

          <v-divider class="my-4 secondary" />

          <strong class="mb-3 d-inline-block">Изображения фона</strong>
          <v-item-group v-model="image" class="d-flex justify-space-between mb-3">
            <v-item v-for="image in images" :key="image" :value="image" class="mx-1">
              <template v-slot="{ active, toggle }">
                <v-sheet
                  :class="active && 'v-settings__item--active'"
                  class="d-inline-block v-settings__item"
                  @click="toggle"
                >
                  <v-img :src="image" height="100" width="50" />
                </v-sheet>
              </template>
            </v-item>
          </v-item-group>
          <v-btn color="primary" dark @click="resetOption">Сбросить</v-btn>
      </v-card>
  </div>
</template>

<script>
// Mixins
import Proxyable from "vuetify/lib/mixins/proxyable";
import { mapMutations, mapState } from "vuex";
var img = [
  '../assets/img/sidebar_bg/sidebar-1.jpg',
  '../assets/img/sidebar_bg/sidebar-2.jpg',
  '../assets/img/sidebar_bg/sidebar-3.jpg',
  '../assets/img/sidebar_bg/sidebar-4.jpg'
  ]
export default {
  mixins: [Proxyable],
  data: () => ({
    color: localStorage.getItem('barColor') || "#03A9F4",
    colors: ["#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#FFEB3B", "#FF5252"],
    image: localStorage.getItem('barImage') || img[0],
    images: [
      ...img
    ],
    menu: false,
    saveImage: "",
    showImg: true
  }),
  computed: {
    ...mapState(["barImage"])
  },
  watch: {
    color(val) {
      this.$vuetify.theme.themes[this.isDark ? "dark" : "light"].primary = val;
      localStorage.setItem('barColor', val)
      this.setBarColor(val)
    },
    showImg(val) {
      if (!val) {
        this.saveImage = this.barImage;
        this.setBarImage("");
      } else if (this.saveImage) {
        this.setBarImage(this.saveImage);
        this.saveImage = "";
      } else {
        this.setBarImage(this.barImage);
      }
    },
    image(val) {
      this.setBarImage(val);
    }
  },

  methods: {
    ...mapMutations({
      setBarImage: "SET_BAR_IMAGE",
      setBarColor: "SET_BAR_COLOR"
    }),
    resetOption(){
      localStorage.removeItem('barColor')
      localStorage.removeItem('barColorhex')
      localStorage.removeItem('barImage')
    },
  }
};
</script>

<style>
.v-settings__item{
  cursor: pointer;
  margin: 0px 10px;
  border: 2px solid transparent;
}
.v-settings__item:hover{
  border: 2px solid;
  border-color: #00cae3!important;
}
.v-settings__item--active{
  border: 2px solid;
  border-color: #00cae3!important;
}
</style>
