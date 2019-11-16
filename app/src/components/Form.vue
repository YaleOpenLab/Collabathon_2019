<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-row align="center" justify="center" class="ma-12">
            <v-select
              v-model="selectCountry"
              :items="itemsCountry"
              label="Item"
              class="ma-3"
              required
            ></v-select>
            <v-select
              v-model="selectSector"
              :items="itemsSector"
              label="Item"
              class="ma-3"
              required
            ></v-select>
            <v-select v-model="selectGas" :items="itemsGas" label="Item" class="ma-3" required></v-select>
            <v-select v-model="selectUnit" :items="itemsUnit" label="Item" class="ma-3" required></v-select>
            {{data}}
          </v-row>
        </v-col>
        <v-range-slider v-model="selectYears"></v-range-slider>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { country, sector, gas, unit } from "../utils/fieldForm";
export default {
  name: "form",
  data() {
    return {
      data: "",
      selectCountry: "",
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
  async mounted() {
    console.log(process.env.VUE_APP_API_URL)
    this.data = axios.post(`${process.env.VUE_APP_API_URL}/`);
  }
};
</script>