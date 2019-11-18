<template>
  <div>
    <v-container fluid>
      <v-row height="100vh">
        <v-col md="12">
              <h2 align="center" class="grr">PREDICTION</h2>
    <LineChartFuture :dataChart="dataChart" />
        </v-col>
      </v-row>
    </v-container>

  </div>
</template>
<script>
import LineChartFuture from "@/components/LineChartFuture";

export default {
  name: "Future",
  props: {
    dataChart: Array
  },
  watch: {
    dataChart: async function(newVal, oldVal) {
      this.$emit("update:dataChart", newVal);
    }
  },
  components: {
    LineChartFuture
  }
};
</script>
<style>
.grr {
  color: rgb(1, 115, 103);
}
canvas {
  height: 110px;
  position: relative;
  width: 360px;
}
</style>