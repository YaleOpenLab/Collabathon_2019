<template>
  <div>
    <LineChartFuture :dataChart="dataChart" />
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