import Vue from 'vue'
//import Vuetify from 'vuetify'
import Vuetify from 'vuetify'
//import '~/sass/overrides.sass'

Vue.use(Vuetify)

// css 
import 'vuetify/dist/vuetify.min.css'
import 'font-awesome/css/font-awesome.min.css'

const theme = {
  primary: localStorage.getItem('barColor') || '#3F51B5',
  secondary: '#3949AB',
  accent: '#FFEB3B',
  info: '#00CAE3',
}

const opts = {
  icons: {
    iconfont: 'fa4',
  },
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
}

export default new Vuetify(opts)