<template>
  <twemoji-picker
    :emojiData="emojiDataAll"
    :emojiGroups="emojiGroups"
    :skinsSelection="false"
    :searchEmojisFeat="true"
    searchEmojiPlaceholder="Search here."
    searchEmojiNotFound="Emojis not found."
    isLoadingLabel="Loading..."
  ></twemoji-picker>
</template>

<script>
  import {
    TwemojiPicker
  } from '@kevinfaguiar/vue-twemoji-picker';
  import EmojiAllData from '@kevinfaguiar/vue-twemoji-picker/emoji-data/ru/emoji-all-groups.json';
  import EmojiDataAnimalsNature from '@kevinfaguiar/vue-twemoji-picker/emoji-data/ru/emoji-group-animals-nature.json';
  import EmojiDataFoodDrink from '@kevinfaguiar/vue-twemoji-picker/emoji-data/ru/emoji-group-food-drink.json';
  import EmojiGroups from '@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json';
  export default {
    components: {
        'twemoji-picker': TwemojiPicker
    },
    computed: {
      emojiDataAll() {
        return EmojiAllData;
      },
      emojiGroups() {
        return EmojiGroups;
      }
    }
  }
</script>