<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-row align="center" justify="center" class="ma-12">
            <v-select
              v-model="selectCountry"
              :items="items"
              label="Item"
              class="ma-3"
              required
            ></v-select>
            <v-select
              v-model="selectSector"
              :items="items"
              label="Item"
              class="ma-3"
              required
            ></v-select>
            <v-select
              v-model="selectGas"
              :items="items"
              label="Item"
              class="ma-3"
              required
            ></v-select>
            <v-select
              v-model="selectUnit"
              :items="items"
              label="Item"
              class="ma-3"
              required
            ></v-select>
          </v-row>
        </v-col>
        <v-range-slider v-model="selectYears"></v-range-slider>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  name: "form",
  data() {
    return {
      selectCountry: "",
      selectSector: "",
      selectGas: "",
      selectUnit: "",
      selectYears: "",
      itemsCountry: [],
      itemsSector: [],
      itemsGas: [],
      itemsUnit: [],
      itemsYears: []
    };
  }
};
</script>