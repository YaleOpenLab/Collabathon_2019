<template>
  <div id="app">
    <canvas id="planet-chart"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  props: {
    dataChart: Array
  },
  watch: {
    dataChart: async function(newVal, oldVal) {
      this.$emit("update:dataChart", newVal);
    }
  },
  created() {
    console.log(this.dataChart)
  },
};
</script>