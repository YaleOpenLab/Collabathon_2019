<template>
  <div>
    <v-container fluid>
      <v-row height="100vh">
        <v-col md="12">
          <h2 align="center" class="grr">MOST POLUTING INDUSTRIES</h2>
          <LineChart :sectorChart="sectorsChart" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import LineChart from "@/components/LineChart";

export default {
  props: {
    sectorChart: Array
  },
  watch: {
    sectorChart: async function(newVal, oldVal) {
      this.$emit("update:sectorChart", newVal);
    }
  },
  components: {
    LineChart
  },
  data() {
    return {
      sectorsChart: []
    };
  },
  async created() {
    try {
      const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/data/mostPollutingSector`
      );
      this.sectorsChart = res.data.data;
    } catch (e) {
      console.error(e);
    }
  }
};
</script>

<style>
.grr {
  color: rgb(1, 115, 103);
}
canvas {
  height: 110px;
  position: relative;
  width: 360px;
}
</style>