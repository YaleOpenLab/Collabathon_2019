<template>
  <div>
    <v-container class="grey lighten-5">
      <v-row>
          <v-col cols="12">
            <LineChart :dataChart="dataChart" />
          </v-col>
      </v-row>
      <v-row>
          <v-col cols="12">
            <Doughnut :dataChart="dataChart" />
          </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import LineChart from "@/components/LineChart";
import Doughnut from "@/components/Doughnut";
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
    LineChart,
    Doughnut
  }
};
</script>