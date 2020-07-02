<template>
  <v-container>
    <v-row>
      <v-col col="12" sm="4">
        <v-card class="mx-auto" outlined color="red" dark>
          <v-card-title>
            <v-icon large left>fa-bar-chart</v-icon>
            <span class="title font-weight-light">За год</span>
          </v-card-title>

          <v-card-text class="headline font-weight-bold">
      5699
    </v-card-text>
        </v-card>
      </v-col>
      <v-col col="12" sm="4">
        <v-card class="mx-auto" outlined color="orange" dark>
          <v-card-title>
            <v-icon large left>fa-bar-chart</v-icon>
            <span class="title font-weight-light">За месяц</span>
          </v-card-title>

          <v-card-text class="headline font-weight-bold">
      256
    </v-card-text>
        </v-card>
      </v-col>
      <v-col col="12" sm="4">
        <v-card class="mx-auto" outlined color="green" dark>
          <v-card-title>
            <v-icon large left>fa-bar-chart</v-icon>
            <span class="title font-weight-light">За сегодня</span>
          </v-card-title>

          <v-card-text class="headline font-weight-bold">
      536
    </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card class="mt-6 mx-auto">
          <v-sheet
            class="v-sheet--offset mx-auto"
            color="cyan"
            elevation="12"
            max-width="calc(100% - 32px)"
          >
            <v-sparkline
              :labels="timeslabels"
              :value="times"
              color="white"
              line-width="2"
              padding="16"
            ></v-sparkline>
          </v-sheet>

          <v-card-text class="pt-0">
            <div class="title font-weight-light mb-2">За первое полугодие</div>
            <div class="subheading font-weight-light grey--text">Поступившие обращения</div>
            <v-divider class="my-2"></v-divider>
            <v-icon class="mr-2" small>mdi-clock</v-icon>
            <span class="caption grey--text font-weight-light">Количество за каждый месяц</span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card class="mt-6 mx-auto">
          <v-sheet
            class="v-sheet--offset mx-auto"
            color="green"
            elevation="12"
            max-width="calc(100% - 32px)"
          >
            <v-sparkline
              :labels="countlabels"
              :value="count"
              color="white"
              line-width="2"
              padding="16"
            ></v-sparkline>
          </v-sheet>

          <v-card-text class="pt-0">
            <div class="title font-weight-light mb-2">За второе полугодие</div>
            <div class="subheading font-weight-light grey--text">Поступившие обращения</div>
            <v-divider class="my-2"></v-divider>
            <v-icon class="mr-2" small>mdi-clock</v-icon>
            <span class="caption grey--text font-weight-light">Количество за каждый месяц</span>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- <pre>{{posts.length}}</pre> -->
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    timeslabels: ["январь ", "февраль ", "март ", "фпрель ", "май", "июнь"],
    times: [200, 675, 410, 390, 310, 200],
    countlabels: ["июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
    count: [675, 410, 390, 310, 345, 421]
  }),
  computed: {
    ...mapGetters(["posts"])
    // countlabels(){
    //   console.log(this.posts)
    // }
  },
  created() {
    this.getNowDate();
  },
  methods: {
    ...mapActions(["loadPost"]),
    getNowDate() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      today = dd + "-" + mm + "-" + yyyy;
      let params = {
        status: this.sortBy,
        pagin: {
          page: 1,
          limit: 20,
          status: "Все",
          dateinterval: new Date(today),
          userId: this.userId
        }
      };
      this.loadPost(params);
    }
  }
};
</script>
<style>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>