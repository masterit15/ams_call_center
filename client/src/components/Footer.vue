<template>
  <v-footer color="grey lighten-4" absolute height="64" class="footers font-weight-medium ">
    <div class="chat_btn primary">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" color="primary" fab x-large dark @click="showChat">
            <v-icon>fa-comments-o</v-icon>
          </v-btn>
        </template>
        <span>Открыть чат</span>
      </v-tooltip>
    </div>
    <modal 
    name="chat" 
    :draggable="true"
    width="920"
    height="720"
    :resizable="true"
    >
    <!-- <div class="cyan chat_head">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn class="close_btn" v-on="on" icon @click="hideChat" color="red">
            <v-icon>fa-close</v-icon>
          </v-btn>
        </template>
        <span>Закрыть</span>
      </v-tooltip>
    </div> -->
    <chat/>
 </modal>
    <div class="cophiright">
      {{ new Date().getFullYear() }} — <strong>masterit15</strong>
    </div>
  </v-footer>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Chat from "~/components/Chat.vue";
export default {
  data() {
    return {
      chat: false
    };
  },
  methods:{
    showChat() {
      this.$modal.show('chat');
    },
    hideChat() {
      this.$modal.hide('chat');
    },
  },
  components: {
    Chat
  }
};
</script>
<style scoped>
.v-footer--absolute{
  width: auto!important;
}
.footers{
  text-align: center;
}
.cophiright{
  width: 100%;
  height: 100%;
  padding: 20px;
}
.chat_btn {
  position: fixed;
  right: 30px;
  bottom: 30px;
  border-radius: 100%;
  background-color: #fff;
}
.chat_head {
  width: 100%;
  height: 60px;
  position: relative;
  border-radius: 5px 5px 0 0;
}
.chat_head .close_btn {
  position: absolute;
  right: 20px;
  top: 10px;
}
</style>