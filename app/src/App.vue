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
        <v-btn class="btnNav" text to="/go">
          <div class="btnText">Trade</div>
        </v-btn>
        <v-btn class="btnNav" text to="/portfolio">
          <div class="btnText">Account</div>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <FormData v-on:updateData="onChangeData" />
      <router-view :dataChart="dataChart" />
    </v-content>
  </v-app>
</template>

<script>
import FormData from "@/components/FormData";

export default {
  name: "App",

  components: {
    FormData
  },
  methods: {
    onChangeData(val) {
      this.dataChart = val;
    }
  },
  data() {
    return {
      dataChart: []
    };
  }
};
</script>
