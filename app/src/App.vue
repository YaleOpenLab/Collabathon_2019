<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/">
          <v-img src="@/assets/logo.png" width="60" height="60"></v-img>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn class="btnNav" text to="/">
          <div class="btnText">Explore</div>
        </v-btn>
        <v-btn class="btnNav" text to="/future">
          <div class="btnText">Future</div>
        </v-btn>
        <v-btn class="btnNav" text to="/maps">
          <div class="btnText">Map</div>
        </v-btn>
        <v-btn class="btnNav" text to="/portfolio">
          <div class="btnText">Account</div>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <div v-if="$store.state.whichForm !== 'maps'">
        <div v-if="$store.state.whichForm !== 'future'">
          <FormData v-on:updateData="onChangeData" />
        </div>
        <div v-else>
          <FormFutureData v-on:updateData="onChangeData" />
        </div>
      </div>
      <router-view :dataChart="dataChart" />
    </v-content>
  </v-app>
</template>

<script>
import router from "./router/index";
import FormData from "@/components/FormData";
import FormFutureData from "@/components/FormFutureData";

export default {
  name: "App",

  components: {
    FormData,
    FormFutureData
  },
  methods: {
    onChangeData(val) {
      this.dataChart = val;
    }
  },
  data() {
    return {
      dataChart: [],
      whichForm: ""
    };
  },
  watch: {
    $route(to, from) {
      if (router.resolve(to).route.name) {
        this.$store.commit("SET_WICHFORM", router.resolve(to).route.name);
      }
    }
  }
};
</script>
