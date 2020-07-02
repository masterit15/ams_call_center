<template>
  <div class="chat_wrapper" v-if="active">
    <div class="chat_container">
      <div class="left chat_aside">
        <!-- <pre>{{chats}}</pre> -->
        <v-row class="mx-0">
          <v-col class="mx-0 px-0" sm="10">
            <v-text-field
              v-model="search"
              class="chat_search"
              flat
              hide-details
              label="Поиск"
              prepend-inner-icon="fa-search"
              solo-inverted
            ></v-text-field>
          </v-col>
          <v-col class="mx-0 px-0 py-4" sm="2">
            <v-btn
              @click="us_list = !us_list"
              class="add_btn ma-2"
              outlined
              small
              fab
              color="green"
            >
              <v-icon>fa-pencil</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <div class="user_list" v-if="us_list">
          <v-text-field
            v-model="search"
            class="chat_search"
            flat
            hide-details
            label="Поиск"
            prepend-inner-icon="fa-search"
            solo-inverted
          ></v-text-field>
          <v-list subheader>
            <v-list-item
              v-for="us in susers"
              :key="us.id"
              :class="{'grey lighten-3': active_user === us.id}"
              @click="active_user = us.id"
            >
              <v-list-item-avatar v-if="us.avatar">
                <v-img :src="us.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-avatar v-else color="indigo">
                <v-icon dark>fa-user</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="us.login"></v-list-item-title>
                <v-list-item-subtitle v-text="us.username"></v-list-item-subtitle>
              </v-list-item-content>
              <!-- <v-list-item-icon>
          <v-icon :color="user.active ? 'deep-purple accent-4' : 'grey'">chat_bubble</v-icon>
              </v-list-item-icon>-->
            </v-list-item>
          </v-list>
        </div>
        <v-list subheader>
          <v-list-item
            v-for="chat in schat"
            :key="chat.id"
            :class="{'grey lighten-3': active_chat === chat.id}"
            @contextmenu.prevent="$refs.cmenu.open($event)"
            @click="active_chat = chat.id"
          >
            <v-list-item-avatar v-if="chat.avatar">
              <v-img :src="chat.avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-avatar v-else color="indigo">
              <v-icon dark>fa-user</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="chat.login"></v-list-item-title>
              <v-list-item-subtitle v-text="chat.username"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <vue-context ref="cmenu">
          <li>
              <a href="#" @click.prevent="editC(mesIndex)">
                <i class="fa fa-pencil"></i>Изменить
              </a>
          </li>
          <li>
            <a href="#" @click.prevent="deleteChat(active_chat)">
              <i class="fa fa-trash"></i>Удалить
            </a>
          </li>
        </vue-context>
      </div>
      <div class="right" v-if="active_user || active_chat">
        <div class="chat_content">
          
          <div class="conversation-start">
            <span>Today, 5:38 PM</span>
          </div>
          <transition-group name="slide-fade" tag="div" class="chat" ref="chat">
            <div
              class="bubble me"
              @contextmenu.prevent="$refs.menu.open($event), mesIndex = index"
              v-for="(ms, index) in messages"
              :key="'message'+index"
              v-text="ms.text"
            ></div>
          </transition-group>
          <vue-context ref="menu">
            <li>
              <a href="#" @click.prevent="editM(mesIndex)">
                <i class="fa fa-pencil"></i>Изменить
              </a>
            </li>
            <li>
              <a href="#" @click.prevent="deleteM(mesIndex)">
                <i class="fa fa-trash"></i>Удалить
              </a>
            </li>
          </vue-context>
          <form class="write" @submit.prevent="send(active_chat)">
            <label for="chat_file" class="write-link attach">
              <input id="chat_file" type="file" style="display: none" />
              <i class="fa fa-paperclip"></i>
            </label>
            <textarea type="text" v-model="message"></textarea>
            <emoji-picker @emoji="append" :search="search">
              <div
                class="write-link emoji-invoker"
                slot="emoji-invoker"
                slot-scope="{ events: { click: clickEvent } }"
                @click.stop="clickEvent"
              >
                <i class="fa fa-smile-o" aria-hidden="true"></i>
              </div>
              <div slot="emoji-picker" slot-scope="{ emojis, insert}">
                <div class="emoji-picker">
                  <div class="emoji-picker__search">
                    <input type="text" v-model="esearch" v-focus />
                  </div>
                  <div>
                    <div v-for="(emojiGroup, category) in emojis" :key="category">
                      <h5>{{ category }}</h5>
                      <div class="emojis">
                        <span
                          v-for="(emoji, emojiName) in emojiGroup"
                          :key="emojiName"
                          @click="insert(emoji)"
                          :title="emojiName"
                        >{{ emoji }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </emoji-picker>
            <button type="submit" class="write-link send">
              <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueContext } from 'vue-context';
