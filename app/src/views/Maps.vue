<template>
  <div>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="2">
          <svg-map :map="Australia" />
          <v-row align="end" justify="center">
            <p>Australia</p>
          </v-row>
        </v-col>
        <v-col cols="2">
          <svg-map :map="Taiwan" />
          <v-row align="end" justify="center">
            <p>Taiwan</p>
          </v-row>
        </v-col>
        <v-col cols="2">
          <svg-map :map="FranceRegions" />
          <v-row align="end" justify="center">
            <p>France</p>
          </v-row>
        </v-col>
        <v-col cols="2">
          <svg-map :map="Canada" />
          <v-row align="end" justify="center">
            <p>Canada</p>
          </v-row>
        </v-col>
        <v-col cols="2">
          <svg-map :map="Germany" />
          <v-row align="end" justify="center">
            <p>Germany</p>
          </v-row>
        </v-col>
        <v-col cols="2">
          <svg-map :map="HongKong" />
          <v-row align="end" justify="center">
            <p>HongKong</p>
          </v-row>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="2">
          <svg-map :map="India" />
          <v-row align="end" justify="center">
            <p>India</p>
          </v-row>
        </v-col>
        <v-col cols="2">
          <svg-map :map="Japan" />
          <v-row align="end" justify="center">
            <p>Japan</p>
          </v-row>
        </v-col>
        <v-col cols="2">
          <svg-map :map="NewZealand" />
          <v-row align="end" justify="center">
            <p>NewZealand</p>
          </v-row>
        </v-col>
        <v-col cols="2">
          <svg-map :map="SouthKorea" />
          <v-row align="end" justify="center">
            <p>SouthKorea</p>
          </v-row>
        </v-col>
        <v-col cols="2">
          <svg-map :map="Tunisia" />
          <v-row align="end" justify="center">
            <p>Tunisia</p>
          </v-row>
        </v-col>
        <v-col cols="2">
          <svg-map :map="Usa" />
          <v-row align="end" justify="center">
            <p>Usa</p>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { SvgMap } from "vue-svg-map";
import Australia from "@svg-maps/australia";
import Taiwan from "@svg-maps/taiwan";
import FranceRegions from "@svg-maps/france.regions";
import Canada from "@svg-maps/canada";
import Germany from "@svg-maps/germany";
import HongKong from "@svg-maps/hong-kong";
import India from "@svg-maps/india";
import Japan from "@svg-maps/japan";

import NewZealand from "@svg-maps/new-zealand";
import SouthKorea from "@svg-maps/south-korea";
import Tunisia from "@svg-maps/tunisia";
import Usa from "@svg-maps/usa";
export default {
  name: "Maps",
  components: {
    SvgMap
  },
  data() {
    return {
      Taiwan,
      Australia,
      FranceRegions,
      Canada,
      Germany,
      HongKong,
      India,
      Japan,
      NewZealand,
      SouthKorea,
      Tunisia,
      Usa
    };
  },
  created() {}
};
</script>