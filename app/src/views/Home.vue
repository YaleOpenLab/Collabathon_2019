<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col md="6">
          <h2 align="center" class="grr">CO2 WORLD COUNTRIES EMISSIONS</h2>
          <LineChart :dataChart="dataChart" />
        </v-col>
        <v-col md="6">
          <h2 align="center" class="grr">MOST POLUTING INDUSTRIES</h2>
          <LineChart :dataChart="dataChart" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import LineChart from "@/components/LineChart";
export default {
  name: "home",
  props: {
    dataChart: Array
  },
  watch: {
    dataChart: async function(newVal, oldVal) {
      this.$emit("update:dataChart", newVal);
    }
  },
  components: {
    LineChart
  }
};
</script>

<style>
.grr {
  color: rgb(1, 115, 103);
}
</style>