import 'vue-context/dist/css/vue-context.css';
import { mapGetters, mapActions } from 'vuex';
export default {
  data() {
    return {
      input: '',
      messages: [],
      esearch: '',
      search: '',
      active: true,
      active_user: null,
      active_chat: null,
      emoji: false,
      page: 1,
      limit: 10,
      message: '',
      mesIndex: null,
      us_list: false
    };
  },
  created() {
    console.log(this.chats)
    this.load()
    this.getAllUsers();
  },
  watch: {
    us_list() {
      if (this.us_list) {
        this.getAllUsers();
      }
    },
    messages() {
      setTimeout(() => {
        this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
      });
    },
    active_user() {
      console.log(this.userId);
      //this.openChat(id)
    },
    active_chat() {
      for (let i in this.chats) {
        if (this.chats[i].id == this.active_chat) {
          this.messages = this.chats[i].rosters[0].user.messages;
        }
      }
    }
  },
  computed: {
    ...mapGetters(['user', 'userId', 'users', 'chats']),
    susers() {
      return this.users.filter(user => {
        return user.login.toLowerCase().includes(this.search.toLowerCase());
      });
    },
    schat() {
      return this.chats.filter(chat => {
        return chat.login
          .toLowerCase()
          .includes(this.search.toLowerCase());
      });
    }
  },
  methods: {
    ...mapActions(['getUsers', 'uploadFiles', 'createChat', 'loadChat']),
    async load(){
      // let res = await this.loadChat(this.userId);
      // if(res.data.success){
      //   this.chats.push(res.data.chat)
      // }
    },
    openChat(id) {
      this.$socket.emit('rosterJoined', id);
    },
    editM(index) {
      this.message = this.messages[index];
    },
    deleteChat(index) {},
    deleteM(index) {
      this.messages.splice(index, 1);
    },
    append(emoji) {
      this.message += emoji;
    },
    activeUser(id) {
      console.log(id);
    },
    getAllUsers() {
      let params = {
        page: this.page,
        limit: this.limit
      };
      this.getUsers(params);
    },
    send() {
      if (this.mesIndex !== null) {
        this.messages[this.mesIndex] = this.message;
        this.message = '';
        this.mesIndex = null;
      } else {
        // if(this.active_user){
        //   let data = {
        //     name: 'test',
        //     owner: this.userId,
        //     userId: this.active_user,
        //     text: this.message
        //   };
        //   this.createChat(data);
        // }
        let data = {
          id: this.active_chat,
          owner: this.userId,
          userId: this.active_user,
          text: this.message
        };
        this.$socket.emit('createMessage', data);
        // this.messages.push(this.message);
        // this.message = '';
      }
    }
  },
  components: {
    VueContext
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    }
  }
};
</script>

