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
        <v-btn class="btnNav" text to="/simulator">
          <div class="btnText">Simulator</div>
        </v-btn>
        <v-btn class="btnNav" text to="/portfolio">
          <div class="btnText">Account</div>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    //
  })
};
</script>
