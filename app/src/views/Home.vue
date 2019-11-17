<template>
  <div>
<<<<<<< HEAD
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
=======
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
>>>>>>> chartwo
      </v-row>
    </v-container>
  </div>
</template>

<script>
import LineChart from "@/components/LineChart";
<<<<<<< HEAD
import Doughnut from "@/components/Doughnut";
=======
>>>>>>> chartwo
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
<<<<<<< HEAD
    LineChart,
    Doughnut
  }
};
</script>
=======
    LineChart
  }
};
</script>

<style>
.grr {
  color: rgb(1, 115, 103);
}
</style>
>>>>>>> chartwo