<style>
.emoji-picker {
  bottom: 45px;
  right: 0px;
  border: none;
  border-radius: 5px;
}
.user_list {
  position: absolute;
  background-color: #fff;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 99;
}
.chat_content {
  height: 100%;
  position: relative;
  overflow: hidden;
}
.chat_wrapper {
  position: relative;
  width: var(--wrapper);
  height: 100%;
}
.chat_container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--white);
}
.chat_container .left {
  float: left;
  width: 37.6%;
  height: 100%;
  position: relative;
  border-right: 1px solid #b1b1b1;
  background-color: var(--white);
}
.chat_container .left .theme--light.v-list {
  max-height: 100%;
  overflow-y: auto;
}
.chat_container .right {
  position: relative;
  float: left;
  width: 62.4%;
  height: 100%;
}
.chat_container .right .top {
  width: 100%;
  height: 47px;
  padding: 15px 29px;
  background-color: #eceff1;
}
.chat_container .right .write {
  position: absolute;
  bottom: 0;
  height: 80px;
  padding: 10px 25px;
  background-color: #f8fafc;
  width: 100%;
}
.chat_container .right .write .write-link {
  margin: 15px 5px;
  display: block;
  float: left;
  width: 28px;
  height: 28px;
  text-align: center;
  cursor: pointer;
}
.chat_container .right .write textarea {
  font-size: 16px;
  float: left;
  width: 75%;
  height: 100%;
  padding: 10px;
  border-radius: 5px;
  color: var(--dark);
  border: 0;
  outline: none;
  background-color: #e1e4e6;
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 400;
}
.chat_container .right .conversation-start {
  position: relative;
  width: 100%;
  margin-bottom: 27px;
  text-align: center;
}
.chat_container .right .conversation-start span:before,
.container .right .conversation-start span:after {
  position: absolute;
  top: 10px;
  display: inline-block;
  width: 30%;
  height: 1px;
  content: '';
  background-color: var(--light);
}
.chat_container .right .conversation-start span:before,
.container .right .conversation-start span:after {
  position: absolute;
  top: 10px;
  display: inline-block;
  width: 30%;
  height: 1px;
  content: '';
  background-color: var(--light);
}

.chat_container .right .bubble {
  font-size: 16px;
  position: relative;
  display: inline-block;
  clear: both;
  margin-bottom: 8px;
  padding: 13px 14px;
  vertical-align: top;
  border-radius: 5px;
}
.chat_container .right .bubble.me {
  float: right;
  color: var(--dark);
  background-color: #eceff1;
  align-self: flex-end;
  -webkit-animation-name: slideFromRight;
  animation-name: slideFromRight;
}
.chat_container .right .bubble.you {
  float: left;
  color: var(--white);
  background-color: var(--blue);
  align-self: flex-start;
  -webkit-animation-name: slideFromLeft;
  animation-name: slideFromLeft;
}
.chat_container .right .bubble:before {
  position: absolute;
  top: 19px;
  display: block;
  width: 8px;
  height: 6px;
  content: '\00a0';
  -webkit-transform: rotate(29deg) skew(-35deg);
  transform: rotate(29deg) skew(-35deg);
}
.chat_container .right .bubble.me:before {
  right: -3px;
  background-color: #eceff1;
}
.container .right .bubble.you:before {
  left: -3px;
  background-color: var(--blue);
}
.chat_container .right .chat {
  position: relative;
  display: flex;
  overflow-y: auto;
  padding: 25px 25px 80px;
  height: 100%;
  justify-content: flex-end;
  flex-direction: column;
}
.chat_messages {
  height: auto;
  overflow-y: auto;
}
.chat_wrapper .v-list-item {
  margin: 0;
  position: relative;
}
.chat_wrapper .v-list-item:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.12);
  width: 100%;
  height: 1px;
}
.chat_search.v-text-field.v-text-field--enclosed {
  margin: 10px;
}
.v-application--is-ltr .v-list-item__avatar:first-child {
  margin: 0;
}
.regular-input {
  padding: 0.5rem 1rem;
  border-radius: 3px;
  border: 1px solid #ccc;
  width: 20rem;
  height: 12rem;
  outline: none;
}
.regular-input:focus {
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}
.emoji-invoker {
  position: relative;
  display: inline-block;
  /* float: left; */
  margin: 10px 5px;
  border-radius: 50%;
  cursor: pointer;
}
.emoji-invoker:hover {
  color: #000;
}
.emoji-picker {
  position: absolute;
  z-index: 1;
  font-family: Montserrat;
  width: 15rem;
  height: 20rem;
  overflow: scroll;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 5px;
  background: #fff;
  box-shadow: 1px 1px 8px #c7dbe6af;
}
.emoji-picker__search {
  display: flex;
}
.emoji-picker__search > input {
  flex: 1;
  border-radius: 10rem;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  outline: none;
}
.emoji-picker h5 {
  margin-bottom: 0;
  color: #b1b1b1;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: default;
}
.emoji-picker .emojis {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.emoji-picker .emojis:after {
  content: '';
  flex: auto;
}
.emoji-picker .emojis span {
  padding: 0.2rem;
  cursor: pointer;
  border-radius: 5px;
}
.emoji-picker .emojis span:hover {
  background: #ececec;
  cursor: pointer;
}
</style>