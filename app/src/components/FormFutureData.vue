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
                @change="changeCountry"
                label="Country"
                class="ma-3"
              ></v-select>
              <v-select
                v-model="selectScenario"
                @change="changeSector"
                :items="itemsScenario"
                label="Sector"
                class="ma-3"
              ></v-select>
              <v-select
                v-model="selectIndicator"
                @change="changeGas"
                :items="itemsIndicator"
                label="Gas"
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
      countryFutureData: "",
      selectLocation: location[0],
      selectScenario: "",
      selectIndicator: "",
      selectUnit: "",
      selectYears: "",
      itemsLocation: location,
      itemsScenario: scenario,
      itemsIndicator: indicator,
      itemsUnit: unit
    };
  },
  async created() {
    try {
      const data = { location: this.selectCountry };
      let res = await axios.post(
        `${process.env.VUE_APP_API_URL}/data/getFutureWithLocation`,
        data
      );
      this.loading = false;
      this.dataChart = res.data.data;
      this.countryFutureData = res.data.data;
      this.$emit("updateData", this.dataChart);
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    beforeChange(changeValue) {
      let tmpArray = this.countryFutureData;
      tmpArray = tmpArray.filter(k => {
        if (changeValue === "Sector") {
          return (
            k.gas == (this.selectGas || k.gas) &&
            k.unit == (this.selectUnit || k.unit)
          );
        } else if (changeValue === "Unit") {
          return (
            k.gas == (this.selectGas || k.gas) &&
            k.sector == (this.selectSector || k.sector)
          );
        } else if (changeValue === "Gas") {
          return (
            k.sector == (this.selectSector || k.sector) &&
            k.unit == (this.selectUnit || k.unit)
          );
        } else if (changeValue === "Country") {
          return (
            k.sector == (this.selectSector || k.sector) &&
            k.unit == (this.selectUnit || k.unit) &&
            k.gas == (this.selectGas || k.gas)
          );
        }
      });
      return tmpArray;
    },
    async changeCountry() {
      const data = { country: this.selectCountry };
      let res = await axios.post(
        `${process.env.VUE_APP_API_URL}/data/getDataWithCountry`,
        data
      );
      this.dataChart = res.data.data;
      this.countryFutureData = this.dataChart;
      this.dataChart = this.beforeChange("Country");
      this.$emit("updateData", this.dataChart);
    },
    async changeSector() {
      const data = { sector: this.selectSector };
      let res = await axios.post(
        `${process.env.VUE_APP_API_URL}/data/getDataWithSector`,
        data
      );
      const tmpData = this.beforeChange("Sector");
      this.dataChart = res.data.data.filter(o =>
        tmpData.find(o2 => o._id === o2._id)
      );
      this.$emit("updateData", this.dataChart);
    },
    async changeGas() {
      const data = { gas: this.selectGas };
      let res = await axios.post(
        `${process.env.VUE_APP_API_URL}/data/getDataWithGas`,
        data
      );
      const tmpData = this.beforeChange("Gas");
      this.dataChart = res.data.data.filter(o =>
        tmpData.find(o2 => o._id === o2._id)
      );
      this.$emit("updateData", this.dataChart);
    },
    async changeUnit() {
      const data = { unit: this.selectUnit };
      let res = await axios.post(
        `${process.env.VUE_APP_API_URL}/data/getDataWithUnit`,
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