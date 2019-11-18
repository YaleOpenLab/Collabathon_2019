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
    dataChart: Array,
    sectorChart: Array
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
    },
    sectorChart(val) {
      let grr = 100;
      this.datacollection = {
        labels: this.years,
        datasets: []
      };
      let maxYear = 1000;
      let minYear = 3000;
      val.forEach(v => {
        grr += 10;
        this.datacollection.datasets.push({
          backgroundColor: `rgb(1, ${grr}, 103)`,
          label: v.sector,
          data: Object.values(v.emissions)
        });  
        if (Object.keys(v.emissions)[0] < minYear) {
          minYear = Object.keys(v.emissions)[0];
        }
        if (maxYear < Object.keys(v.emissions).pop()) {
          maxYear = Object.keys(v.emissions).pop();
        }
      });
      for (let i = minYear; i < maxYear; i++) {
        this.years.push(+i);
      }
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
