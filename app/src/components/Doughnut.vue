<template>
  <div>
    <div v-if="labels && years">
      <v-container style="height: 10vh">
        <Doughnut :chartData="datacollection"></Doughnut>
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
      let i = 0;
      let colors = [`rgba(${i},73,93,.5)`];
      for (let i = 1; i < this.years.length; i++) {
        colors.push(`rgba(${i},73,93,1)`);
      }
      this.datacollection = {
        labels: this.years,
        datasets: [
          {
            label: this.country,
            backgroundColor: colors,
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
