<template>
  <div>
    <v-container fluid>
      <div v-if="!loading">
        <v-row>
          <v-col cols="12">
            <v-row align="center" justify="center" class="ma-12">
              <v-select
                v-model="selectLocation"
                :items="itemsLocation"
                @change="changeLocation"
                label="Location"
                class="ma-3"
              ></v-select>
              <v-select
                v-model="selectScenario"
                @change="changeSenario"
                :items="itemsScenario"
                label="Scenario"
                class="ma-3"
              ></v-select>
              <v-select
                v-model="selectIndicator"
                @change="changeIndicator"
                :items="itemsIndicator"
                label="Indicator"
                class="ma-3"
              ></v-select>
              <v-select
                v-model="selectUnit"
                @change="changeUnit"
                :items="itemsUnit"
                label="Unit"
                class="ma-3"
              ></v-select>
            </v-row>
          </v-col>
          <!-- <v-range-slider v-model="selectYears"></v-range-slider> -->
        </v-row>
      </div>
      <div v-else>
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
    </v-container>
  </div>
</template>

<script>
import { location, scenario, indicator, unit } from "../utils/fieldFormFuture";
export default {
  name: "formData",
  data() {
    return {
      loading: true,
      dataChart: "",
      locationFutureData: "",
      selectLocation: location[0],
      selectScenario: "",
      selectIndicator: "",
      selectUnit: unit[0],
      selectYears: "",
      itemsLocation: location,
      itemsScenario: scenario,
      itemsIndicator: indicator,
      itemsUnit: unit
    };
  },
  async created() {
    try {
      const data = { location: this.selectLocation };
      let res = await axios.post(
        `${process.env.VUE_APP_API_URL}/data/getFutureWithLocation`,
        data
      );
      this.loading = false;
      this.dataChart = res.data.data;
      this.locationFutureData = res.data.data;
      this.$emit("updateData", this.dataChart);
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    beforeChange(changeValue) {
      let tmpArray = this.locationFutureData;
      tmpArray = tmpArray.filter(k => {
        if (changeValue === "Scenario") {
          return (
            k.indicator == (this.selectIndicator || k.indicator) &&
            k.unit == (this.selectUnit || k.unit)
          );
        } else if (changeValue === "Indicator") {
          return (
            k.unit == (this.selectUnit || k.unit) &&
            k.scenario == (this.selectScenario || k.scenario)
          );
        } else if (changeValue === "Unit") {
          return (
            k.scenario == (this.selectScenario || k.scenario) &&
            k.indicator == (this.selectIndicator || k.indicator)
          );
        } else if (changeValue === "Location") {
          return (
            k.scenario == (this.selectScenario || k.scenario) &&
            k.unit == (this.selectUnit || k.unit) &&
            k.indicator == (this.selectIndicator || k.indicator)
          );
        }
      });
      return tmpArray;
    },
    async changeLocation() {
      const data = { location: this.selectLocation };
      let res = await axios.post(
        `${process.env.VUE_APP_API_URL}/data/getFutureWithLocation`,
        data
      );
      this.dataChart = res.data.data;
      this.locationFutureData = this.dataChart;
      this.dataChart = this.beforeChange("Location");
      this.$emit("updateData", this.dataChart);
    },
    async changeSenario() {
      const data = { scenario: this.selectScenario };
      let res = await axios.post(
        `${process.env.VUE_APP_API_URL}/data/getFutureWithScenario`,
        data
      );
      const tmpData = this.beforeChange("Senario");
      this.dataChart = res.data.data.filter(o =>
        tmpData.find(o2 => o._id === o2._id)
      );
      this.$emit("updateData", this.dataChart);
    },
    async changeIndicator() {
      const data = { indicator: this.selectIndicator };
      let res = await axios.post(
        `${process.env.VUE_APP_API_URL}/data/getFutureWithIndicator`,
        data
      );
      const tmpData = this.beforeChange("Indicator");
      this.dataChart = res.data.data.filter(o =>
        tmpData.find(o2 => o._id === o2._id)
      );
      this.$emit("updateData", this.dataChart);
    },
    async changeUnit() {
      const data = { unit: this.selectUnit };
      let res = await axios.post(
        `${process.env.VUE_APP_API_URL}/data/getFutureWithUnit`,
        data
      );
      const tmpData = this.beforeChange("Unit");
      this.dataChart = res.data.data.filter(o =>
        tmpData.find(o2 => o._id === o2._id)
      );
      this.$emit("updateData", this.dataChart);
    }
  }
};
</script>