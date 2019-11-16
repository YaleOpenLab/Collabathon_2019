<template>
  <div>
    <v-container fluid>
      <div v-if="!loading">
        <v-row>
          <v-col cols="12">
            <v-row align="center" justify="center" class="ma-12">
              <v-select
                v-model="selectCountry"
                :items="itemsCountry"
                @change="changeCountry"
                label="Country"
                class="ma-3"
              ></v-select>
              <v-select v-model="selectSector" :items="itemsSector" label="Sector" class="ma-3"></v-select>
              <v-select v-model="selectGas" :items="itemsGas" label="Gas" class="ma-3"></v-select>
              <v-select v-model="selectUnit" :items="itemsUnit" label="Unit" class="ma-3"></v-select>
            </v-row>
          </v-col>
          <!-- <v-range-slider v-model="selectYears"></v-range-slider> -->
        </v-row>
      </div>
      <div v-else>
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
    </v-container>
    {{dataChart}}
    {{allData}}
  </div>
</template>

<script>
import { country, sector, gas, unit } from "../utils/fieldForm";
export default {
  name: "formData",
  data() {
    return {
      loading: true,
      dataChart: "",
      allData: "",
      selectCountry: country[0],
      selectSector: "",
      selectGas: "",
      selectUnit: "",
      selectYears: "",
      itemsCountry: country,
      itemsSector: sector,
      itemsGas: gas,
      itemsUnit: unit,
      itemsYears: []
    };
  },
  async created() {
    try {
      const data = { country: this.selectCountry };
      let res = await axios.post(
        `${process.env.VUE_APP_API_URL}/data/getDataWithCountry`,
        data
      );
      this.loading = false;
      this.dataChart = res.data.data;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    async changeCountry() {
      this.dataChart = this.dataChart.filter(
        k => k.country == this.selectCountry
      );
      console.log(this.dataChart);
    }
  }
};
</script>