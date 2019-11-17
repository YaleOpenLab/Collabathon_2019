<template>
  <div>
    <div v-if="labels && years">
<<<<<<< HEAD
      <v-container style="height: 10vh">
=======
      <v-container style="position: relative; height: 10vh">
>>>>>>> chartwo
        <line-chart :chartData="datacollection"></line-chart>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataChart: Array
  },
  watch: {
    dataChart(val) {
      let emissions = {};
      val.forEach(report => {
        this.country = report.country;
        report.emissions.map(v => {
          if (!emissions[v.year]) {
            emissions[v.year] = v.value ? v.value : 0;
          } else {
            emissions[v.year] += v.value ? v.value : 0;
          }
        });
      });
      this.years = [...Object.keys(emissions)];
      this.labels = [...Object.values(emissions)];
      this.datacollection = {
        labels: this.years,
        datasets: [
          {
            label: this.country,
            backgroundColor: "rgb(1, 115, 103)",
            data: this.labels
          }
        ]
      };
    }
  },
  methods: {},
  data() {
    return {
      years: [],
      country: "",
      labels: [],
      datacollection: {}
    };
  }
};
</script>
