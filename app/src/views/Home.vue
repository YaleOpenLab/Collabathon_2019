<template>
  <div>
    <LineChart :dataChart="dataChart"/>
  </div>
</template>

<script>
import LineChart from '@/components/LineChart';
export default {
  name: 'home',
   props: {
    dataChart: Array
  },
  watch: {
    dataChart: async function(newVal, oldVal) {
      this.$emit("update:dataChart", newVal);
    }
  },
  components: {
    LineChart
      },
  
}
</script>