<template>
  <div>
    <div v-if="labels && years">
      <v-container style="height: 10vh">
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
      val.forEach(future => {
        this.location = future.location;
        future.emissions.map(v => {
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
            label: this.location,
            borderColor: "rgb(1, 115, 103)",
            borderWidth: 5,
            pointBackgroundColor: "rgb(1, 90, 103)",
            pointBorderColor: "rgb(1, 90, 103)",
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
      location: "",
      labels: [],
      datacollection: {}
    };
  }
};
</script>
